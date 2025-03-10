import type { Request, Response, NextFunction } from "express";
import { Media, Movie, Serie, MovieGenres, SerieGenres } from "../models/index";
import { axiosInstance, posters, endpoints } from "../config/axios";
import type { MovieInterface } from "../models/Movie";
import type { SerieInterface } from "../models/Serie";

interface AuthRequest extends Request {
    user?: any;
}

interface MediaItem {
    id: number;
    title?: string;
    name?: string;
    original_title?: string;
    original_name?: string;
    overview: string;
    poster_path?: string;
    media_type: "movie" | "tv";
    first_air_date?: string;
    release_date?: string;
    popularity: number;
    genre_ids: number[];
}

interface MediaApiResponse {
    page: number;
    results: MediaItem[];
    total_pages: number;
    total_results: number;
}

const getOwnMedias = async (req: AuthRequest, res: Response) => {
    try {
        const medias = await Media.find();
        if (!medias) {
            return res.status(404).json({ msg: "Medias not found" });
        }
        return res.status(200).json({ msg: "Medias found", medias });
    } catch (error) {
        return res.status(500).json({ msg: "Server error", error });
    }
}

const searchMedia = async (req: AuthRequest, res: Response) => {
    const { mediaTitle } = req.params;
    try {
        const media = await Media.find({ title: new RegExp(mediaTitle, "i") });

        if (media.length > 0) {
            return res.status(200).json({ msg: "Media retrieved from DB", media });
        }

        // Cambiado a multiSearch
        const response = await axiosInstance.get<MediaApiResponse>(endpoints.multiSearch, {
            params: { api_key: process.env.API_MOVIE_TOKEN, query: mediaTitle },
        });

        if (!response.data || !response.data.results) {
            return res.status(404).json({ msg: "No media found in external API" });
        }

        const searchTerm = mediaTitle.toLowerCase();

        const medias = response.data.results
            .filter(({ title, name: apiName, media_type }) => {
                const titleLower = title?.toLowerCase() || "";
                const nameLower = apiName?.toLowerCase() || "";
                return ["movie", "tv"].includes(media_type) &&
                    (titleLower.includes(searchTerm) || nameLower.includes(searchTerm));
            })
            .map(async (media: any) => {
                const media_genres = await MovieGenres.find({ id: { $in: media.genre_ids } });
                const newMedia = {
                    title: media.title || (media.name ? media.name.toLowerCase() : ""),
                    overview: media.overview,
                    // Cambiado a imageBaseUrl
                    poster: endpoints.imageBaseUrl + media.poster_path,
                    type: media.media_type,
                    releaseDate: media.release_date || media.first_air_date,
                    popularity: media.popularity,
                    idApi: media.id,
                    genres: media_genres.map((genre: any) => genre.name),
                };
                await Media.create(newMedia);
                return newMedia;
            });

        const savedMedias = await Promise.all(medias);

        return res.status(200).json({ msg: "Movies retrieved from API", media: savedMedias });
    } catch (error: any) {
        console.error("Error in searchMedia:", error);
        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
}

const getPopularMedias = async (req: AuthRequest, res: Response) => {
    try {
        const popularMovies: any[] = [];
        const popularSeries: any[] = [];

        // Solicitudes para películas populares (páginas 1 a 3)
        const movieRequests = [];
        for (let page = 1; page <= 3; page++) {
            movieRequests.push(
                axiosInstance.get("/movie/popular", {
                    params: { api_key: process.env.API_MOVIE_TOKEN, page },
                })
            );
        }
        const movieResponses = await Promise.all(movieRequests);
        movieResponses.forEach((response: any) => {
            const movies = response.data.results;
            movies.forEach((movie: any) => {
                // Si cuentas con un mapeo de géneros, aquí podrías transformar movie.genre_ids a nombres
                popularMovies.push({
                    title: movie.title,
                    overview: movie.overview,
                    poster: endpoints.imageBaseUrl + movie.poster_path,
                    idApi: movie.id,
                    genres: movie.genre_ids, // o mapea a nombres si lo deseas
                });
            });
        });

        // Solicitudes para series populares (páginas 1 a 2)
        const seriesRequests = [];
        for (let page = 1; page <= 2; page++) {
            seriesRequests.push(
                axiosInstance.get("/tv/popular", {
                    params: { api_key: process.env.API_MOVIE_TOKEN, page },
                })
            );
        }
        const seriesResponses = await Promise.all(seriesRequests);
        seriesResponses.forEach((response: any) => {
            const series = response.data.results;
            series.forEach((serie: any) => {
                popularSeries.push({
                    name: serie.name,
                    overview: serie.overview,
                    poster: endpoints.imageBaseUrl + serie.poster_path,
                    idApi: serie.id,
                    genres: serie.genre_ids,
                });
            });
        });

        const popularMedias = {
            movies: popularMovies,
            series: popularSeries,
        };

        return res.status(200).json(popularMedias);
    } catch (error: any) {
        console.error("Error in getPopularMedias:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getTrendingMedias = async (req: AuthRequest, res: Response) => {
    try {
        const trendingMovies: any[] = [];
        const trendingSeries: any[] = [];

        const trendingRequests = [];
        for (let page = 1; page <= 10; page++) {
            trendingRequests.push(
                axiosInstance.get("/trending/all/week", {
                    params: { api_key: process.env.API_MOVIE_TOKEN, page },
                })
            );
        }
        const trendingResponses = await Promise.all(trendingRequests);
        trendingResponses.forEach((response: any) => {
            const medias = response.data.results;
            medias.forEach((media: any) => {
                if (media.media_type === "movie") {
                    trendingMovies.push({
                        title: media.title,
                        overview: media.overview,
                        poster: endpoints.imageBaseUrl + media.poster_path,
                        idApi: media.id,
                        type: media.media_type,
                        genres: media.genre_ids,
                    });
                } else if (media.media_type === "tv") {
                    trendingSeries.push({
                        name: media.name,
                        overview: media.overview,
                        poster: endpoints.imageBaseUrl + media.poster_path,
                        idApi: media.id,
                        type: media.media_type,
                        genres: media.genre_ids,
                    });
                }
            });
        });

        const trendingMedias = {
            movies: trendingMovies,
            series: trendingSeries,
        };

        return res.status(200).json(trendingMedias);
    } catch (error: any) {
        console.error("Error in getWeeklyMedias:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getMovie = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    try {
        const movie = await Movie.findOne({ idApi: id });
        if (!movie) {
            // Cambiado a movieDetails
            const movieDetailedResponse = await axiosInstance.get(endpoints.movieDetails + id);
            const movieDetailed: any = movieDetailedResponse.data;

            // Cambiado a movieTrailers
            const trailerResponse: any = await axiosInstance.get(
                endpoints.movieDetails + id + endpoints.movieTrailers
            );

            // Cambiado a videoPlayerBaseUrl
            const movie_trailers = trailerResponse.data.results.map(
                (trailer: any) => endpoints.videoPlayerBaseUrl + trailer.key
            );

            const movie_genres = await MovieGenres.find({
                id: { $in: movieDetailed.genres.map((genre: any) => genre.id) },
            });

            const movieData: MovieInterface = {
                idApi: movieDetailed.id,
                title: movieDetailed.title,
                overview: movieDetailed.overview,
                tagline: movieDetailed.tagline,
                genres: movie_genres.map((genre: any) => genre.name),
                // Cambiado a imageBaseUrl
                posters: [
                    endpoints.imageBaseUrl + movieDetailed.poster_path,
                    endpoints.imageBaseUrl + movieDetailed.backdrop_path,
                ],
                releaseDate: movieDetailed.release_date,
                runtime: movieDetailed.runtime,
                adult: movieDetailed.adult,
                trailers: movie_trailers,
                originalLanguage: movieDetailed.original_language,
                publicVoteAverage: 0,
                publicVoteCount: 0,
                publicVoteTotalPoints: 0,
                criticVoteAverage: 0,
                criticVoteCount: 0,
                criticVoteTotalPoints: 0,
            };

            try {
                await Movie.create(movieData);
            } catch (saveError) {
                console.error("Error saving movie:", saveError);
            }

            return res.status(200).json({ msg: "Movie from api", movie: movieData });
        }

        return res.status(200).json({
            message: "Movie from db",
            movie,
        });
    } catch (error: any) {
        console.error("Error in getMovie:", error);
        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

const getSerie = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    try {
        const serie = await Serie.findOne({ idApi: id });
        if (!serie) {
            // Cambiado a seriesDetails
            const serieDetailedResponse = await axiosInstance.get(
                endpoints.seriesDetails + id
            );
            const serieDetailed: any = serieDetailedResponse.data;

            // Cambiado a seriesTrailers
            const trailerResponse: any = await axiosInstance.get(
                endpoints.seriesDetails + id + endpoints.seriesTrailers
            );

            // Cambiado a videoPlayerBaseUrl
            const serieTrailers = trailerResponse.data.results.map(
                (trailer: any) => endpoints.videoPlayerBaseUrl + trailer.key
            );

            const serie_genres = await SerieGenres.find({
                id: { $in: serieDetailed.genres.map((genre: any) => genre.id) },
            });

            const serieData: SerieInterface = {
                idApi: serieDetailed.id,
                name: serieDetailed.name,
                overview: serieDetailed.overview,
                tagline: serieDetailed.tagline,
                // Cambiado a imageBaseUrl
                posters: [
                    endpoints.imageBaseUrl + (serieDetailed.poster_path || ""),
                    endpoints.imageBaseUrl + (serieDetailed.backdrop_path || ""),
                ],
                firstAir: serieDetailed.first_air_date,
                lastAir: serieDetailed.last_air_date,
                totalEpisodes: serieDetailed.number_of_episodes,
                totalSeasons: serieDetailed.number_of_seasons,
                genres: serie_genres.map((genre: any) => genre.name),
                trailers: serieTrailers,
                status: serieDetailed.status,
            };

            try {
                await Serie.create(serieData);
            } catch (saveError) {
                console.error("Error saving serie:", saveError);
            }

            return res.status(200).json({ msg: "Serie from api", serie: serieData });
        }

        return res.status(200).json({
            message: "Serie from db",
            serie,
        });
    } catch (error: any) {
        console.error("Error in getSerie:", error);
        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};


export { searchMedia, getMovie, getSerie, getOwnMedias, getPopularMedias, getTrendingMedias }
