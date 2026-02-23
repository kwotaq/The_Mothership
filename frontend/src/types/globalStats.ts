export interface CountedItem {
  label: string;
  count: number;
}

export interface GlobalStats {
  top_artists: CountedItem[];
  top_songs: CountedItem[];
  top_mods: CountedItem[];
  hour_histogram: number[];
}