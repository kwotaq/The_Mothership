export interface CountedItem {
  label: string;
  count: number;
}

export interface ScoreStats {
  kind: 'scoreStats';
  top_players: CountedItem[];
  top_mappers: CountedItem[];
}