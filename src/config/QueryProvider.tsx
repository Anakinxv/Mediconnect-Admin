import type { ReactNode } from "react";
import { useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
  MutationCache,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

type QueryProviderProps = {
  children: ReactNode;
};

export const QueryProvider = ({ children }: QueryProviderProps) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error, query) => {
            // Error global de queries.
            // Aquí puedes conectar un toast/snackbar/logger central.
            console.error("Query error:", query.queryKey, error);
          },
        }),

        mutationCache: new MutationCache({
          onError: (error, _variables, _context, mutation) => {
            // Error global de mutations.
            console.error(
              "Mutation error:",
              mutation.options.mutationKey,
              error,
            );
          },
        }),

        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 min: evita refetch innecesario
            gcTime: 1000 * 60 * 30, // 30 min: cuánto vive en caché sin uso
            retry: 1,
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
            refetchOnMount: false,
          },
          mutations: {
            retry: 0,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
