const { DataTypes, Model, Optional } = require("sequelize");
const { sequelize } = require("../utils/connect");
class ChatRooms extends Model {}

ChatRooms.init(
    {
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
            set(value) {
                this.setDataValue("name", value.trim());
            },
        },
        type: {
            type: DataTypes.ENUM("private", "group"),
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        image_name: {
            type: DataTypes.STRING(100),
            allowNull: true,
            set(value) {
                this.setDataValue("image_name", value.trim());
            },
        },
        basic_image_name: {
            type: DataTypes.STRING(200),
            allowNull: true,
            set(value) {
                this.setDataValue("basic_image_name", value.trim());
            },
        },
        created_by: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
        sequelize,
        tableName: "chat_rooms",
        freezeTableName: true,
        timestamps: true,
        updatedAt: false,
        paranoid: false,
    }
);
module.exports = ChatRooms;
