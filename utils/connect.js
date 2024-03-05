import mysql2 from "mysql2";
import { Sequelize } from "sequelize";

import { roles } from "./permissions.js";
import dotenv from "dotenv";
import { addToRedisCache } from "./redis_cache.js";
dotenv.config({ path: `./.env` });
let allPermissions = [];
let adminRolePermissions = [];
let userRolePermissions = [];

let DATABASE = process.env.DATABASE;
let USER = process.env.USER;
let PASSWORD = process.env.PASSWORD;

roles.admin.permissions.forEach((permission) => {
    allPermissions.push({
        perm_mod: roles.admin.name,
        perm_desc: permission,
    });
});
//! employee role
roles.user.permissions.forEach((permission) => {
    allPermissions.push({
        perm_mod: roles.user.name,
        perm_desc: permission,
    });
});
//? admin role permissions

for (let i = 1; i <= roles.admin.permissions.length; i++) {
    adminRolePermissions.push({
        role_id: 1,
        perm_id: i,
    });
}

//? permissions role user
for (
    let i = roles.admin.permissions.length + 1;
    i <= roles.admin.permissions.length + roles.user.permissions.length;
    i++
) {
    userRolePermissions.push({
        role_id: 2,
        perm_id: i,
    });
}

let sequelize = new Sequelize(DATABASE, USER, PASSWORD, {
    dialect: "mysql",
    dialectModule: mysql2,
    host: process.env.HOST,
    port: parseInt(process.env.PORT_DB),
    define: {
        charset: process.env.CHARSET,
        collate: process.env.COLLATE,
    },
    logging: false,
});

// import * as all from "../models/index.js";
// sequelize
//     .sync({ force: true })
//     .then(async () => {
//         await initial();
//         console.log("successfully created relationships with tables ✅✅");
//     })
//     .catch((err) => {
//         console.log(err);
//     });

export { sequelize };

async function initial() {
    await all.Role.create({
        role_name: "admin",
    });
    await all.Role.create({
        role_name: "user",
    });
    await all.Permissions.bulkCreate(allPermissions);

    await all.Role_Permissions.bulkCreate(adminRolePermissions);
    await all.Role_Permissions.bulkCreate(userRolePermissions);
    addToRedisCache(1, adminRolePermissions);
    addToRedisCache(2, userRolePermissions);
}
