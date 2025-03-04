import type { Request, Response, NextFunction } from "express";
import { decryptToken } from "../utils/jwt";

interface AuthRequest extends Request {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    user?: any;
}

const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    console.log("")
    if (!token) {
        return res.status(401).json({ message: "No token provided, log in again" });
    }

    try {
        const payload = decryptToken(token) as { _id: string };
        req.user = { _id: payload._id };
        next(); // Permitir que la solicitud continúe al siguiente middleware/controlador
    } catch (error) {
        return res.status(401).json({ message: "Invalid session. log In again" });
    }
};

export default authenticate;
