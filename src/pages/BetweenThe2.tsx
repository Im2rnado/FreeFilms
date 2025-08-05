import { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams, Link, Navigate } from "react-router-dom";

import conf from "../config";

import loadImg from "../functions/loadImg";
import toHM from "../functions/toHM";
import toYear from "../functions/toYear";

import MediaBackground from "../components/MediaBackground";

import Loading from "./Loading";
import { Helmet } from "react-helmet";

export default function BetweenThe2() {
  const { id } = useParams();

  const [data, setData] = useState<any | null>();
  const [loaded, setLoaded] = useState<boolean>(false);

  async function loadData() {
    setData(null);
    setLoaded(false);

    const nData = {
      "adult": false,
      "backdrop_path": "/assets/betweenthe2-backdrop.png",
      "genres": [
        {
          "id": 80,
          "name": "Faragski Productions"
        },
        {
          "id": 53,
          "name": "Thriller"
        },
        {
          "id": 53,
          "name": "Psychology"
        }
      ],
      "id": "betweenthe2",
      "imdb_id": "betweenthe2",
      "original_language": "en",
      "original_title": "Between The Two",
      "overview": "A wife struggling to live with a man who has a personality disorder. Throughout the movie, the man repetitively switches personalities and forgets all the actions taken by his other personality.",
      "poster_path": "/assets/betweenthe2-poster.png",
      "logo": "/assets/betweenthe2-logo.png",
      "release_date": "2023-04-12",
      "runtime": 3,
      "tagline": "Between the two partners, between the two personalities.",
      "title": "Between The Two",
      "recommendations": {
        "page": 0,
        "results": [],
        "total_pages": 0,
        "total_results": 0
      },
      "images": {
        "backdrops": [
          {
            "iso_639_1": "en",
            "file_path": "/assets/betweenthe2-backdrop.png",
          }
        ],
        "logos": [
          {
            "iso_639_1": "en",
            "file_path": "/assets/betweenthe2-logo.png",
          }
        ],
        "posters": [
          {
            "iso_639_1": "en",
            "file_path": "/assets/betweenthe2-poster.png",
          }
        ]
      }
    }

    await loadImg(nData.backdrop_path);
    if (nData.logo)
      await loadImg(nData.logo);

    setData(nData);
    setLoaded(true);
  }

  useEffect(() => {
    loadData();
  }, [id]);

  if (!loaded) {
    return <Loading />;
  }

  if (!data) {
    return <Navigate to="/unavailable" />;
  }

  return (
    <Fragment>
      <Helmet>
        <title>
          {data.title} - {conf.SITE_TITLE}
        </title>
      </Helmet>

      <MediaBackground
        backdrop={data.backdrop_path}
      />

      <div className="media-content">
        <div className="media-logo">
          <img
            src={data.logo}
            draggable="false"
          />
        </div>

        <div className="media-main">
          {data.tagline && <p className="media-tagline">{data.tagline}</p>}

          <div className="media-meta">
            <div className="media-genres">
              {data.genres.length ? (
                data.genres.map((v: any, i: any) => <span key={i}>{v.name}</span>)
              ) : (
                <span>Movie</span>
              )}
            </div>

            <div className="media-details">
              <p>{toYear(data.release_date)}</p>
              <p>{toHM(data.runtime)}</p>
            </div>
          </div>

          <div className="media-actions">
            <Link to={"/player/betweenthe2"}>
              <button className="primary">
                <i className="fa-solid fa-play"></i>
                <p>Play</p>
              </button>
            </Link>
          </div>

          <p className="media-description">{data.overview}</p>
        </div>
      </div>
    </Fragment>
  );
}
