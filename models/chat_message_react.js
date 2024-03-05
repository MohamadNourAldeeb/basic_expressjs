const { DataTypes, Model, Optional } = require("sequelize");
const { sequelize } = require("../utils/connect");

class ChatMessageReact extends Model {}
ChatMessageReact.init(
    {
        user_id: { type: DataTypes.INTEGER, allowNull: false },
        message_id: { type: DataTypes.INTEGER, allowNull: false },
        react: {
            type: DataTypes.ENUM(
                "like",
                "love",
                "laugh",
                "wow",
                "sad",
                "angry"
            ),
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "chat_message_reacts",
        freezeTableName: true,
        timestamps: true,
        updatedAt: false,
        paranoid: false,
    }
);

module.exports = ChatMessageReact;
