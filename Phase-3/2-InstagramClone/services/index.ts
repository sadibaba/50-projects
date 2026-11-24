import { api } from "./api";
import type { Comment, Notification, Post, ProfileResponse, Story, User } from "@/types";

export const authApi = {
  me: () => api.get<{ user: User | null }>("/api/auth/me"),
  login: (body: { email: string; password: string }) => api.post<{ user: User }>("/api/auth/login", body),
  register: (body: { username: string; email: string; password: string; name?: string }) =>
    api.post<{ user: User }>("/api/auth/register", body),
  logout: () => api.post<{ message: string }>("/api/auth/logout"),
};

export const postApi = {
  list: (params: Record<string, string | number | undefined>) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => value !== undefined && query.set(key, String(value)));
    return api.get<{ posts: Post[]; page: number; total: number; hasMore: boolean; private?: boolean }>(`/api/posts?${query}`);
  },
  get: (id: string) => api.get<Post>(`/api/posts/${id}`),
  create: (body: Record<string, unknown>) => api.post<Post>("/api/posts", body),
  update: (id: string, body: Record<string, unknown>) => api.patch<Post>(`/api/posts/${id}`, body),
  remove: (id: string) => api.delete<{ message: string }>(`/api/posts/${id}`),
  like: (id: string) => api.put<{ liked: boolean; likesCount: number }>(`/api/posts/${id}/like`),
  save: (id: string) => api.put<{ saved: boolean }>(`/api/posts/${id}/save`),
  comments: (id: string) => api.get<Comment[]>(`/api/posts/${id}/comments`),
  addComment: (id: string, text: string) => api.post<Comment>(`/api/posts/${id}/comments`, { text }),
  removeComment: (id: string, commentId: string) => api.delete<{ message: string }>(`/api/posts/${id}/comments/${commentId}`),
};

export const userApi = {
  profile: (username: string) => api.get<ProfileResponse>(`/api/users/${username}`),
  updateMe: (body: Record<string, unknown>) => api.patch<User>("/api/users/me", body),
  follow: (username: string) => api.put<{ following: boolean; followersCount: number }>(`/api/users/${username}/follow`),
  followers: (username: string) => api.get<User[]>(`/api/users/${username}/followers`),
  following: (username: string) => api.get<User[]>(`/api/users/${username}/following`),
  search: (q: string) => api.get<User[]>(`/api/users/search?q=${encodeURIComponent(q)}`),
  suggested: () => api.get<User[]>("/api/users/suggested"),
};

export const notificationApi = {
  list: () => api.get<{ notifications: Notification[]; unread: number }>("/api/notifications"),
  markAll: () => api.put<{ message: string }>("/api/notifications/read-all"),
  markOne: (id: string) => api.put<{ message: string }>(`/api/notifications/${id}/read`),
};

export const storyApi = {
  list: () => api.get<Story[]>("/api/stories"),
  create: (body: { imageUrl: string; caption?: string }) => api.post<Story>("/api/stories", body),
};

export const searchApi = {
  search: (q: string) => api.get<{ users: User[]; posts: Post[] }>(`/api/search?q=${encodeURIComponent(q)}`),
};

export const uploadApi = {
  image: (file: File) => {
    const form = new FormData();
    form.append("image", file);
    return api.post<{ url: string; size: number }>("/api/upload", form);
  },
};
