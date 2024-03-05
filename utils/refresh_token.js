import { v4 as uuidv4 } from "uuid";
import { Refresh_Token } from "../models/index.js";
let jwtExpiration = 3600; // 1 hour
let jwtRefreshExpiration = 86400; // 24 hours

const createToken = async function (user_id) {
    console.log(user_id);
    let expiredAt = new Date();

    expiredAt.setSeconds(expiredAt.getSeconds() + jwtRefreshExpiration);

    let token = uuidv4();

    let refreshToken = await Refresh_Token.create({
        token: token,
        user_id: user_id,
        expiryDate: expiredAt.getTime(),
    });

    return token;
};

const verifyExpiration = (token) => {
    return token.expiryDate.getTime() < new Date().getTime();
};

export default { createToken, verifyExpiration };
