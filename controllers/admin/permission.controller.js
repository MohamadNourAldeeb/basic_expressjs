import { StatusCodes } from "http-status-codes";
import { Permissions, Role, Role_Permissions } from "../../models/index.js";
import CustomError from "../../utils/custom_error.js";
import { ALREADY_EXISTS, NOT_FOUND } from "../../utils/constants/error_code.js";
import dotenv from "dotenv";
dotenv.config({ path: `./.env` });
import { Op } from "sequelize";
const PermissionController = {
    updatePermission: async (req, res, next) => {
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

        await Role.update({ ...req.body }, { where: { id: role_id } });

        res.status(StatusCodes.OK).send({
            success: true,
            data: { msg: "operation accomplished successfully" },
        });
    },

    getAllPermissions: async (req, res, next) => {
        let permissions = await Permissions.findAll({
            raw: true,
        });

        res.status(StatusCodes.OK).send({
            success: true,
            data: { permissions },
        });
    },
};

export default PermissionController;
