import { Fragment, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

import conf from "../config";

import PosterOptions from "../types/PosterOptions";

export default function List() {
    const [wishlist, setWishlist] = useState<PosterOptions[]>([]);

    function getWishlist() {
        const wishlist = localStorage.getItem('wishlist');

        if (!wishlist) return;

        setWishlist(JSON.parse(wishlist));
    }

    useEffect(() => {
        getWishlist();

        window.addEventListener('wishlist-changed', getWishlist);

        return () => {
            window.removeEventListener('wishlist-changed', getWishlist);
        };
    }, []);

    return (
        <>
            <Helmet>
                <title>Watchlist - {conf.SITE_TITLE}</title>
            </Helmet>

            <div className="new-page">
                <h1 className="page-title">Watchlist</h1>

                <Fragment>
                    <div className="search-results">
                        {
                            wishlist.map((v, i) => {
                                return <Link className='poster' key={i} title={v.name} to={`/${v.type}/${v.id}`} style={{ backgroundImage: `url('https://image.tmdb.org/t/p/w300${v.poster}')` }}></Link>
                            })
                        }
                    </div>
                </Fragment>
            </div>
        </>
    )
}