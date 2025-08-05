import { Fragment, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { DatePicker, Slider, Select, Input } from 'antd';

import conf from "../config";

import PosterOptions from "../types/PosterOptions";

const { Option } = Select;

function RandomMovie() {
    const [isFormOne, setIsFormOne] = useState(false);
    const [username, setUsername] = useState<string>("");
    const [genres, setGenres] = useState<string[]>([]);
    const [releaseDate, setReleaseDate] = useState<any>({ from: null, to: "2024-12-30" });
    const [userScore, setUserScore] = useState<any>({ min: 0, max: 100 });
    const [runTime, setRunTime] = useState<any>({ min: 30, max: 330 });
    const [error, setError] = useState<string | null>();
    const [results, setResults] = useState<PosterOptions[] | null>();

    useEffect(() => {
    }, [genres, releaseDate, userScore, runTime, username, isFormOne, error, results]);

    const randomslice = (ar: [], size: number): any => {
        let new_ar: any = [...ar];
        new_ar.splice(Math.floor(Math.random() * ar.length), 1);
        return ar.length <= (size + 1) ? new_ar : randomslice(new_ar, size);
    }

    const fetchMovies = async (event?: React.FormEvent<HTMLFormElement>) => {
        if (event) {
            event.preventDefault(); // Prevent default form submission behavior
        }

        const genreQuery = genres.length > 0 ? `with_genres=${genres.join(",")}` : "";
        const releaseDateQuery = `primary_release_date.gte=${releaseDate.from}&primary_release_date.lte=${releaseDate.to}`;
        const userScoreQuery = `vote_average.gte=${userScore.min / 10}&vote_average.lte=${userScore.max / 10}`; // Updated userScore query
        const runTimeQuery = `with_runtime.gte=${runTime.min}&with_runtime.lte=${runTime.max}`;

        const queryParams = [genreQuery, releaseDateQuery, userScoreQuery, runTimeQuery].filter(Boolean).join("&");

        const response = await fetch(`https://api.themoviedb.org/3/discover/movie?${queryParams}&api_key=${conf.API_KEY}`);
        const data = await response.json();

        const movies = randomslice(data.results, 6);
        if (movies.length <= 0) {
            setResults(null);
            setError("No results found.");
            return;
        }

        setError(null);
        setResults(movies);

        const section = document.querySelector('#results');
        section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const fetchLetterboxd = async (event?: React.FormEvent<HTMLFormElement>) => {
        if (event) {
            event.preventDefault(); // Prevent default form submission behavior
        }

        try {
            const response = await fetch(`https://seep.eu.org/https://letterboxd-list-radarr.onrender.com/${username}/watchlist/`);
            const data = await response.json();

            const movies: any[] = randomslice(data, 6);

            for (let movie of movies) {
                const req = await fetch(
                    `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${conf.API_KEY}`
                );
                const res = await req.json();

                Object.assign(movie, res);
            }

            console.log(movies)

            if (movies.length <= 0) {
                setResults(null);
                setError("No results found.");
                return;
            }

            setError(null);
            setResults(movies);

            const section = document.querySelector('#results');
            section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } catch (e) {
            setResults(null);
            setError("Username not found.");
            return;
        }
    };

    return (
        <Fragment>
            <Helmet>
                <title>Random Movie - {conf.SITE_TITLE}</title>
            </Helmet>

            <div className="new-page">
                <span className="toggle-title">Get a random movie to watch</span>
                <div className="toggle-container">
                    <span className="toggle-label">Use Your Letterboxd Watchlist</span>
                    <div className="toggle-switch">
                        <input
                            type="checkbox"
                            id="formToggle"
                            checked={isFormOne}
                            onChange={() => setIsFormOne(!isFormOne)}
                        />
                        <label htmlFor="formToggle" className="switch"></label>
                    </div>
                </div>

                {!isFormOne ? (
                    <form onSubmit={fetchMovies}>
                        <div>
                            <label>
                                Genres:
                                <Select
                                    mode="multiple"
                                    placeholder="Select Genres"
                                    onChange={(selectedGenres: string[]) => setGenres(selectedGenres)}
                                    style={{ marginTop: "1%", width: '100%', fontSize: "large", height: "40px" }}
                                    className="random-inputs"
                                >
                                    <Option value="28">Action</Option>
                                    <Option value="12">Adventure</Option>
                                    <Option value="16">Animation</Option>
                                    <Option value="35">Comedy</Option>
                                    <Option value="80">Crime</Option>
                                    <Option value="99">Documentary</Option>
                                    <Option value="18">Drama</Option>
                                    <Option value="10751">Family</Option>
                                    <Option value="14">Fantasy</Option>
                                    <Option value="36">History</Option>
                                    <Option value="27">Horror</Option>
                                    <Option value="10402">Music</Option>
                                    <Option value="9648">Mystery</Option>
                                    <Option value="10749">Romance</Option>
                                    <Option value="878">Science Fiction</Option>
                                    <Option value="10770">TV Movie</Option>
                                    <Option value="53">Thriller</Option>
                                    <Option value="10752">War</Option>
                                    <Option value="37">Western</Option>
                                </Select>
                            </label>
                        </div>
                        <div>
                            <label>
                                Release Date:
                                <DatePicker.RangePicker
                                    picker="year"
                                    onChange={(dates) => {
                                        if (dates && dates.length === 2) {
                                            const from = dates[0]?.format("YYYY-01-01");
                                            const to = dates[1]?.format("YYYY-12-31");
                                            setReleaseDate({ from, to });
                                        }
                                    }}
                                    style={{ marginTop: "1%", width: '100%', fontSize: "larger" }}
                                    className="random-inputs"
                                />
                            </label>
                        </div>
                        <div>
                            <label>
                                User Score:
                                <Slider
                                    range
                                    min={0}
                                    max={100}
                                    step={5}
                                    defaultValue={[0, 100]}
                                    onChange={(value: number[]) => setUserScore({ min: value[0], max: value[1] })}
                                    styles={{
                                        track: { height: "6px", backgroundColor: 'black' },
                                        rail: { backgroundColor: "rgba(0, 0, 0, 0.4)", borderRadius: "2px" },
                                        handle: { height: "6px", borderColor: 'black' },
                                    }}
                                    tooltip={{
                                        formatter: (value: any) => `${value}%`
                                    }}
                                    marks={{
                                        0: { style: { fontSize: '16px', marginTop: '8px', marginLeft: "5px" }, label: <strong>0%</strong> }, // Adjust the style here
                                        50: { style: { fontSize: '15px', marginTop: '6px', marginLeft: "5px" }, label: "50%" }, // Adjust the style here
                                        100: { style: { fontSize: '16px', marginTop: '8px', marginRight: "10px" }, label: <strong>100%</strong> } // Adjust the style here
                                    }}
                                />
                            </label>
                        </div>
                        <div>
                            <label>
                                Runtime:
                                <Slider
                                    range
                                    min={30}
                                    max={210}
                                    step={5}
                                    defaultValue={[30, 210]}
                                    onChange={(value: number[]) => setRunTime({ min: value[0], max: value[1] })}
                                    className="random-inputs"
                                    styles={{
                                        track: { height: "6px", backgroundColor: 'black' },
                                        rail: { backgroundColor: "rgba(0, 0, 0, 0.4)", borderRadius: "2px" },
                                        handle: { height: "6px", borderColor: 'black' },
                                    }}
                                    tooltip={{
                                        formatter: (value: any) => `${value} mins`
                                    }}
                                    marks={{
                                        30: { style: { fontSize: '16px', marginTop: '8px', marginLeft: "5px" }, label: <strong>30m</strong> }, // Adjust the style here
                                        120: { style: { fontSize: '15px', marginTop: '6px', marginLeft: "5px" }, label: "120m" }, // Adjust the style here
                                        210: { style: { fontSize: '16px', marginTop: '8px', marginRight: "10px" }, label: <strong>210m</strong> } // Adjust the style here
                                    }}
                                />
                            </label>
                        </div>
                        <button type="submit">Get Random Movies</button>
                    </form>
                ) : (<div>
                    <p className="fewsecs">
                        <center>(This may take a few seconds)</center>
                    </p>
                    <form onSubmit={fetchLetterboxd}>
                        <div>
                            <label>
                                Username:
                                <Input
                                    onChange={v => setUsername(v.target.value)}
                                    placeholder="ex: bedierr, qjack"
                                    style={{ marginTop: "1%", width: '100%', fontSize: "large", height: "40px" }}
                                    className="random-inputs"
                                >
                                </Input>
                            </label>
                        </div>
                        <button type="submit">Get Random Movies</button>
                    </form>
                </div>
                )}

                {error ? (
                    <div className="search-center">
                        <i className="fa-solid fa-warning warning"></i>
                        <p>{error}</p>
                    </div>
                ) : results && results.length ? (
                    <Fragment>
                        <p id="results" className="search-title">Results</p>
                        <div className="search-results">
                            {results.map((movie, index) => (
                                <Link
                                    className="poster"
                                    key={index}
                                    title={movie.title}
                                    to={`/movie/${movie.id}`}
                                    style={{ backgroundImage: `url('https://image.tmdb.org/t/p/w300${movie.poster_path}')` }}
                                ></Link>
                            ))}
                        </div>
                    </Fragment>
                ) : (
                    <div className="search-center" id="results">
                        <i className="fa-solid fa-video"></i>
                        <p>Random Movies Here</p>
                    </div>
                )}
            </div>
        </Fragment>
    );
}

export default RandomMovie;
