export interface CountedItem {
    label: string;
    count: number | string;
    id?: string;
}

export interface PlayerMetrics {
  kind: 'playerMetrics';
  top_artists: CountedItem[];
  top_songs: CountedItem[];
  top_mods: CountedItem[];
  hour_histogram: number[];
  closest_neighbours: CountedItem[];
}