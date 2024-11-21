import { useState } from 'react';
import { useLocalStorage } from './useLocalStorage';

type FetchResponse<T> = {
  data: T | null;
  error:  unknown;
  isLoading: boolean;
};
interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: string;
}

export const useFetch = <T,>() => {
  const [response, setResponse] = useState<FetchResponse<T>>({
    data: null,
    error: null,
    isLoading: false,
  });
  const { getItem } = useLocalStorage();

  const fetchData = async (url: string, fetchOptions?: FetchOptions) => {
    setResponse((prevState) => ({ ...prevState, isLoading: true }));

    try {
      const token = await getItem('token');
      const headers = fetchOptions?.headers ?? {};

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const res = await fetch(url, {
        ...fetchOptions,
        headers: headers
      });

      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      setResponse({ data, error: null, isLoading: false });
    }
    catch (error) {
      if (error instanceof Error) {
        setResponse({ data: null, error, isLoading: false });
        return;
      } 
      setResponse({ data: null, error , isLoading: false });
    }
  };

  return [response, fetchData] as const;
};