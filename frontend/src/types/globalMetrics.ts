export interface CountedItem {
  label: string;
  count: number;
}

export interface GlobalMetrics {
  kind: 'globalMetrics';
  top_artists: CountedItem[];
  top_songs: CountedItem[];
  top_mappers: CountedItem[];
  top_mods: CountedItem[];
  hour_histogram: CountedItem[];
  bpm_histogram: CountedItem[];
  year_created_histogram: CountedItem[];
}