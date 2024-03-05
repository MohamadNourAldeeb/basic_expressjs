import Redis from "ioredis";
const redis = new Redis({
    host: "localhost",
    port: 6379,
    db: 1,
});

// redis.on("connect", function () {
//   console.log("Redis Connected ✅");
// });

// redis.on("ready", function () {
//   console.log("Redis Ready ✅");
// });
export let addToRedisCache = async (
    key,
    payload,
    time = 360 * 24 * 60 * 60
) => {
    await redis.set(key, payload, "EX", time);
};
export let getFromRedisCache = async (key) => await redis.get(key);

export let getAllInRedis = async () => {
    let all = await redis.keys("*", (err) => {
        if (err) return console.log(err);
    });

    all.forEach(async (element) => {
        let value = await redis.get(element);
        deleteFromRedis(element);
        console.log({ key: element, value });
    });
};

export let deleteFromRedis = (key) => {
    redis.del(key, function (err, response) {
        if (response === 1) {
            console.log("Deleted Successfully ✅");
        } else {
            console.log("Cannot delete" + { err });
        }
    });
};
