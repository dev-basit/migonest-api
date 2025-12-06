const bcrypt = require("bcrypt");
const _ = require("lodash");
const { db } = require("../startup/db");
const { Utils } = require("../utils");

const userBasicInfo = {
  id: true,
  userName: true,
  firstName: true,
  lastName: true,
  email: true,
  profilePicture: true,
  type: true,
  preferences: true,
};

const userInfo = {
  id: true,
  userName: true,
  firstName: true,
  lastName: true,
  profilePicture: true,
  coverPicture: true,
  email: true,
  // password: true,
  dateOfBirth: true,
  gender: true,
  type: true,
  isVerified: true,
  emailVerificationCode: true,
  fotgotPasswordOtp: true,
  fotgotPasswordOtpExpiry: true,
  preferences: true,
  about: true,
  stripeCustomerId: true,
  currentSubscriptionId: true,
  createdAt: true,
  updatedAt: true,
};

const userInfoWithPassword = {
  id: true,
  userName: true,
  firstName: true,
  lastName: true,
  profilePicture: true,
  coverPicture: true,
  email: true,
  password: true,
  dateOfBirth: true,
  gender: true,
  type: true,
  isVerified: true,
  emailVerificationCode: true,
  fotgotPasswordOtp: true,
  fotgotPasswordOtpExpiry: true,
  preferences: true,
  about: true,
  stripeCustomerId: true,
  currentSubscriptionId: true,
  createdAt: true,
  updatedAt: true,
};

const userDetails = {
  id: true,
  userName: true,
  firstName: true,
  lastName: true,
  profilePicture: true,
  coverPicture: true,
  email: true,
  // password: true,
  dateOfBirth: true,
  gender: true,
  type: true,
  isVerified: true,
  emailVerificationCode: true,
  fotgotPasswordOtp: true,
  fotgotPasswordOtpExpiry: true,
  preferences: true,
  about: true,
  documents: true,
  stripeCustomerId: true,
  currentSubscriptionId: true,
  // currentSubscription: {
  //   select: {
  //     id: true,
  //     planType: true,
  //     stripeSubscriptionId: true,
  //     status: true,
  //     currentPeriodStart: true,
  //     currentPeriodEnd: true,
  //     cancelAtPeriodEnd: true,
  //   },
  // },
  // becomeUniExpertRequests: true,
  createdAt: true,
  updatedAt: true,
  followers: true,
  following: true,
  experiences: true,
  education: true,
  ielts: true,
};

async function findUser(params = {}) {
  try {
    const user = await db.users.findFirst({ where: params, select: userInfo });
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function findUserWithPassword(params = {}) {
  try {
    const user = await db.users.findUnique({ where: params, select: userInfoWithPassword });
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function findUserDetails(params = {}) {
  try {
    const user = await db.users.findUnique({ where: params, select: userDetails });
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function findUserById(id) {
  try {
    const user = await db.users.findUnique({ where: { id }, select: userInfo });
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function findUserDetailsById(id) {
  try {
    const user = await db.users.findUnique({ where: { id }, select: userDetails });

    return user;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function findUsers(params = {}) {
  try {
    const users = await db.users.findMany({ where: params, select: userInfo });
    return users;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function findUsersPublic(params = {}, { skip = 0, pageSize = 10 }) {
  try {
    const [users, count] = await Promise.all([
      db.users.findMany({
        where: params,
        select: userBasicInfo,
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      db.users.count({ where: params }),
    ]);

    return { users, count };
  } catch (error) {
    throw new Error(error.message);
  }
}

async function findUsersSuggestions(params = {}, { skip = 0, pageSize = 10 }) {
  try {
    const [users, count] = await Promise.all([
      db.users.findMany({
        where: params,
        select: userBasicInfo,
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      db.users.count({ where: params }),
    ]);

    return { users, count };
  } catch (error) {
    throw new Error(error.message);
  }
}

async function findUserFollowers(params = {}) {
  try {
    const followers = await db.usersFollow.findUnique({ where: params });
    return followers;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function createUser(newUserData) {
  try {
    const data = _.pick(newUserData, [
      "userName",
      "firstName",
      "lastName",
      "email",
      "password",
      "profilePicture",
      "date",
      "gender",
      "type",
      "stripeCustomerId",
    ]);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);
    const emailVerificationCode = Utils.generateCode(6);

    const user = await db.users.create({
      data: {
        ...data,
        password: hashedPassword,
        emailVerificationCode,
        // documents: data.documents || [],
        preferences: data.preferences || "{}",
      },
      select: userInfo,
    });

    return user;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function addFollowRelationship(followerId, followingId) {
  await db.usersFollow.create({ data: { followerId, followingId } });
}

async function removeFollowRelationship(followerId, followingId) {
  await db.usersFollow.delete({ where: { followerId, followingId } });
}

async function updateUser(userId, updatedData) {
  try {
    return await db.users.update({ where: { id: userId }, data: updatedData });
  } catch (error) {
    throw new Error(error.message);
  }
}

exports.userRepository = {
  findUser,
  findUserById,
  findUserWithPassword,
  findUsersPublic,
  findUserDetails,
  findUserDetailsById, // public info
  findUsers,
  findUsersSuggestions,
  findUserFollowers,
  createUser,
  updateUser,
  addFollowRelationship,
};
