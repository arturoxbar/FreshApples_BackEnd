import mongoose from "mongoose";

export interface SerieInterface {
    idApi: number;
    name: string;
    overview?: string;
    tagline: string;
    posters: string[];
    firstAir: string;
    lastAir: string;
    totalEpisodes: number;
    totalSeasons: number;
    genres: string[];
    trailers: string[];
    status: string;
    publicVoteAverage?: number;
    publicVoteCount?: number;
    publicVoteTotalPoints?: number;
    criticVoteAverage?: number;
    criticVoteCount?: number;
    criticVoteTotalPoints?: number;
}

const SerieSchema = new mongoose.Schema<SerieInterface>({
    idApi: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    overview: {
        type: String,
        required: false,
    },
    tagline: {
        type: String,
        required: false,
    },
    posters: {
        type: [String],
        required: true,
    },
    firstAir: {
        type: String,
        required: true,
    },
    lastAir: {
        type: String,
        required: true,
    },
    totalEpisodes: {
        type: Number,
        required: true,
    },
    totalSeasons: {
        type: Number,
        required: true,
    },
    genres: {
        type: [String],
        required: true,
    },
    trailers: {
        type: [String],
        required: false,
    },
    status: {
        type: String,
        required: true,
    },
    publicVoteAverage: {
        type: Number,
        required: false,
        default: 0,
    },
    publicVoteCount: {
        type: Number,
        required: false,
        default: 0,
    },
    publicVoteTotalPoints: {
        type: Number,
        required: false,
        default: 0,
    },
    criticVoteAverage: {
        type: Number,
        required: false,
        default: 0,
    },
    criticVoteCount: {
        type: Number,
        required: false,
        default: 0,
    },
    criticVoteTotalPoints: {
        type: Number,
        required: false,
        default: 0,
    },
});

const Serie = mongoose.model("Serie", SerieSchema);
export default Serie;
