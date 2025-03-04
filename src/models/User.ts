import mongoose from "mongoose";
import bcrypt from "bcrypt";


export interface UserInterface {
    username: string;
    password: string;
    email: string;

    verifyPassword: (password: string) => Promise<boolean>;
}

// Definición del esquema de usuario
const UserSchema = new mongoose.Schema<UserInterface>({
    username: { type: String, required: true, unique: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: false },

});

// Middleware para hashear la contraseña antes de guardar el usuario
UserSchema.pre("save", async function (next) {
    // Solo hashear la contraseña si ha sido modificada
    if (!this.isModified("password")) {
        return next();
    }
    // Generar un salt y hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    // Continuar con el proceso de guardado
    next();
});

// Método para verificar la contraseña
UserSchema.methods.verifyPassword = async function (password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
};

// Creación del modelo de usuario
const User = mongoose.model<UserInterface>("User", UserSchema);

export default User;
