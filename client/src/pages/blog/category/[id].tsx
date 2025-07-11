import { useParams } from 'wouter';
import { useEffect, useState } from 'react';
import { BlogPostCard } from '@/components/blog/BlogPostCard';

interface BlogPost {
  id: string;
  title: string;
  summary: string;
  date: string;
  slug?: string;
  imageUrl?: string;
  imageAlt?: string;
  category?: string;
}

export default function BlogCategory() {
  const { id } = useParams();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/blog/category/${id}`)
      .then(res => res.json())
      .then(data => {
        setPosts(data.posts);
        setCategoryName(data.categoryName);
        setLoading(false);
      });
  }, [id]);

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">{categoryName || 'Category'}</h1>
      {loading ? (
        <div className="text-center text-gray-400">Loading posts...</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(post => (
            <BlogPostCard key={post.id} {...post} />
          ))}
        </div>
      )}
    </div>
  );
}
