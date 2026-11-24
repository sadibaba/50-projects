export interface User {
  _id: string;
  username: string;
  name: string;
  email?: string;
  bio: string;
  avatar: string;
  cover: string;
  website: string;
  location: string;
  followers: string[];
  following: string[];
  createdAt: string;
}

export interface Pin {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  videoUrl?: string;
  posterUrl?: string;
  type: "image" | "video";
  category: string;
  tags: string[];
  sourceName: string;
  sourceUrl: string;
  createdBy: User;
  board?: { _id: string; name: string } | string;
  likes: string[];
  saves: string[];
  likesCount: number;
  savesCount: number;
  commentsCount: number;
  liked: boolean;
  saved: boolean;
  views: number;
  width: number;
  height: number;
  createdAt: string;
  related?: Pin[];
}

export interface Board {
  _id: string;
  name: string;
  description: string;
  cover: string;
  isSecret: boolean;
  createdBy: User;
  pins: Pin[];
  pinsCount: number;
  createdAt: string;
}

export interface Comment {
  _id: string;
  text: string;
  user: User;
  pin: string;
  createdAt: string;
}

export interface Notification {
  _id: string;
  recipient: string;
  actor: User;
  type: "like" | "comment" | "follow" | "save";
  pin?: { _id: string; title: string; imageUrl: string };
  read: boolean;
  createdAt: string;
}

export interface ProfileResponse {
  user: User;
  pins: Pin[];
  boards: Board[];
  saved: Pin[];
  followers: User[];
  following: User[];
  followersCount: number;
  followingCount: number;
  totalLikes: number;
  isFollowing: boolean;
}

export interface FreeImage {
  id: string;
  title: string;
  alt_description: string;
  urls: { regular: string; small: string; thumb: string };
  user: { name: string; username: string };
  sourceName: string;
  sourceUrl: string;
  width: number;
  height: number;
}
