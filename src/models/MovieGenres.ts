import mongoose from "mongoose";
export interface GenreInterface {
    id: number;
    name: string;
}
const movieGenreSchema = new mongoose.Schema<GenreInterface>({
    id: {
        type: Number,
        required: true,
    },

    name: {
        type: String,
        required: true,
    },
});

const MovieGenres = mongoose.model<GenreInterface>("MovieGenres", movieGenreSchema);

export default MovieGenres;