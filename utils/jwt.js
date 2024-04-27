import dotenv from "dotenv";
dotenv.config();
import Jwt from "jsonwebtoken";
const secretKey = Buffer.from(process.env.SECRET_KEY || "", "hex");
import crypto from "crypto";
import { INVALID_TOKEN } from "./constants/error_code.js";
import { StatusCodes } from "http-status-codes";
import CustomError from "./custom_error.js";

let verifyToken = (token, SECRET_KEY) => {
    // Verify the token

    const decoded = Jwt.verify(token, SECRET_KEY);

    // Check if the token contains the 'encrypted' property
    if (!decoded || !decoded.hasOwnProperty("encrypted")) {
        throw new CustomError(
            INVALID_TOKEN,
            "Invalid token",
            StatusCodes.UNAUTHORIZED
        );
    }

    // Decrypt the payload
    const decipher = crypto.createDecipheriv(
        "aes-256-cbc",
        secretKey,
        Buffer.alloc(16)
    );
    let decrypted = decipher.update(decoded.encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    // Parse the decrypted payload
    return JSON.parse(decrypted);
};

let generateToken = (payload, SECRET_KEY, expiresIn) => {
    const payloadStr = JSON.stringify(payload);

    const cipher = crypto.createCipheriv(
        "aes-256-cbc",
        secretKey,
        Buffer.alloc(16)
    );

    let encrypted = cipher.update(payloadStr, "utf8", "hex");
    encrypted += cipher.final("hex");

    // Sign the encrypted payload
    return Jwt.sign(
        {
            encrypted,
        },
        SECRET_KEY,
        {
            expiresIn,
        }
    );
};

export { generateToken, verifyToken };
