export interface CountedItem {
  label: string;
  count: number;
}

export interface PlayerStats {
  kind: 'playerStats';
  top_artists: CountedItem[];
  top_songs: CountedItem[];
  top_mods: CountedItem[];
  hour_histogram: number[];
}