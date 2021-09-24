const Conversation = require("./conversation");
const User = require("./user");
const Message = require("./message");
const Group = require("./group");

// associations

User.hasMany(Conversation);
Conversation.belongsTo(User, { as: "user1" });
Conversation.belongsTo(User, { as: "user2" });
Message.belongsTo(Conversation);
Conversation.hasMany(Message);

// related to groups
User.belongsToMany(Group, { through: "user_group" });
Group.belongsToMany(User, { through: "user_group" });
Message.belongsTo(Group, { foreignKey: "groupId" });
Group.hasMany(Message, { foreignKey: "groupId" });

module.exports = {
  User,
  Conversation,
  Message,
  Group,
};
