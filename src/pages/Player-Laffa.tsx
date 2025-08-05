import { useState, useEffect, Fragment } from "react";
import { Helmet } from "react-helmet";
import { Link, useParams, useSearchParams } from "react-router-dom";

import conf from "../config";

export default function Player_Laffa() {
    const { id } = useParams();
    const [s] = useSearchParams();

    const [loaded, setLoaded] = useState<boolean>(false);

    const [type, setType] = useState<"movie">();

    function removeAds(iframes: HTMLCollectionOf<HTMLIFrameElement>): any {
        for (const iframe of iframes) {
            iframe.setAttribute(
                "sandbox",
                "allow-forms allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation"
            );
            console.log("Done for: " + iframe.src);
        }
    }

    useEffect(() => {
        setLoaded(false);

        setType("movie");
    }, [id, s]);

    return (
        <Fragment>
            <Helmet>
                <title>Player - {conf.SITE_TITLE}</title>
            </Helmet>

            {!loaded && (
                <div className="loading">
                    <div className="spinner">
                        <i className="fa-solid fa-spinner"></i>
                    </div>
                </div>
            )}

            <div className="player">
                {typeof type !== "undefined" && (
                    <iframe
                        allowFullScreen
                        onLoad={() => {
                            setLoaded(true);
                        }}
                        src={"https://drive.google.com/file/d/1dlU7WN-hnwwnJOgSZHs8NHdAx9oyIS9C/preview"}
                    ></iframe>
                )}

                {loaded && (
                    <div className="overlay">
                        <Link to="/">
                            <i className="fa-solid fa-home"></i>
                        </Link>

                        <Link to={"/movie/laffa"}>
                            <i className="fa-solid fa-close"></i>
                        </Link>
                    </div>
                )}
            </div>
        </Fragment>
    );
}