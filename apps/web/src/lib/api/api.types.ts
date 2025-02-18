export type ErrorResponse = {
  message: string | string[];
  error: string;
  statusCode: number;
};

export type ApiRequestState<T> = {
  data: T | null;
  errors: string[];
  loading: boolean;
};
