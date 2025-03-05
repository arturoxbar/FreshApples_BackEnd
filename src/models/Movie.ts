import mongoose from "mongoose";

export interface MovieInterface {
    title: string;
    overview: string;
    tagline: string;
    genres: string[];
    posters: string[];
    releaseDate: string;
    trailers: string[] | string;
    runtime: number;
    publicVoteAverage?: number;
    publicVoteCount?: number;
    publicVoteTotalPoints?: number;
    criticVoteAverage?: number;
    criticVoteCount?: number;
    criticVoteTotalPoints?: number;
    adult: boolean;
    originalLanguage: string;
    media_type?: string;
    poster_path?: string;
    backdrop_path?: string;
    idApi?: number;
}


const moviewSchema = new mongoose.Schema<MovieInterface>({
    title: {
        type: String,
        required: true,
    },
    overview: {
        type: String,
        required: true,
    },
    tagline: {
        type: String,
        required: false,
    },
    genres: {
        type: [String],
        required: true,
    },
    posters: {
        type: [String],
        required: true,
    },
    releaseDate: {
        type: String,
        required: true,
    },
    trailers: {
        type: [String],
        required: true,
    },
    runtime: {
        type: Number,
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
    adult: {
        type: Boolean,
        required: true,
    },
    originalLanguage: {
        type: String,
        required: true,
    },

    idApi: {
        type: Number,
        required: false,
    },
});

const Movie = mongoose.model<MovieInterface>("Movie", moviewSchema);

export default Movie;
