import dotenv from "dotenv";
dotenv.config({ path: `../.env` });
import { sequelize } from "../utils/connect.js";
import { DataTypes, Model } from "sequelize";
import { enumGender } from "../utils/constants/enums.js";
import { bcrypt } from "../utils/bcrypt.js";
class User extends Model {}

User.init(
    {
        full_name: {
            type: DataTypes.STRING(50),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "لا يمكنك ترك الاسم فارغ ",
                },
            },
            set(value) {
                this.setDataValue("full_name", value.trim());
            },
        },
        gender: {
            type: DataTypes.ENUM,
            values: Object.values(enumGender),
            allowNull: false,
        },
        phoneNumber: {
            type: DataTypes.STRING(10),
            allowNull: false,
            unique: {
                args: true,
                msg: "رقم الهاتف موجود ل حساب اخر ",
            },
            is: /^(09)(\d{8})$/,
            validate: {
                notEmpty: {
                    msg: "لا يمكن ترك رقم الهاتف فارغ",
                },
            },
        },
        username: {
            type: DataTypes.STRING(30),
            allowNull: false,
            unique: {
                args: true,
                msg: "اسم المستخدم موجود لحساب اخر ",
            },
            validate: {
                notEmpty: {
                    msg: "لايمكنك ترك اسم المستخدم فارغ ",
                },
                len: {
                    args: [3, 30],
                    msg: "لا يمكن ن يكون اسم المستخدم اقل من 3 محارف او اكثر من 30 محرف ",
                },
            },
            set(value) {
                this.setDataValue("username", value.trim().toLowerCase());
            },
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "لايمكن ان يكون كلمة السر فارغة ",
                },
            },
        },

        avatar: {
            type: DataTypes.STRING(),
            allowNull: true,
        },
        email: { type: DataTypes.STRING(), allowNull: true },
        role_id: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
        sequelize,
        tableName: "User",
        timestamps: true,
        updatedAt: false,
        //! Triggers
        hooks: {
            beforeCreate: (User) => {
                //check if password is content the username
                if (User.password.includes(User.username))
                    throw new Error(
                        "لا يمكنك ادخال كلمة المرور ضمن اسم المستخدم الخاص بك "
                    );
                //check if the username  is same tha password
                if (User.username === User.password)
                    throw new Error(
                        "لا يمكنك وضع اسم المستخدم نفس كلمة المرور"
                    );

                //bcrypt password
                User.password = bcrypt(User.password);
            },
            beforeUpdate: (User) => {
                if (User.password) {
                    //use to check if their are password
                    //bcrypt password
                    User.password = bcrypt(User.password);
                }
            },
        },
    }
);
export default User;
