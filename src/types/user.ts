export interface User {
    id: string;
    ethAddress: string;
    username: string;
    bio?: string;
    createdAt: string;
    posts: Post[];
}

export interface Post {
  id: string;
  content: string;
  createdAt: Date;
  userEthAddress: string;
  user: User;
}
