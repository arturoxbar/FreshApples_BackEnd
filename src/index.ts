import express from "express"; // se importa express
import cors from "cors"; // se importa cors para que no haya problemas de comunicacion entre otras plataformas
import userRoutes from "./routes/userRoutes";
import database from "./config/database";
import session from "express-session";
import passport from "passport";
import dotenv from "dotenv";


dotenv.config({ path: ".env" });

const secret: string = process.env.SECRET;

const app = express();
const port = process.env.PORT;

app.use(cors()); // se usa cors
app.use(express.json()); // se usa el middleware para que express pueda entender json
app.use(express.urlencoded({ extended: true })); // se usa el middleware para que express pueda entender los datos de un formulario
app.use(session({ secret: secret, resave: true, saveUninitialized: true })); // se usa el middleware para que express pueda usar sesiones
app.use(passport.initialize()); // se inicializa passport
app.use(passport.session()); // se usa el middleware para que express pueda usar sesiones de passport

app.use("/api/v1/users", userRoutes); // se declaran las rutas para los usuarios

try {
    database.on("error", (err: any) => {
        console.error("Error de conexion a la base de datos:", err);
    });

    database.once("open", async () => {
        console.log("Conexion a la base de datos exitosa");
    });
} catch (error) {
    console.log(error);
}

app.listen(port, () => console.log(`app is running on port ${port}`)); // se levanta el servidor
