import dotenv from "dotenv";
dotenv.config({ path: `../.env` });
import { sequelize } from "../utils/connect.js";
import { DataTypes, Model } from "sequelize";
class Permissions extends Model {}
Permissions.init(
    {
        perm_mod: { type: DataTypes.STRING(300), allowNull: false },
        perm_desc: { type: DataTypes.STRING(50), allowNull: false },
    },
    {
        sequelize,
        tableName: "Permissions",
        timestamps: true,
        updatedAt: false,
    }
);

export default Permissions;
