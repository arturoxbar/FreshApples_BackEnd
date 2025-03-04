import jwt from "jsonwebtoken";
import User from "../models/User";
import bcrypt from "bcrypt";

const SECRET_KEY = process.env.JWT_SECRET || "default_secret";


export const generateToken = (payload: object) => {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: "99h" });
};

export const decryptToken = (token: string) => {
    return jwt.verify(token, SECRET_KEY);
};

export const verifyPassword = async (password: string, email: string) => {
    const usuario = await User.findOne({
        email: email,
    }).exec();
    console.log(usuario);
    if (!usuario) {
        return false;
    }
    const result = await bcrypt.compare(password, usuario.password);
    console.log(result);
    return result;
};
