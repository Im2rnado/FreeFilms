import { Fragment, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

import conf from "../config";

import PosterOptions from "../types/PosterOptions";

export default function Search() {
  const [query, setQuery] = useState<string | null>();
  const [error, setError] = useState<string | null>();
  const [results, setResults] = useState<PosterOptions[] | null>();

  async function loadResults() {
    if (!query || !query.length) {
      setError(null);
      setResults(null);
      return;
    }

    if (query.length < 3) {
      setError(null);
      setResults(null);
      return;
    }

    const req = await fetch(`https://api.themoviedb.org/3/search/multi?query=${query}&api_key=${conf.API_KEY}`);
    const res = await req.json();

    const results = res.results.filter((i: any) => (i.media_type == "movie" || i.media_type == "tv") && (i.poster_path));

    if (results.count <= 0) {
      setResults(null);
      setError("No results found.");
      return;
    }

    setError(null);
    setResults(results);
  }

  useEffect(() => {
    loadResults();
  }, [query]);

  return (
    <Fragment>
      <Helmet>
        <title>{query ? query : "Search"} - {conf.SITE_TITLE}</title>
      </Helmet>

      <div className="new-page">
        <div className="search-input">
          <input
            type="text"
            value={query || ""}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search" />

          {
            query &&
            <i
              className="fa-solid fa-xmark"
              onClick={() => setQuery(null)}></i>
          }
        </div>

        {
          error ?
            <div className="search-center">
              <i className="fa-solid fa-warning warning"></i>
              <p>{error}</p>
            </div>
            :
            (
              (results && results.length)
                ?
                <Fragment>
                  <p className="search-title">Results</p>

                  <div className="search-results">
                    {
                      results.map((v, i) => {
                        return <Link className='poster' key={i} title={v.name} to={`/${v.media_type}/${v.id}`} style={{ backgroundImage: `url('https://image.tmdb.org/t/p/w300${v.poster_path}')` }}></Link>
                      })
                    }
                  </div>
                </Fragment>
                :
                <div className="search-center">
                  <i className="fa-solid fa-video"></i>
                  <p>Search for Movies & TV Shows</p>
                </div>
            )
        }
      </div>
    </Fragment>
  )
}
