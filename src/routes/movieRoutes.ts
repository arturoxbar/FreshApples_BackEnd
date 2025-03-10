import { Router } from "express";
import { searchMedia, getMovie, getSerie, getOwnMedias, getPopularMedias, getTrendingMedias } from "../controllers/movieControllers";
import authenticate from "../middlewares/auth";

const router = Router();


router.route("/general/:mediaTitle").post(searchMedia);
router.get("/general", getOwnMedias)
router.route("/movie/:id").get(getMovie);
router.route("/serie/:id").get(getSerie);
router.get("/general/popular", getPopularMedias);
router.get("/general/trending", getTrendingMedias);

export default router;
