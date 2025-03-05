import axios from "axios"
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

const endpoints = {
    movieSearch: "/search/movie",
    seriesSearch: "/search/tv",
    multiSearch: "/search/multi",
    movieDetails: "/movie/",
    seriesDetails: "/tv/",
    movieTrailers: "/videos?api_key=in fugiat",
    seriesTrailers: "/videos?api_key=in fugiat",
    videoPlayerBaseUrl: "www.youtube.com/watch?v=",
    imageBaseUrl: "https://image.tmdb.org/t/p/w600_and_h900_bestv2/"
};

const axiosInstance = axios.create({
    baseURL: "https://api.themoviedb.org/3/",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json;charset=utf-8",
        Authorization: `Bearer ${process.env.API_MOVIE_TOKEN}`,
    },
})

const posters = axios.create({
    baseURL: "https://image.tmdb.org/t/p/w600_and_h900_bestv2/",
    timeout: 1000,
    headers: {
        "Content-Type": "application/json;charset=utf-8",
    },
});

export { axiosInstance, posters, endpoints }
