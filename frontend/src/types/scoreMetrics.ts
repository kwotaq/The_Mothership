export interface CountedItem {
  label: string;
  count: number;
}

export interface ScoreMetrics {
  kind: 'scoreStats';
  top_players: CountedItem[];
  top_mappers: CountedItem[];
}