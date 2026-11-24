export interface User {
  _id: string;
  username: string;
  name: string;
  email?: string;
  bio: string;
  avatar: string;
  website: string;
  isPrivate: boolean;
  followers: string[];
  following: string[];
  createdAt: string;
}

export interface Post {
  _id: string;
  imageUrl: string;
  videoUrl: string;
  type: "image" | "video";
  caption: string;
  altText: string;
  location: string;
  tags: string[];
  author: Pick<User, "_id" | "username" | "name" | "avatar" | "isPrivate">;
  likesCount: number;
  liked: boolean;
  saved: boolean;
  commentsCount: number;
  createdAt: string;
}

export interface Comment {
  _id: string;
  text: string;
  user: Pick<User, "_id" | "username" | "name" | "avatar">;
  createdAt: string;
}

export interface Story {
  _id: string;
  imageUrl: string;
  caption: string;
  user: Pick<User, "_id" | "username" | "name" | "avatar" | "isPrivate">;
  createdAt: string;
}

export interface Notification {
  _id: string;
  type: "like" | "comment" | "follow" | "save";
  actor: Pick<User, "_id" | "username" | "name" | "avatar">;
  post?: { _id: string; imageUrl: string; caption: string };
  read: boolean;
  createdAt: string;
}

export interface ProfileResponse {
  user: User;
  posts: Post[];
  saved: Post[];
  followersCount: number;
  followingCount: number;
  totalLikes: number;
  isFollowing: boolean;
  canView: boolean;
}
