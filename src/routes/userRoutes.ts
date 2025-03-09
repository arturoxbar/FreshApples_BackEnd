import { Router } from "express";
import {
  singIn,
  login,
  EditUser,
  deleteUser,
  getUserInfo,
  verifyUser,
  resetPassword,
  sendResetCode,
  verifyReset
} from "../controllers/userControllers";
import authenticate from "../middlewares/auth";

const router = Router();

// Ruta para registrar un nuevo usuario (pública)
router.post("/signup", singIn);

// Ruta para iniciar sesión (pública)
router.post("/login", login);

// Rutas protegidas
router
  .route("/user")
  .put(authenticate, EditUser)
  .delete(authenticate, deleteUser)
  .get(authenticate, getUserInfo);

router.patch("/user/:code", verifyUser);

router.post("/password/reset", sendResetCode);
router.post("/password/reset/:code", verifyReset);
router.patch("/password/reset", resetPassword);


export default router;
