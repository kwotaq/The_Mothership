export interface CountedItem {
  label: string;
  count: number;
  [key: string]: unknown;
}

export interface PlayerMetrics {
  kind: 'playerMetrics';
  top_artists: CountedItem[];
  top_songs: CountedItem[];
  top_mods: CountedItem[];
  hour_histogram: number[];
  closest_neighbours: CountedItem[];
}