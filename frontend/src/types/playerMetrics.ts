import type {Score} from "./score.ts";

export interface CountedItem {
    label: string | null;
    count: number;
    info?: any;
}

export interface PlayerMetrics {
  kind: 'playerMetrics';
  top_artists: CountedItem[];
  top_songs: CountedItem[];
  top_mods: CountedItem[];
  top_mappers: CountedItem[];
  hour_histogram: number[];
  closest_neighbours: CountedItem[];
  recent_scores: Score[];
}