import { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams, Link, Navigate } from "react-router-dom";

import conf from "../config";

import { MovieProps } from "../types/Media";

import loadImg from "../functions/loadImg";
import toHM from "../functions/toHM";
import toYear from "../functions/toYear";
import wishlist from "../functions/wishlist";

import MediaBackground from "../components/MediaBackground";
import MediaTabs from "../components/MediaTabs";
import PosterSection from "../components/PosterSection";

import Loading from "./Loading";
import { Helmet } from "react-helmet";
import ActorSection from "../components/ActorSection";

export default function Movie() {
  const nav = useNavigate();
  const { id } = useParams();

  const [data, setData] = useState<MovieProps | null>();
  const [loaded, setLoaded] = useState<boolean>(false);
  const [wished, setWished] = useState(false);

  async function loadData() {
    setData(null);
    setLoaded(false);

    const req = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${conf.API_KEY}&append_to_response=recommendations,images,credits`
    );
    const res = await req.json();

    if (res.success == false) {
      nav("/unavailable");
      return;
    }

    const nData: MovieProps = res;

    nData.logo = nData.images.logos.find((i) => i.iso_639_1 == "en");
    await loadImg("https://image.tmdb.org/t/p/original" + nData.backdrop_path);
    if (nData.logo)
      await loadImg("https://image.tmdb.org/t/p/w500" + nData.logo.file_path);

    setData(res);
    setLoaded(true);
  }

  function onPlusClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    if (!data) return;

    wishlist.add({ id: data.id, type: "movie", poster: data.poster_path, title: data.title });
  }

  function onCheckClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    if (!data) return;

    wishlist.remove(data.id, "movie");
  }

  useEffect(() => {
    loadData();
  }, [id]);

  useEffect(() => {
    if (!data) return;

    setWished(wishlist.has(data.id, "movie"));

    function onWishlistChange() {
      if (!data) return;

      setWished(wishlist.has(data.id, "movie"));
    }

    wishlist.on(data.id, "movie", onWishlistChange);

    return () => {
      wishlist.off(data.id, "movie", onWishlistChange);
    };
  }, [data]);

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
        backdrop={"https://image.tmdb.org/t/p/original" + data.backdrop_path}
      />

      <div className="media-content">
        <div className="media-logo">
          <img
            src={
              data.logo
                ? "https://image.tmdb.org/t/p/w500" + data.logo.file_path
                : ""
            }
            draggable="false"
          />
        </div>

        <div className="media-main">
          {data.tagline && <p className="media-tagline">{data.tagline}</p>}

          <div className="media-meta">
            <div className="media-genres">
              {data.genres.length ? (
                data.genres.map((v, i) => <span key={i}>{v.name}</span>)
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
            <Link to={`/player/${data.id}`}>
              <button className="primary">
                <i className="fa-solid fa-play"></i>
                <p>Play</p>
              </button>
            </Link>

            {wished ? (
              <button className="button secondary" onClick={onCheckClick}>
                <i className="fa-solid fa-check"></i>
                <p>Remove</p>
              </button>
            ) : (
              <button className="button secondary" onClick={onPlusClick}>
                <i className="fa-solid fa-plus-circle"></i>
                <p>Watchlist</p>
              </button>
            )}
          </div>

          <p className="media-description">{data.overview}</p>
        </div>
      </div>

      {data.recommendations && (
        <MediaTabs
          tabs={[
            {
              title: "Cast",
              element: <ActorSection posters={data.credits.cast} />,
            },
            {
              title: "Similar Movies",
              element: <PosterSection posters={data.recommendations.results} />,
            },
          ]}
        />
      )}
    </Fragment>
  );
}
