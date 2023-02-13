import {QueryClient, QueryKey} from "@tanstack/react-query";
import axios from "axios";
import User from "../types/User";
import UserPage from "../types/UserPage";
import {v4} from "uuid";

const defaultQueryFn = async ({ queryKey }: { queryKey: QueryKey }) => {
  const endpoint = queryKey[0];
  const page = queryKey.length > 1 ? queryKey[1] : 1;
  const { data } = await axios.get(
    `https://reqres.in/api${endpoint}?page=${page}&delay=1`
  );
  return data;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn,
    },
  },
});

queryClient.setMutationDefaults(['post', '/users'], {
  mutationFn: async (user: User): Promise<User> => {
    const url = `https://reqres.in/api/users?delay=4`;
    const { data } =  await axios.post(url, user);
    return { ...data, id: v4() }
  },
  onMutate: async (data: User) => {
    await queryClient.cancelQueries({queryKey: ['/users']});
    const optimist = { ...data };
    queryClient.setQueryData(
      ['/users'],
      (old: UserPage|undefined): UserPage => {
        return old ? {
          ...old,
          data: [optimist, ...(old.data || [])]
        } : {
          page: 1,
          per_page: 1,
          total: 1,
          total_pages: 1,
          data: [optimist]
        };
      }
    );
    return { optimist };
  },
  onSuccess: (data: User, variables, context) => {
    queryClient.setQueryData(
      ['/users'],
      (old: UserPage|undefined): UserPage => {
        return old ? {
          ...old,
          data: old.data.map((user) => (
            user.id === context.optimist.id) ? data : user
          )
        } : {
          page: 1,
          per_page: 1,
          total: 1,
          total_pages: 1,
          data: [data]
        };
      }
    );
  },
  onError: (err, data, context) => {
    queryClient.setQueryData(
      ['/users'],
      (old: UserPage|undefined): UserPage => {
        return old ? {
          ...old,
          data: old.data.filter((user) => user.id !== context.optimist.id)
        } : {
          page: 1,
          per_page: 1,
          total: 1,
          total_pages: 1,
          data: []
        }
      }
    );
  },
  retry: 3
});

export default queryClient;