export interface ChartDataItem {
  rating: number;
  count: number;
  percentage: number;
  firstReview: string;
  lastReview: string;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
  error?: string;
}