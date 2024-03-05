import { StatusCodes } from "http-status-codes";
import { Permissions, Role, Role_Permissions } from "../../models/index.js";
import CustomError from "../../utils/custom_error.js";
import {
    ACCESS_DENIED,
    ALREADY_EXISTS,
    CREATEING_ERROR,
    LOGIN_ERROR,
    NOT_FOUND,
    SINGNUP_ERROR,
} from "../../utils/constants/error_code.js";
import dotenv from "dotenv";
dotenv.config({ path: `./.env` });
import { Op } from "sequelize";
import { sequelize } from "../../utils/connect.js";
const roleController = {
    addRole: async (req, res, next) => {
        if (
            await Role.findOne({
                raw: true,
                where: { role_name: req.body.role_name },
            })
        )
            throw new CustomError(
                ALREADY_EXISTS,
                "The Role name already exists",
                StatusCodes.BAD_REQUEST
            );
        if (new Set(req.body.permissions).size !== req.body.permissions.length)
            throw new CustomError(
                CREATEING_ERROR,
                " you cant send same permission twice",
                StatusCodes.BAD_REQUEST
            );
        req.body.permissions = new Set(req.body.permissions);
        await Promise.all(
            req.body.permissions.map(async (item) => {
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

        await sequelize.transaction(async (transaction) => {
            let role = await Role.create(
                { role_name: req.body.role_name },
                transaction
            );

            await Role_Permissions.bulkCreate(
                req.body.permissions.map((item) => ({
                    role_id: role.id,
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
    deleteRole: async (req, res, next) => {
        let role_id = req.params.role_id;

        let role = await Role.findOne({
            raw: true,
            attributes: ["id", "role_name"],
            where: { id: role_id },
        });

        if (!role)
            throw new CustomError(
                NOT_FOUND,
                "The Role Id is wrong",
                StatusCodes.BAD_REQUEST
            );
        if (role.role_name === "admin")
            throw new CustomError(
                ACCESS_DENIED,
                "You cant delete admin role",
                StatusCodes.BAD_REQUEST
            );
        await Role.destroy({ where: { id: role_id } });
        res.status(StatusCodes.OK).send({
            success: true,
            data: { msg: "operation accomplished successfully" },
        });
    },
    updateRole: async (req, res, next) => {
        let role_id = req.params.role_id;
        let role = await Role.findOne({
            raw: true,
            attributes: ["id", "role_name"],
            where: { id: role_id },
        });
        if (!role)
            throw new CustomError(
                NOT_FOUND,
                "The Role Id is wrong",
                StatusCodes.BAD_REQUEST
            );
        if (
            await Role.findOne({
                raw: true,
                attributes: ["id"],
                where: {
                    role_name: req.body.role_name,
                    id: { [Op.not]: role_id },
                },
            })
        )
            throw new CustomError(
                ALREADY_EXISTS,
                "The role name already exists",
                StatusCodes.BAD_REQUEST
            );

        if (req.body.permissions.length) {
            if (
                new Set(req.body.permissions).size !==
                req.body.permissions.length
            )
                throw new CustomError(
                    CREATEING_ERROR,
                    " you cant send same permission twice",
                    StatusCodes.BAD_REQUEST
                );
            req.body.permissions = new Set(req.body.permissions);
            await Promise.all(
                req.body.permissions.map(async (item) => {
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
            await sequelize.transaction(async (transaction) => {
                await Role.update(
                    { ...req.body },
                    { where: { id: role_id } },
                    transaction
                );

                await Role_Permissions.bulkCreate(
                    req.body.permissions.map((item) => ({
                        role_id: role.id,
                        perm_id: item,
                    }))
                ),
                    transaction;
            });
        }
        await Role.update({ ...req.body }, { where: { id: role_id } });
        res.status(StatusCodes.OK).send({
            success: true,
            data: { msg: "operation accomplished successfully" },
        });
    },

    getAllRoles: async (req, res, next) => {
        let roles = await Role_Permissions.findAll({
            raw: true,
            attributes: ["perm_id", "role_id"],
            nest: true,
            include: [
                {
                    model: Role,
                    required: true,
                    attributes: ["role_name"],
                    as: "role",
                },
            ],
        });
        roles = roles.reduce((acc, item) => {
            const existingItem = acc.find((x) => x.role_id === item.role_id);
            const perm_id = item.perm_id;
            if (existingItem) {
                if (!existingItem.permissions.includes(perm_id)) {
                    existingItem.permissions.push(perm_id);
                }
            } else {
                acc.push({
                    role_id: item.role_id,
                    role_name: item.role.role_name,
                    permissions: [perm_id],
                });
            }
            return acc;
        }, []);

        res.status(StatusCodes.OK).send({
            success: true,
            data: { roles },
        });
    },
};

export default roleController;
