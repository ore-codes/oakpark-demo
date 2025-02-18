import { AxiosError, AxiosResponse } from 'axios';
import { useState } from 'react';
import { catchError, from, of, switchMap } from 'rxjs';

import { ApiRequestState, ErrorResponse } from './api.types.ts';

export function useApiRequest<T>() {
  const [state, setState] = useState<ApiRequestState<T>>({
    data: null,
    errors: [],
    loading: false,
  });

  const makeRequest = (promise: Promise<AxiosResponse<T>>) => {
    const initialLoadingState = { ...state, loading: true, errors: [] };
    setState(initialLoadingState);

    return from(promise).pipe(
      switchMap((response) => {
        const successState = { data: response.data, errors: [], loading: false };
        setState(successState);
        return of(response.data);
      }),
      catchError((err: AxiosError<ErrorResponse>) => {
        const errors = err.response?.data?.message || [];
        const errorState = {
          data: null,
          errors: Array.isArray(errors) ? errors : [errors],
          loading: false,
        };
        setState(errorState);
        return of(null);
      })
    );
  };

  return {
    ...state,
    makeRequest,
  };
}
