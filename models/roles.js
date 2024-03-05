import dotenv from "dotenv";
dotenv.config({ path: `../.env` });
import { sequelize } from "../utils/connect.js";
import { DataTypes, Model } from "sequelize";
class Role extends Model {}
Role.init(
    {
        role_name: {
            allowNull: false,
            type: DataTypes.STRING(30),
        },
    },
    {
        sequelize,
        tableName: "Role",
        timestamps: true,
        updatedAt: false,
    }
);

export default Role;
