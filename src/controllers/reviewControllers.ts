import { Request, Response } from "express";
import Review from "../models/Review";
import Movie from "../models/Movie";
import Serie from "../models/Serie";
import User from "../models/User";

interface AuthRequest extends Request {
    user?: any;
}


const createReview = async (req: AuthRequest, res: Response) => {
    try {
        const { mediaId, score, review, type } = req.body;
        // Validamos campos requeridos
        if (!mediaId || score === undefined || !type) {
            return res.status(400).json({ msg: "Missing required fields" });
        }
        if (type !== "movie" && type !== "serie") {
            return res.status(400).json({ msg: "Invalid review type" });
        }
        // Se toma el id del usuario autenticado
        const owner = req.user._id
        console.log(req.user)
        const userRole = req.user.role;

        const ExistingReview = await Review.findOne({
            mediaId: mediaId,
            owner: req.user._id,
        });
        if (ExistingReview) {
            return res.status(403).json({ msg: "You can't Review a media twice." });
        }

        const newReview = await Review.create({ owner, mediaId, score, review, type, by: userRole });

        const mediaIdNumber = Number(mediaId);

        if (type === "movie") {
            const movie = await Movie.findOne({ idApi: mediaId });
            console.log("TEST MOVIE AQUI: ", movie)
            if (movie) {
                if (userRole === "critic") {
                    movie.criticVoteTotalPoints = (movie.criticVoteTotalPoints) + score;
                    movie.criticVoteCount = (movie.criticVoteCount) + 1;
                    movie.criticVoteAverage = movie.criticVoteTotalPoints / movie.criticVoteCount;
                } else {
                    movie.publicVoteTotalPoints = (movie.publicVoteTotalPoints) + score;
                    movie.publicVoteCount = (movie.publicVoteCount) + 1;
                    movie.publicVoteAverage = movie.publicVoteTotalPoints / movie.publicVoteCount;
                }
                await movie.save();
            }
        } else if (type === "serie") {
            const serie = await Serie.findOne({ idApi: mediaIdNumber });
            if (serie) {
                if (userRole === "critic") {
                    serie.criticVoteTotalPoints = (serie.criticVoteTotalPoints) + score;
                    serie.criticVoteCount = (serie.criticVoteCount) + 1;
                    serie.criticVoteAverage = serie.criticVoteTotalPoints / serie.criticVoteCount;
                } else {
                    serie.publicVoteTotalPoints = (serie.publicVoteTotalPoints) + score;
                    serie.publicVoteCount = (serie.publicVoteCount) + 1;
                    serie.publicVoteAverage = serie.publicVoteTotalPoints / serie.publicVoteCount;
                }
                await serie.save();
            }
        }

        return res.status(201).json({ msg: "Review created successfully", review: newReview });
    } catch (error: any) {
        console.error("Error creating review:", error);
        return res.status(500).json({ msg: "Server error", error: error.message });
    }
};


const updateReview = async (req: AuthRequest, res: Response) => {
    try {
        const { reviewId } = req.params;
        const { score, review } = req.body; // nuevos datos
        const existingReview = await Review.findById(reviewId);
        if (!existingReview) {
            return res.status(404).json({ msg: "Review not found" });
        }
        // Se obtiene el usuario que creó la review para conocer su rol

        const userRole = req.user.role;
        const oldScore = existingReview.score;
        const scoreDiff = score - oldScore;

        // Actualizamos los campos de la review
        existingReview.score = score;
        if (review !== undefined) {
            existingReview.review = review;
        }
        const updatedReview = await existingReview.save();

        const mediaIdNumber = Number(existingReview.mediaId);
        if (existingReview.type === "movie") {
            const movie = await Movie.findOne({ idApi: mediaIdNumber });
            if (movie) {
                if (userRole === "critic") {
                    movie.criticVoteTotalPoints = (movie.criticVoteTotalPoints || 0) + scoreDiff;
                    if (movie.criticVoteCount > 0) {
                        movie.criticVoteAverage = movie.criticVoteTotalPoints / movie.criticVoteCount;
                    }
                } else {
                    movie.publicVoteTotalPoints = (movie.publicVoteTotalPoints || 0) + scoreDiff;
                    if (movie.publicVoteCount > 0) {
                        movie.publicVoteAverage = movie.publicVoteTotalPoints / movie.publicVoteCount;
                    }
                }
                await movie.save();
            }
        } else if (existingReview.type === "serie") {
            const serie = await Serie.findOne({ idApi: mediaIdNumber });
            if (serie) {
                if (userRole === "critic") {
                    serie.criticVoteTotalPoints = (serie.criticVoteTotalPoints || 0) + scoreDiff;
                    if (serie.criticVoteCount > 0) {
                        serie.criticVoteAverage = serie.criticVoteTotalPoints / serie.criticVoteCount;
                    }
                } else {
                    serie.publicVoteTotalPoints = (serie.publicVoteTotalPoints || 0) + scoreDiff;
                    if (serie.publicVoteCount > 0) {
                        serie.publicVoteAverage = serie.publicVoteTotalPoints / serie.publicVoteCount;
                    }
                }
                await serie.save();
            }
        }

        return res.status(200).json({ msg: "Review updated", review: updatedReview });
    } catch (error: any) {
        console.error("Error updating review:", error);
        return res.status(500).json({ msg: "Server error", error: error.message });
    }
};


const deleteReview = async (req: AuthRequest, res: Response) => {
    try {
        const { reviewId } = req.params;
        const existingReview = await Review.findById(reviewId);
        if (!existingReview) {
            return res.status(404).json({ msg: "Review not found" });
        }
        // Se obtiene el usuario que creó la review para conocer su rol
        const reviewOwner = await User.findById(existingReview.owner);
        const userRole = reviewOwner?.role || "user";

        const mediaIdNumber = Number(existingReview.mediaId);
        if (existingReview.type === "movie") {
            const movie = await Movie.findOne({ idApi: mediaIdNumber });
            if (movie) {
                if (userRole === "critic") {
                    movie.criticVoteTotalPoints = (movie.criticVoteTotalPoints || 0) - existingReview.score;
                    movie.criticVoteCount = (movie.criticVoteCount || 0) - 1;
                    movie.criticVoteAverage = movie.criticVoteCount > 0 ? movie.criticVoteTotalPoints / movie.criticVoteCount : 0;
                } else {
                    movie.publicVoteTotalPoints = (movie.publicVoteTotalPoints || 0) - existingReview.score;
                    movie.publicVoteCount = (movie.publicVoteCount || 0) - 1;
                    movie.publicVoteAverage = movie.publicVoteCount > 0 ? movie.publicVoteTotalPoints / movie.publicVoteCount : 0;
                }
                await movie.save();
            }
        } else if (existingReview.type === "serie") {
            const serie = await Serie.findOne({ idApi: mediaIdNumber });
            if (serie) {
                if (userRole === "critic") {
                    serie.criticVoteTotalPoints = (serie.criticVoteTotalPoints || 0) - existingReview.score;
                    serie.criticVoteCount = (serie.criticVoteCount || 0) - 1;
                    serie.criticVoteAverage = serie.criticVoteCount > 0 ? serie.criticVoteTotalPoints / serie.criticVoteCount : 0;
                } else {
                    serie.publicVoteTotalPoints = (serie.publicVoteTotalPoints || 0) - existingReview.score;
                    serie.publicVoteCount = (serie.publicVoteCount || 0) - 1;
                    serie.publicVoteAverage = serie.publicVoteCount > 0 ? serie.publicVoteTotalPoints / serie.publicVoteCount : 0;
                }
                await serie.save();
            }
        }

        await Review.findByIdAndDelete(reviewId);

        return res.status(200).json({ msg: "Review deleted", review: existingReview });
    } catch (error: any) {
        console.error("Error deleting review:", error);
        return res.status(500).json({ msg: "Server error", error: error.message });
    }
};

const getReviewsByMedia = async (req: AuthRequest, res: Response) => {
    try {
        const { mediaId } = req.params;
        const reviews = await Review.find({ mediaId }).populate("owner");
        return res.status(200).json({ msg: "Reviews fetched", reviews });
    } catch (error: any) {
        console.error("Error fetching reviews:", error);
        return res.status(500).json({ msg: "Server error", error: error.message });
    }
};

export { createReview, getReviewsByMedia, updateReview, deleteReview };
