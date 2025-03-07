import mongoose from "mongoose";
import bcrypt from "bcrypt";


export interface UserInterface {
    username: string;
    password: string;
    email: string;
    code: string;
    verified: boolean;
    verifyPassword: (password: string) => Promise<boolean>;
}


const UserSchema = new mongoose.Schema<UserInterface>({
    username: { type: String, required: true, unique: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: false },
    code: { type: String, required: false },
    verified: { type: Boolean, require: true, default: false }

});

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});


UserSchema.methods.verifyPassword = async function (password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
};


const User = mongoose.model<UserInterface>("User", UserSchema);

export default User;
