import PosterOptions from "./PosterOptions"

interface MediaProps {
  id: string,
  imdb_id: string,
  title: string,
  overview: string,
  tagline?: string,
  genres: any[],
  release_date: string,
  recommendations: { results: PosterOptions[] },
  poster_path: string,
  backdrop_path: string,
  images: { logos: any[], posters: any[] },
  logo: { file_path: string },
  credits: { cast: any[] }
}

export interface MovieProps extends MediaProps {
  runtime: number
}

export interface TvData extends MediaProps {
  number_of_seasons: number,
  episodes: EpisodeProps[]
}

export interface TvProps extends MediaProps {
  name: string,
  number_of_seasons: number,
  first_air_date: string
}

export interface EpisodeProps {
  episode_number: string | number,
  still_path: string,
  name: string,
  runtime: number
}

export type MediaType = 'movie' | 'series';

export interface MediaShort {
  id: string;
  poster: string;
  title: string;
  type: string;
}

export interface Continue {
  season: number;
  episode: number;
}