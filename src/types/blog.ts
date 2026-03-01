export interface BlogArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedDate: string;
  readTime: string;
  category: string;
  image: string;
  featured: boolean;
  slug: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface BlogListResponse {
  articles: BlogArticle[];
  hasMore: boolean;
  total: number;
  page: number;
  limit: number;
}