module.exports = {
  async up(db, client) {
    // Add the 'dob' field to all users who don't have it
    await db.collection("users").updateMany(
      { dob: { $exists: false } },
      {
        $set: {
          dob: new Date("2000-01-01"),
        },
      }
    );

    console.log(" Migration complete: Added 'dob' field to all existing users");
  },

  // async down(db, client) {
  //   // Rollback: remove the 'dob' field from all users
  //   await db.collection("users").updateMany({}, { $unset: { dob: "" } });

  //   console.log(" Rollback complete: Removed 'dob' field from all users");
  // },
};
