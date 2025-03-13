import { Router } from "express";
import {
    createReview,
    getReviewsByMedia,
    updateReview,
    deleteReview
} from "../controllers/reviewControllers";
import authenticate from "../middlewares/auth";

const router = Router();

// Ruta para crear una review (requiere autenticación)
router.post("/", authenticate, createReview);

// Ruta para obtener las reviews de un media (pública)
router.get("/:mediaId", getReviewsByMedia);

// Rutas protegidas para actualizar o eliminar una review
router
    .route("/:reviewId")
    .put(authenticate, updateReview)
    .delete(authenticate, deleteReview);

export default router;
