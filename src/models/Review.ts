import mongoose from "mongoose";

export interface ReviewInterface {
    owner: string;
    mediaId: string;
    score: number;
    review: string,
    type: "movie" | "serie";
    by: "user" | "critic"
}

const ReviewSchema = new mongoose.Schema<ReviewInterface>(
    {
        owner: {
            type: String,
            required: true,
            ref: "User",
        },
        mediaId: {
            type: String,
            required: true,
        },
        score: {
            type: Number,
            required: true,
        },
        review: {
            type: String,
            required: false,
        },
        type: {
            type: String,
            required: true,
        },
        by: { type: String, required: true }
    },
    {
        timestamps: true,
    }
);

const Review = mongoose.model("Review", ReviewSchema);

export default Review;