import type { Request } from "express";
export default interface AuthRequest extends Request {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    token?: any;
}
