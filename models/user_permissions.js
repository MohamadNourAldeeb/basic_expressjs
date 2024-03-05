import dotenv from "dotenv";
dotenv.config({ path: `../.env` });
import { sequelize } from "../utils/connect.js";
import { DataTypes, Model } from "sequelize";
class User_Permissions extends Model {}
User_Permissions.init(
    {
        user_id: { type: DataTypes.INTEGER, allowNull: false },
        perm_id: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
        sequelize,
        tableName: "User_Permissions",
        timestamps: true,
        updatedAt: false,
    }
);

export default User_Permissions;
