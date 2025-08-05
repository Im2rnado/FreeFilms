import { Fragment } from "react";
import { Helmet } from "react-helmet";
import conf from "../config";

export default function Loading() {
  return (
    <Fragment>
      <Helmet>
        <title>Loading - {conf.SITE_TITLE}</title>
      </Helmet>

      <div className="new-page">
        <div className="loading">
          <div className="spinner">
            <i className="fa-solid fa-spinner"></i>
          </div>
        </div>
      </div>
    </Fragment>
  )
}