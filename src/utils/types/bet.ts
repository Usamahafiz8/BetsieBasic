export interface UserProfile {
  id: string | number;
  name?: string;
  profilePicture?: string;
}

export interface Bet {
  id: string | number;
  creator?: UserProfile;
  opponent?: UserProfile;
  winner?: UserProfile;
  description?: string;
  startTime?: string;
  createdAt?: string;
  expiresAt?: string;
  lastLogin?: string;
  status?: string;
  title?: string;
  feedTitle?: string;
  messageTitle?: string;
  message?: string;
  email?: string;
  likesCount?: number;
  likes?: number;
  commentsCount?: number;
  comments?: number;
  [key: string]: any;
}
