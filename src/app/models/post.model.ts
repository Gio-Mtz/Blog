export interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  imageBase64?: string | null;
  tags?: string[];
  slug: string;
  directoryRoute?: string;
}
