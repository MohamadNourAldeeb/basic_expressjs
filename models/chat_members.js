const { DataTypes, Model, Optional } = require("sequelize");
const { sequelize } = require("../utils/connect");
class ChatMembers extends Model {}

ChatMembers.init(
    {
        room_id: { type: DataTypes.INTEGER, allowNull: false },
        user_id: { type: DataTypes.INTEGER, allowNull: false },
        created_by: { type: DataTypes.INTEGER, allowNull: false },
        role: {
            type: DataTypes.ENUM("Admin", "User", "Owner"),
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "chat_members",
        freezeTableName: true,
        timestamps: true,
        updatedAt: false,
        paranoid: false,
    }
);
module.exports = ChatMembers;
