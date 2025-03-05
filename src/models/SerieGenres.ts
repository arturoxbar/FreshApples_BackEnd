import mongoose from "mongoose";
export interface GenreInterface {
    id: number;
    name: string;
}
const serieGenreSchema = new mongoose.Schema<GenreInterface>({
    id: {
        type: Number,
        required: true,
    },

    name: {
        type: String,
        required: true,
    },
});

const SerieGenres = mongoose.model<GenreInterface>(
    "SerieGenres",
    serieGenreSchema
);

export default SerieGenres;
