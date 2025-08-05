import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import conf from "../config";

import PosterOptions from "../types/PosterOptions";

import PosterSection from "../components/PosterSection";

import Error from "./Error";
import Loading from "./Loading";
import { Helmet } from "react-helmet";

interface Hero {
  id: number | string;
  backdrop: string;
  logo: string;
  description: string;
}

interface Collection {
  title: string;
  data: PosterOptions[]
}

export default function Index() {
  const [error, setError] = useState<string>();
  const [hero, setHero] = useState<Hero>();
  const [collections, setCollections] = useState<Collection[]>([]);

  function getViewed() {
    const viewed = localStorage.getItem('viewed');

    if (!viewed) {
      return;
    }

    console.log(viewed);

    const parsed = JSON.parse(viewed);

    collections.push({
      title: 'Recently Viewed',
      data: parsed
    });
  }

  async function loadData() {
    const req = await fetch("https://raw.githubusercontent.com/Im2rnado/FreeFilms/main/api.json");
    const res = await req.json();

    if (!res.success) {
      setError("Unable to load server data");
      return;
    }

    const data = res;
    let allArrays = data['collections'];

    if (collections[0]) {
      const viewed = collections[0];
      allArrays.splice(1, 0, viewed);
    }

    setHero(data['hero']);
    setCollections(allArrays);
  }

  useEffect(() => {
    getViewed();
    loadData();
  }, []);

  if (error) {
    return <Error message={error} />
  }

  if (!hero || !collections || !collections.length) {
    return <Loading />;
  }

  return (
    <Fragment>
      <Helmet>
        <title>{conf.SITE_TITLE}</title>
      </Helmet>

      <div className="hero" style={{
        backgroundImage: `url(${hero.backdrop})`
      }}>

        <div className="hero-content">
          <img className="hero-logo" src={hero.logo} />

          <p className="hero-text">{hero.description.length > 200 ? hero.description.slice(0, 160).trim() + '...' : hero.description}</p>

          <div className="hero-actions">
            <Link to={`/player/${hero.id}`}>
              <button className="primary">
                <i className="fa-solid fa-play"></i>
                <p>Play</p>
              </button>
            </Link>

            <Link to={`/movie/${hero.id}`}>
              <button className="secondary">
                <i className="fa-solid fa-circle-info"></i>
                <p>More Info</p>
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="collections-overlap">
        {
          collections.map((v: Collection, i) => {
            return <PosterSection key={i} title={v.title} posters={v.data} />;
          })
        }
      </div>

    </Fragment>
  )
}