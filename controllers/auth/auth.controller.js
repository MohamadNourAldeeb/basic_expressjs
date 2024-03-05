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
import { generateToken } from "../../utils/jwt.js";
import dotenv from "dotenv";
dotenv.config({ path: `./.env` });
import { v4 as uuidv4 } from "uuid";
import { sequelize } from "../../utils/connect.js";
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
        await Refresh_Token.create({
            token: refresh_token,
            user_id: user.id,
            device_id: deviceId,
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
                },
                { transaction }
            );
            if (req.body.customPermissions.length)
                await User_Permissions.bulkCreate(
                    req.body.customPermissions.map((item) => ({
                        user_id: user.id,
                        perm_id: item,
                    }))
                ),
                    transaction;
        });

        res.status(StatusCodes.OK).send({
            success: true,
            data: { msg: "operation accomplished successfully" },
        });
    },
    refreshToken: async (req, res, next) => {
        res.status(StatusCodes.OK).send({
            success: true,
            data: { msg: "operation accomplished successfully" },
        });
    },
};

export default authController;
