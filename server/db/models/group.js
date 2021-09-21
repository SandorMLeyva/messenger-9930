const Sequelize = require("sequelize");
const db = require("../db");

const Group = db.define("group", {
  description: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  photoUrl: {
    type: Sequelize.STRING
  },
  creatorId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

module.exports = Group;
