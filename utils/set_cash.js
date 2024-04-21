

import { Role ,Role_Permissions} from "../models/index.js";
import {
    addToRedisCache,
    getAllInRedis,
    getFromRedisCache,
} from "../utils/redis_cache.js";



let setRoleAndRestrictionCache = async () => {
    let allRole = await Role.findAll({ raw: true });

    await Promise.all(
        allRole.map(async (Role) => {
            let permissions = await Role_Permissions.findAll({
                raw: true,
                attributes: ["perm_id"],
                where: { role_id: Role.id },
            });

            permissions = permissions.map(
                (permission) => permission.perm_id
            );
            console.log({ permissions });

            addToRedisCache(
                `role:${Role.id}`,
                JSON.stringify({
                    role_id: Role.id,
                    permissions,
                }),
                360 * 24 * 60 * 60
            );
        })
    );
};
export const setInCache = async () => {
    // console.log("All Redis");

    await getAllInRedis();

    // console.log(await getFromRedisCache(`role:1`));
    // console.log("--------------------------------");

    if (!(await getFromRedisCache(`role:1`))) {
        await setRoleAndRestrictionCache();
        console.log("successfully set all roles in redis ✅");
    }

    return NextResponse.next();
};

export  { setRoleAndRestrictionCache };
