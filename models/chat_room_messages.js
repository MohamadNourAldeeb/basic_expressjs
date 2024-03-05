const { DataTypes, Model, Optional } = require("sequelize");
const { sequelize } = require("../utils/connect");
class ChatRoomMessages extends Model {}
ChatRoomMessages.init(
    {
        message_id: { type: DataTypes.INTEGER, allowNull: false },
        receiver_id: { type: DataTypes.INTEGER, allowNull: false },
        seen: { type: DataTypes.DATE, allowNull: true },
        notify: { type: DataTypes.DATE, allowNull: true },
    },
    {
        sequelize,
        tableName: "chat_room_messages",
        freezeTableName: true,
        timestamps: false,
        updatedAt: false,
        paranoid: false,
    }
);

module.exports = ChatRoomMessages;
