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
            console.error("Query error:", query.queryKey, error);
          },
        }),

        mutationCache: new MutationCache({
          onError: (error, _variables, _context, mutation) => {
            console.error(
              "Mutation error:",
              mutation.options.mutationKey,
              error,
            );
          },
        }),

        defaultOptions: {
          queries: {
            staleTime: 0, // ✅ Siempre considera datos viejos
            gcTime: 1000 * 60 * 30,
            retry: 1,
            refetchOnWindowFocus: true, // ✅ Refresca al volver a la ventana
            refetchOnReconnect: true,
            refetchOnMount: true, // ✅ Refresca al montar el componente
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
