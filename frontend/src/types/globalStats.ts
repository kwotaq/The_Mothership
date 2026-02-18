export interface UserCoordinate {
  user_id: string;
  x: number;
  y: number;
}

export interface GlobalStats {
  top_artists: string[];
  top_songs: string[];
  hour_histogram: number[];
  similarity_coordinates: UserCoordinate[];
}