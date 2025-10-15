require("dotenv").config();

const config = {
  mongodb: {
    url: process.env.MONGO_URI,

    databaseName: "socialmedia",

    options: {},
  },

  migrationsDir: "migrations",

  changelogCollectionName: "changelog",

  lockCollectionName: "changelog_lock",

  lockTtl: 0,

  migrationFileExtension: ".js",

  useFileHash: false,

  moduleSystem: "commonjs",
};

module.exports = config;
