import { StatusCodes } from "http-status-codes";
import {
    Permissions,
    Refresh_Token,
    Role,
    Role_Permissions,
    User,
    User_Permissions,
} from "../../models/index.js";
import CustomError from "../../utils/custom_error.js";
import {
    LOGIN_ERROR,
    SINGNUP_ERROR,
} from "../../utils/constants/error_code.js";
import bcrypt from "bcryptjs/dist/bcrypt.js";
import { generateToken, verifyToken } from "../../utils/jwt.js";
import dotenv from "dotenv";
dotenv.config();
import { v4 as uuidv4 } from "uuid";
import { sequelize } from "../../utils/connect.js";

import { getFromRedisCache } from "../../utils/redis_cache.js";
import { sendCode } from "../../utils/send_code.js";

const authController = {
    login: async (req, res, next) => {
        const user = await User.findOne({
            raw: true,
            where: { username: req.body.username },
        });

        if (!user)
            throw new CustomError(
                LOGIN_ERROR,
                "the user name is incorrect",
                StatusCodes.BAD_REQUEST
            );
        if (user.isAuthenticated == false)
            throw new CustomError(
                LOGIN_ERROR,
                "you are not authenticated ",
                StatusCodes.BAD_REQUEST
            );

        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );
        if (!validPassword)
            throw new CustomError(
                LOGIN_ERROR,
                "the password is incorrect",
                StatusCodes.BAD_REQUEST
            );
        let deviceId = uuidv4();

        let userExtPerm = await User_Permissions.findAll({
            raw: true,
            where: { user_id: user.id },
        });
        userExtPerm = userExtPerm.map((item) => item.id);
        const token = generateToken(
            {
                userId: user.id,
                userName: user.username,
                roleId: user.role_id,
                userExtPerm,
                deviceId,
            },
            process.env.TOKEN_KEY,
            process.env.JWT_EXPIRES_IN
        );
        const refresh_token = generateToken(
            {
                userId: user.id,
                deviceId,
            },
            process.env.REFRESH_TOKEN_KEY,
            process.env.REFRESH_TOKEN_EXPIRES_IN
        );
        if (
            await Refresh_Token.findOne({
                raw: true,
                where: { user_id: user.id },
            })
        ) {
            await Refresh_Token.update(
                {
                    token: refresh_token,
                    user_id: user.id,
                    device_id: deviceId,
                    expiry: Date.now() + 30 * 24 * 60 * 60 * 1000,
                },
                {
                    where: { user_id: user.id },
                }
            );
        }
        await Refresh_Token.create({
            token: refresh_token,
            user_id: user.id,
            device_id: deviceId,
            expiry: Date.now() + 30 * 24 * 60 * 60 * 1000,
        });
        res.status(StatusCodes.OK).send({
            success: true,
            data: {
                msg: `welcome ${user.username}`,
                token,
                refresh_token,
                userExtPerm,
            },
        });
    },
    signup: async (req, res, next) => {
        if (
            await User.findOne({
                raw: true,
                attributes: ["id"],
                where: { username: req.body.username.trim() },
            })
        )
            throw new CustomError(
                SINGNUP_ERROR,
                "The User name already exists",
                StatusCodes.BAD_REQUEST
            );

        if (
            await User.findOne({
                raw: true,
                attributes: ["id"],
                where: { phoneNumber: req.body.phoneNumber },
            })
        )
            throw new CustomError(
                SINGNUP_ERROR,
                "The phone number already exists",
                StatusCodes.BAD_REQUEST
            );

        if (req.body.customPermissions.length) {
            const role = await Role.findOne({
                raw: true,
                where: { id: req.body.role_id },
            });
            if (role.role_name === "admin")
                throw new CustomError(
                    SINGNUP_ERROR,
                    "You cant add extra permissions to admin",
                    StatusCodes.BAD_REQUEST
                );
            if (
                new Set(req.body.customPermissions).size !==
                req.body.customPermissions.length
            )
                throw new CustomError(
                    SINGNUP_ERROR,
                    " you cant send same permission twice",
                    StatusCodes.BAD_REQUEST
                );

            // ! FIXME: should not access to db to check if the id is correct ,
            await Promise.all(
                req.body.customPermissions.map(async (item) => {
                    if (
                        !(await Permissions.findOne({
                            raw: true,
                            where: { id: item },
                        }))
                    )
                        throw new CustomError(
                            SINGNUP_ERROR,
                            `the permisson with id ${item} not found`,
                            StatusCodes.BAD_REQUEST
                        );
                })
            );

            let rolePerm = await Role_Permissions.findAll({
                raw: true,
                where: { role_id: req.body.role_id },
            });
            rolePerm = rolePerm.map((item) => item.perm_id);

            if (
                req.body.customPermissions.some((element) =>
                    rolePerm.includes(element)
                )
            )
                throw new CustomError(
                    SINGNUP_ERROR,
                    "The role have already some of extra permissions",
                    StatusCodes.BAD_REQUEST
                );
        }

        await sequelize.transaction(async (transaction) => {
            let user = await User.create(
                {
                    full_name: req.body.full_name,
                    gender: req.body.gender,
                    phoneNumber: req.body.phoneNumber,
                    username: req.body.username,
                    password: req.body.password,
                    role_id: req.body.role_id,
                    email: req.body.email,
                },
                { transaction }
            );
            await sendCode(user.username, user.email);
            if (req.body.customPermissions.length)
                await User_Permissions.bulkCreate(
                    req.body.customPermissions.map((item) => ({
                        user_id: user.id,
                        perm_id: item,
                    })),
                    transaction
                );
        });

        res.status(StatusCodes.OK).send({
            success: true,
            data: { msg: "operation accomplished successfully" },
        });
    },
    refreshToken: async (req, res, next) => {
        const refreshToken = req.body.refresh_token;

        let decoded = verifyToken(refreshToken, process.env.REFRESH_TOKEN_KEY);

        const user_id = decoded.userId;
        const refresh_user_token = await Refresh_Token.findOne({
            raw: true,
            nest: true,
            include: [
                {
                    model: User,
                    as: "user_info",
                    where: { id: user_id },
                },
            ],
        });

        if (!refresh_user_token)
            throw new CustomError(
                INVALID_TOKEN,
                "Invalid token",
                StatusCodes.UNAUTHORIZED
            );
        let deviceId = uuidv4();

        let userExtPerm = await User_Permissions.findAll({
            raw: true,
            where: { user_id },
        });
        userExtPerm = userExtPerm.map((item) => item.id);
        const token = generateToken(
            {
                userId: user_id,
                userName: refresh_user_token.user_info.username,
                roleId: refresh_user_token.user_info.role_id,
                userExtPerm,
                deviceId,
            },
            process.env.TOKEN_KEY,
            process.env.JWT_EXPIRES_IN
        );

        res.status(StatusCodes.OK).send({
            success: true,
            data: {
                token,
                refreshToken,
            },
        });
    },
    verification: async (req, res, next) => {
        const verifiedCodeCash = await getFromRedisCache(req.params.email);
        const InputverifiedCode = req.body.verifiedCode;
        const user = await User.findOne({
            raw: true,
            where: { email: req.params.email },
        });

        if (!user)
            throw new CustomError(
                LOGIN_ERROR,
                "SomeThing went wrong !!! , user with this email not found",
                StatusCodes.BAD_REQUEST
            );
        if (!verifiedCodeCash)
            throw new CustomError(
                SINGNUP_ERROR,
                "Sorry, time is up. ",
                StatusCodes.BAD_REQUEST
            );
        if (verifiedCodeCash !== InputverifiedCode)
            throw new CustomError(
                SINGNUP_ERROR,
                "Sorry, the verification code is incorrect ",
                StatusCodes.BAD_REQUEST
            );

        let userExtPerm = await User_Permissions.findAll({
            raw: true,
            where: { user_id: user.id },
        });
        userExtPerm = userExtPerm.map((item) => item.id);
        let deviceId = uuidv4();
        await User.update(
            {
                isAuthenticated: true,
            },
            {
                where: { id: user.id },
            }
        );
        const token = generateToken(
            {
                userId: user.id,
                userName: user.username,
                roleId: user.role_id,
                userExtPerm,
                deviceId,
            },
            process.env.TOKEN_KEY,
            process.env.JWT_EXPIRES_IN
        );
        const refresh_token = generateToken(
            {
                userId: user.id,
                deviceId,
            },
            process.env.REFRESH_TOKEN_KEY,
            process.env.REFRESH_TOKEN_EXPIRES_IN
        );
        if (
            await Refresh_Token.findOne({
                raw: true,
                where: { user_id: user.id },
            })
        ) {
            await Refresh_Token.update(
                {
                    token: refresh_token,
                    user_id: user.id,
                    device_id: deviceId,
                    expiry: Date.now() + 30 * 24 * 60 * 60 * 1000,
                },
                {
                    where: { user_id: user.id },
                }
            );
        }

        res.status(StatusCodes.OK).send({
            success: true,
            data: {
                msg: `welcome ${user.username} you are verified :)`,
                token,
                refresh_token,
                userExtPerm,
            },
        });
    },
    reset_password: async (req, res, next) => {
        const user = await User.findOne({
            raw: true,
            where: { id: req.user.userId },
        });

        if (!user)
            throw new CustomError(
                LOGIN_ERROR,
                "the user not found",
                StatusCodes.BAD_REQUEST
            );
        if (user.isAuthenticated === false)
            throw new CustomError(
                LOGIN_ERROR,
                "you are Not Authenticated !!",
                StatusCodes.BAD_REQUEST
            );
        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );
        if (!validPassword)
            throw new CustomError(
                LOGIN_ERROR,
                "the old password is incorrect",
                StatusCodes.BAD_REQUEST
            );

        await User.update(
            {
                password: bcrypt(req.body.new_password),
            },
            {
                where: { id: user.id },
            }
        );

        res.status(StatusCodes.OK).send({
            success: true,
            data: { msg: "operation accomplished successfully" },
        });
    },
    resend_code: async (req, res, next) => {
        const user = await User.findOne({
            raw: true,
            where: { email: req.params.email },
        });

        if (!user)
            throw new CustomError(
                LOGIN_ERROR,
                "SomeThing went wrong !!! , user with this email not found",
                StatusCodes.BAD_REQUEST
            );

        if (user.isAuthenticated === true)
            throw new CustomError(
                LOGIN_ERROR,
                "you already authenticated ",
                StatusCodes.BAD_REQUEST
            );
        await sendCode(user.username, user.email);

        res.status(StatusCodes.OK).send({
            success: true,
            data: { msg: "operation accomplished successfully" },
        });
    },
    send_code: async (req, res, next) => {
        const user = await User.findOne({
            raw: true,
            where: { email: req.params.email },
        });

        if (!user)
            throw new CustomError(
                LOGIN_ERROR,
                "SomeThing went wrong !!! , user with this email not found",
                StatusCodes.BAD_REQUEST
            );

        // if (user.isAuthenticated === true)
        //     throw new CustomError(
        //         LOGIN_ERROR,
        //         "you already authenticated ",
        //         StatusCodes.BAD_REQUEST
        //     );
        await sendCode(user.username, user.email);

        res.status(StatusCodes.OK).send({
            success: true,
            data: { msg: "operation accomplished successfully" },
        });
    },
};

export default authController;
