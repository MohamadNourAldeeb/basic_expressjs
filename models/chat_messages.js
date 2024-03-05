const { DataTypes, Model, Optional } = require("sequelize");
const { sequelize } = require("../utils/connect");

class ChatMessages extends Model {}
ChatMessages.init(
    {
        room_id: { type: DataTypes.INTEGER, allowNull: false },
        user_id: { type: DataTypes.INTEGER, allowNull: false },
        message_id: { type: DataTypes.INTEGER, allowNull: true },
        content: { type: DataTypes.STRING(1000), allowNull: false },
        pinned: { type: DataTypes.DATE, allowNull: true },
    },
    {
        sequelize,
        tableName: "chat_messages",
        freezeTableName: true,
        timestamps: true,
        updatedAt: true,
        paranoid: false,
    }
);
module.exports = ChatMessages;
