let permissions = {
    admin: {
        roles: {
            create: { value: 1, name: "create role" },
            update: { value: 2, name: "update role" },
            delete: { value: 3, name: "delete role" },
            getAll: { value: 4, name: "getAll role" },
        },
        permissions: {
            update: { value: 5, name: "update permissions" },
            getAll: { value: 6, name: "getAll permissions" },
        },
        users: {
            create: { value: 7, name: "create user" },
            update: { value: 8, name: "update user" },
            delete: { value: 9, name: "delete user" },
            getAll: { value: 10, name: "getAll user" },
        },
    },
    user: {
        create: { value: 11, name: "create post" },
        update: { value: 12, name: "update post" },
        delete: { value: 13, name: "delete post" },
        getAll: { value: 14, name: "getAll post" },
    },
};

let roles = {
    admin: {
        name: "admin",
        permissions: [
            "create role",
            "update role",
            "delete role",
            "getAll role",
            "update permissions",
            "getAll permissions",
            "create user",
            "update user",
            "delete user",
            "getAll user",
        ],
    },
    user: {
        name: "user",
        permissions: [
            "create post",
            "update post",
            "delete post",
            "getAll post",
        ],
    },
};

export { permissions, roles };
