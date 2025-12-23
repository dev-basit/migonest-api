-- CreateEnum
CREATE TYPE "Genders" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "UserTypes" AS ENUM ('STUDENT', 'UNI_EXPERT', 'ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "UniExpertRequestStatus" AS ENUM ('OPEN', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "BecomeUniExpertStatus" AS ENUM ('OPEN', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "MessageTypes" AS ENUM ('TEXT', 'IMAGE', 'VIDEO');

-- CreateEnum
CREATE TYPE "NotificationTypes" AS ENUM ('REQUEST', 'MESSAGE', 'ALERT');

-- CreateEnum
CREATE TYPE "SubscriptionTypes" AS ENUM ('MONTH', 'YEAR');

-- CreateEnum
CREATE TYPE "PurchasesTypes" AS ENUM ('UNI_EXPERT_REQUEST', 'SUBSCRIPTION');

-- CreateTable
CREATE TABLE "Users" (
    "id" UUID NOT NULL,
    "userName" VARCHAR(128) NOT NULL,
    "firstName" VARCHAR(128) NOT NULL,
    "lastName" VARCHAR(128) NOT NULL,
    "profilePicture" VARCHAR(512) NOT NULL,
    "coverPicture" VARCHAR(512),
    "email" VARCHAR(128) NOT NULL,
    "password" VARCHAR(1024) NOT NULL,
    "dateOfBirth" TIMESTAMP(3),
    "gender" "Genders" NOT NULL,
    "type" "UserTypes" NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "emailVerificationCode" VARCHAR(6),
    "fotgotPasswordOtp" VARCHAR(6),
    "fotgotPasswordOtpExpiry" TIMESTAMP(3),
    "preferences" JSONB NOT NULL DEFAULT '{}',
    "about" VARCHAR(1024),
    "stripeCustomerId" VARCHAR(255) NOT NULL,
    "currentSubscriptionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Documents" (
    "id" UUID NOT NULL,
    "label" VARCHAR(128) NOT NULL,
    "url" VARCHAR(1024) NOT NULL,
    "userId" UUID,
    "universitiesId" UUID,
    "admissionId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsersFollow" (
    "id" UUID NOT NULL,
    "followerId" UUID NOT NULL,
    "followingId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UsersFollow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Experiences" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "jobTitle" VARCHAR(128) NOT NULL,
    "company" VARCHAR(128) NOT NULL,
    "address" VARCHAR(512) NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Experiences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Education" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "institutionName" VARCHAR(128) NOT NULL,
    "address" VARCHAR(512) NOT NULL,
    "degree" VARCHAR(128) NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "totalScore" DECIMAL(5,2),
    "scoreGained" DECIMAL(5,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Education_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ielts" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "name" VARCHAR(128) NOT NULL,
    "overallScore" DECIMAL(5,2),
    "listening" DECIMAL(5,2),
    "reading" DECIMAL(5,2),
    "writing" DECIMAL(5,2),
    "speaking" DECIMAL(5,2),
    "givenDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ielts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Posts" (
    "id" UUID NOT NULL,
    "authorId" UUID NOT NULL,
    "content" VARCHAR(1500) NOT NULL,
    "picture" VARCHAR(1024) DEFAULT '',
    "isShared" BOOLEAN NOT NULL DEFAULT false,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostLikes" (
    "id" UUID NOT NULL,
    "postId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PostLikes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Universities" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "requirements" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "deadline" TIMESTAMP(3),
    "tuitionFee" VARCHAR(16) NOT NULL,
    "applicationFee" VARCHAR(16) NOT NULL,
    "location" VARCHAR(512),
    "uniExpertId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Universities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UniExpertRequests" (
    "id" UUID NOT NULL,
    "uniExpertId" UUID NOT NULL,
    "studentId" UUID NOT NULL,
    "universityId" UUID NOT NULL,
    "acceptStatus" "UniExpertRequestStatus" NOT NULL DEFAULT 'OPEN',
    "paymentStatus" BOOLEAN NOT NULL DEFAULT false,
    "stripePurchaseId" VARCHAR(512),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UniExpertRequests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admissions" (
    "id" UUID NOT NULL,
    "step" INTEGER NOT NULL DEFAULT 0,
    "uniExpertRequestId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BecomeUniExperts" (
    "id" UUID NOT NULL,
    "studentId" UUID NOT NULL,
    "acceptStatus" "BecomeUniExpertStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BecomeUniExperts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conversations" (
    "id" UUID NOT NULL,
    "lastMessageId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConversationMembers" (
    "id" UUID NOT NULL,
    "conversationId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "unreadCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ConversationMembers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Messages" (
    "id" UUID NOT NULL,
    "type" "MessageTypes" NOT NULL DEFAULT 'TEXT',
    "message" VARCHAR(2048) NOT NULL,
    "senderId" UUID NOT NULL,
    "conversationId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notifications" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "type" "NotificationTypes" NOT NULL DEFAULT 'REQUEST',
    "message" VARCHAR(128) NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscriptions" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "planType" "SubscriptionTypes" NOT NULL DEFAULT 'MONTH',
    "stripeSubscriptionId" VARCHAR(255) NOT NULL,
    "status" VARCHAR(50) NOT NULL,
    "currentPeriodStart" TIMESTAMP(3) NOT NULL,
    "currentPeriodEnd" TIMESTAMP(3) NOT NULL,
    "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Purchases" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "uniExpertRequestId" UUID,
    "subscriptionId" UUID,
    "type" "PurchasesTypes" NOT NULL DEFAULT 'UNI_EXPERT_REQUEST',
    "amount" DECIMAL(10,2) NOT NULL,
    "stripePurchaseId" VARCHAR(255) NOT NULL,
    "purchaseDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Purchases_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Users_stripeCustomerId_key" ON "Users"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "Users_currentSubscriptionId_key" ON "Users"("currentSubscriptionId");

-- CreateIndex
CREATE INDEX "Users_email_idx" ON "Users"("email");

-- CreateIndex
CREATE INDEX "Users_userName_idx" ON "Users"("userName");

-- CreateIndex
CREATE INDEX "UsersFollow_followerId_idx" ON "UsersFollow"("followerId");

-- CreateIndex
CREATE INDEX "UsersFollow_followingId_idx" ON "UsersFollow"("followingId");

-- CreateIndex
CREATE UNIQUE INDEX "UsersFollow_followerId_followingId_key" ON "UsersFollow"("followerId", "followingId");

-- CreateIndex
CREATE INDEX "Experiences_userId_idx" ON "Experiences"("userId");

-- CreateIndex
CREATE INDEX "Education_userId_idx" ON "Education"("userId");

-- CreateIndex
CREATE INDEX "Ielts_userId_idx" ON "Ielts"("userId");

-- CreateIndex
CREATE INDEX "Posts_authorId_idx" ON "Posts"("authorId");

-- CreateIndex
CREATE INDEX "PostLikes_postId_idx" ON "PostLikes"("postId");

-- CreateIndex
CREATE INDEX "PostLikes_userId_idx" ON "PostLikes"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PostLikes_postId_userId_key" ON "PostLikes"("postId", "userId");

-- CreateIndex
CREATE INDEX "Universities_uniExpertId_idx" ON "Universities"("uniExpertId");

-- CreateIndex
CREATE INDEX "UniExpertRequests_uniExpertId_idx" ON "UniExpertRequests"("uniExpertId");

-- CreateIndex
CREATE INDEX "UniExpertRequests_studentId_idx" ON "UniExpertRequests"("studentId");

-- CreateIndex
CREATE INDEX "UniExpertRequests_universityId_idx" ON "UniExpertRequests"("universityId");

-- CreateIndex
CREATE UNIQUE INDEX "UniExpertRequests_uniExpertId_studentId_universityId_key" ON "UniExpertRequests"("uniExpertId", "studentId", "universityId");

-- CreateIndex
CREATE UNIQUE INDEX "Admissions_uniExpertRequestId_key" ON "Admissions"("uniExpertRequestId");

-- CreateIndex
CREATE UNIQUE INDEX "BecomeUniExperts_studentId_key" ON "BecomeUniExperts"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "Conversations_lastMessageId_key" ON "Conversations"("lastMessageId");

-- CreateIndex
CREATE INDEX "Conversations_lastMessageId_idx" ON "Conversations"("lastMessageId");

-- CreateIndex
CREATE INDEX "ConversationMembers_conversationId_idx" ON "ConversationMembers"("conversationId");

-- CreateIndex
CREATE INDEX "ConversationMembers_userId_idx" ON "ConversationMembers"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ConversationMembers_conversationId_userId_key" ON "ConversationMembers"("conversationId", "userId");

-- CreateIndex
CREATE INDEX "Messages_senderId_idx" ON "Messages"("senderId");

-- CreateIndex
CREATE INDEX "Messages_conversationId_idx" ON "Messages"("conversationId");

-- CreateIndex
CREATE INDEX "Notifications_userId_idx" ON "Notifications"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscriptions_stripeSubscriptionId_key" ON "Subscriptions"("stripeSubscriptionId");

-- CreateIndex
CREATE INDEX "Subscriptions_userId_idx" ON "Subscriptions"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Purchases_stripePurchaseId_key" ON "Purchases"("stripePurchaseId");

-- CreateIndex
CREATE INDEX "Purchases_userId_idx" ON "Purchases"("userId");

-- AddForeignKey
ALTER TABLE "Documents" ADD CONSTRAINT "Documents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Documents" ADD CONSTRAINT "Documents_universitiesId_fkey" FOREIGN KEY ("universitiesId") REFERENCES "Universities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Documents" ADD CONSTRAINT "Documents_admissionId_fkey" FOREIGN KEY ("admissionId") REFERENCES "Admissions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersFollow" ADD CONSTRAINT "UsersFollow_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersFollow" ADD CONSTRAINT "UsersFollow_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Experiences" ADD CONSTRAINT "Experiences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Education" ADD CONSTRAINT "Education_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ielts" ADD CONSTRAINT "Ielts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Posts" ADD CONSTRAINT "Posts_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostLikes" ADD CONSTRAINT "PostLikes_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostLikes" ADD CONSTRAINT "PostLikes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Universities" ADD CONSTRAINT "Universities_uniExpertId_fkey" FOREIGN KEY ("uniExpertId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UniExpertRequests" ADD CONSTRAINT "UniExpertRequests_uniExpertId_fkey" FOREIGN KEY ("uniExpertId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UniExpertRequests" ADD CONSTRAINT "UniExpertRequests_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UniExpertRequests" ADD CONSTRAINT "UniExpertRequests_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "Universities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admissions" ADD CONSTRAINT "Admissions_uniExpertRequestId_fkey" FOREIGN KEY ("uniExpertRequestId") REFERENCES "UniExpertRequests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BecomeUniExperts" ADD CONSTRAINT "BecomeUniExperts_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversations" ADD CONSTRAINT "Conversations_lastMessageId_fkey" FOREIGN KEY ("lastMessageId") REFERENCES "Messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationMembers" ADD CONSTRAINT "ConversationMembers_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationMembers" ADD CONSTRAINT "ConversationMembers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscriptions" ADD CONSTRAINT "Subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchases" ADD CONSTRAINT "Purchases_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchases" ADD CONSTRAINT "Purchases_uniExpertRequestId_fkey" FOREIGN KEY ("uniExpertRequestId") REFERENCES "UniExpertRequests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchases" ADD CONSTRAINT "Purchases_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscriptions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
