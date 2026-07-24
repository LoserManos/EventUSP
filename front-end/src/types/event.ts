export interface Event {
  id: number;
  title: string;
  start_date: string;
  duration: number;
  local: string;
  likes: number;
  category_id: number;
  user_id: number;
  organization_id?: number | null;
  banner?: string | null;
  created_at: string; 
}
