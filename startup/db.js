const { Logger } = require("./logs");
const { config } = require("../config");
const { PrismaClient } = require("@prisma/client");

let prisma = new PrismaClient({
  // log: ["query", "info", "warn", "error"],
  // datasources: {
  //   db: {
  //     url: config.DATABASE_URL,
  //   },
  // },
});

function getDbClient() {
  if (prisma) return prisma;

  prisma = new PrismaClient({
    // log: ["query", "info", "warn", "error"],
    // datasources: {
    //   db: {
    //     url: config.DATABASE_URL,
    //   },
    // },
  });

  // prisma.
  return prisma;
}

async function initDatabase() {
  try {
    const client = getDbClient();
    await client.$connect();
    Logger.info("Connected to PostgreSQL database.");
  } catch (error) {
    Logger.error(error);
    throw error;
  }
}

exports.initDatabase = initDatabase;
// exports.getDbClient = getDbClient;
exports.db = prisma;
