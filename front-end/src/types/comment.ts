import { User } from './user';

export interface Comment {
  id: number;
  content: string;
  created_at: string;
  user_id: number;
  author: User;
}
