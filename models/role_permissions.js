import dotenv from "dotenv";
dotenv.config({ path: `../.env` });
import { sequelize } from "../utils/connect.js";
import { DataTypes, Model } from "sequelize";
class Role_Permissions extends Model {}
Role_Permissions.init(
    {
        role_id: { type: DataTypes.INTEGER, allowNull: false },
        perm_id: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
        sequelize,
        tableName: "Role_Permissions",
        timestamps: true,
        updatedAt: false,
    }
);

export default Role_Permissions;
