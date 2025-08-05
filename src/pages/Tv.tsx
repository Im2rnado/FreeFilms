import { useEffect, useState, Fragment } from "react"
import { Link, Navigate, useNavigate, useParams } from "react-router-dom"

import conf from "../config";

import { EpisodeProps, TvData, TvProps } from "../types/Media";

import loadImg from "../functions/loadImg";
import toYear from "../functions/toYear";
import wishlist from "../functions/wishlist";

import MediaEpisodes from "../components/MediaEpisodes";
import MediaBackground from "../components/MediaBackground";
import MediaTabs from "../components/MediaTabs";
import PosterSection from "../components/PosterSection";

import Loading from "./Loading";
import { Helmet } from "react-helmet";
import ActorSection from "../components/ActorSection";

export default function Tv() {
  const nav = useNavigate();
  const { id } = useParams();

  const [data, setData] = useState<TvProps | null>();
  const [season, setSeason] = useState<number>(1);
  const [episodes, setEpisodes] = useState<EpisodeProps[] | null>();
  const [loaded, setLoaded] = useState<boolean>(false);
  const [wished, setWished] = useState(false);

  async function loadData() {
    setData(null);
    setSeason(1);
    setEpisodes(null);
    setLoaded(false);

    const req = await fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${conf.API_KEY}&append_to_response=recommendations,images,credits`);
    const res = await req.json();

    const req2 = await fetch(`https://api.themoviedb.org/3/tv/${id}/season/1?api_key=${conf.API_KEY}&append_to_response=recommendations,images`);
    const res2 = await req2.json();

    if (res.success == false) {
      nav("/unavailable");
      return;
    }

    const nData: TvData = res;

    nData.logo = nData.images.logos.find(i => i.iso_639_1 == "en");
    await loadImg("https://image.tmdb.org/t/p/original" + nData.backdrop_path);
    if (nData.logo) await loadImg("https://image.tmdb.org/t/p/w500" + nData.logo.file_path);

    setEpisodes(res2.episodes);
    setData(res);
    setLoaded(true);
  }

  async function newSeason(nSeason: number) {
    setEpisodes(null);
    setSeason(nSeason);

    const req = await fetch(`https://api.themoviedb.org/3/tv/${id}/season/${nSeason}?api_key=${conf.API_KEY}&append_to_response=recommendations,images`);
    const res = await req.json();

    if (res.success == false) {
      nav("/unavailable");
      return;
    }

    setEpisodes(res.episodes);
  }

  function onPlusClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    if (!data) return;

    wishlist.add({ id: data.id, type: "tv", poster: data.poster_path, title: data.title });
  }

  function onCheckClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    if (!data) return;

    wishlist.remove(data.id, "tv");
  }

  useEffect(() => {
    loadData();
  }, [id]);

  useEffect(() => {
    if (!data) return;

    setWished(wishlist.has(data.id, "tv"));

    function onWishlistChange() {
      if (!data) return;

      setWished(wishlist.has(data.id, "tv"));
    }

    wishlist.on(data.id, "tv", onWishlistChange);

    return () => {
      wishlist.off(data.id, "tv", onWishlistChange);
    };
  }, [data]);

  if (!loaded) {
    return <Loading />;
  }

  if (!data) {
    return <Navigate to="/unavailable" />
  }

  return (
    <Fragment>
      <Helmet>
        <title>{data.name} - {conf.SITE_TITLE}</title>
      </Helmet>

      <MediaBackground backdrop={"https://image.tmdb.org/t/p/original" + data.backdrop_path} />

      <div className="media-content">
        <div className="media-logo">
          <img src={(data.logo ? "https://image.tmdb.org/t/p/w500" + data.logo.file_path : "")} alt={data.title} draggable="false" />
        </div>

        <div className="media-main">
          {
            data.tagline &&
            <p className="media-tagline">{data.tagline}</p>
          }

          <div className="media-meta">
            <div className="media-genres">
              {
                data.genres.length ?
                  data.genres.map((v, i) => <span key={i}>{v.name}</span>) :
                  <span>Series</span>
              }
            </div>

            <div className="media-details">
              <p>{toYear(data.first_air_date)}</p>
              <p>{data.number_of_seasons} Season{data.number_of_seasons > 1 ? "s" : ""}</p>
            </div>
          </div>

          <div className="media-actions">
            <Link to={`/player/${id}?s=${season}&e=1${data.number_of_seasons ? "&ms=" + data.number_of_seasons : ""}${episodes ? "&me=" + episodes.length : ""}`}>
              <button className="primary">
                <i className="fa-solid fa-play"></i>
                <p>S{season} E1</p>
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

      <MediaTabs
        tabs={[
          {
            title: "Episodes",
            element: <MediaEpisodes id={data.id} season={season} setSeason={newSeason} seasons={data.number_of_seasons} episodes={episodes!} />
          },
          {
            title: "Cast",
            element: <ActorSection posters={data.credits.cast} />,
          },
          {
            title: "Similar Shows",
            element: <PosterSection posters={data.recommendations.results} />
          }
        ]} />
    </Fragment>
  )
}