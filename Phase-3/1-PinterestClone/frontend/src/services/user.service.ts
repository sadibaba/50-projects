import api from "./api";
import { ProfileResponse, User } from "@/types";

export const userService = {
  async profile(idOrUsername: string) {
    const response = await api.get(`/users/${idOrUsername}/profile`);
    return response.data as ProfileResponse;
  },
  async follow(id: string) {
    const response = await api.put(`/users/${id}/follow`);
    return response.data as { following: boolean; followersCount: number };
  },
  async unfollow(id: string) {
    const response = await api.put(`/users/${id}/unfollow`);
    return response.data as { following: boolean; followersCount: number };
  },
  async search(q: string) {
    const response = await api.get("/users/search", { params: { q } });
    return response.data as User[];
  },
  async saved() {
    const response = await api.get("/users/me/saved");
    return response.data;
  },
};
