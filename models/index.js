import User from "./users.js";
import Role from "./roles.js";
import Permissions from "./permissions.js";
import Role_Permissions from "./role_permissions.js";
import User_Permissions from "./user_permissions.js";
import Refresh_Token from "./refresh_token.js";
// ! role has one to many team user

Role.hasMany(User, {
    constraints: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    hooks: true,
    as: "users_have_role",
    foreignKey: "role_id",
});
User.belongsTo(Role, { foreignKey: "role_id", as: "role_info" });

// ! team roles and permissions

Role.hasMany(Role_Permissions, {
    constraints: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    hooks: true,
    as: "role_perm",
    foreignKey: "role_id",
});
Role_Permissions.belongsTo(Role, {
    foreignKey: "role_id",
    as: "role",
});

Permissions.hasMany(Role_Permissions, {
    constraints: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    hooks: true,
    foreignKey: "perm_id",
});
Role_Permissions.belongsTo(Permissions, {
    foreignKey: "perm_id",
});

// ! team User and permissions   extra permissions

User.hasMany(User_Permissions, {
    constraints: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    hooks: true,
    as: "custom_permissions",
    foreignKey: "user_id",
});
User_Permissions.belongsTo(User, {
    foreignKey: "user_id",
});

Permissions.hasMany(User_Permissions, {
    constraints: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    hooks: true,
    as: "user_permissions",
    foreignKey: "perm_id",
});
User_Permissions.belongsTo(Permissions, {
    as: "permissions_info",
    foreignKey: "perm_id",
});

Refresh_Token.belongsTo(User, {
    foreignKey: "user_id",
    targetKey: "id",
});
User.hasOne(Refresh_Token, {
    foreignKey: "user_id",
    targetKey: "id",
});
export {
    User,
    Role,
    Permissions,
    Role_Permissions,
    User_Permissions,
    Refresh_Token,
};
