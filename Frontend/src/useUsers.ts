import { useQuery, UseQueryResult } from "@tanstack/react-query";

interface User {
  id: number;
  name: string;
}

const fetchUsers = async (): Promise<User[]> => {
  const users = localStorage.getItem("users");
  return users ? JSON.parse(users) : [];
};

export const useUsers = (): UseQueryResult<User[], Error> => {
  return useQuery<User[], Error>({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });
};
