export interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  imageBase64?: string | null;
  tags?: string[];
}
