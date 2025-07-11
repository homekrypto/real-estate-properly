import { useEffect, useState } from 'react';
import { BlogPostCard } from '@/components/blog/BlogPostCard';
import { BlogEditor } from '@/components/blog/BlogEditor';
import { useAuth } from '@/hooks/useAuth';

interface BlogPost {
  id: string;
  title: string;
  summary: string;
  content: string;
  date: string;
  image?: string;
  category?: string;
  tags?: string[];
  authorId?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoTags?: string[];
}

export default function AgentDashboard() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const agentId = user?.id || '';
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/blog/posts?authorId=${agentId}`)
      .then(res => res.json())
      .then(data => setPosts(data));
    setLoading(false);
  }, [agentId]);

  function handleEdit(post: BlogPost) {
    setEditingPost(post);
    setShowEditor(true);
  }

  function handleDelete(id: string) {
    fetch(`/api/blog/posts/${id}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(() => setPosts(posts.filter(p => p.id !== id)));
  }

  function handleSave(data: any) {
    if (editingPost) {
      fetch(`/api/blog/posts/${editingPost.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, authorId: agentId })
      })
        .then(res => res.json())
        .then(() => {
          setPosts(posts.map(p => (p.id === editingPost.id ? { ...p, ...data } : p)));
          setShowEditor(false);
          setEditingPost(null);
        });
    } else {
      fetch('/api/blog/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, authorId: agentId })
      })
        .then(res => res.json())
        .then(newPost => {
          setPosts([...posts, newPost]);
          setShowEditor(false);
          setEditingPost(null);
        });
    }
  }

  if (isLoading) {
    return <div className="container mx-auto px-4 py-16 text-center text-gray-400">Loading...</div>;
  }
  if (!isAuthenticated || user?.role !== 'agent') {
    return <div className="container mx-auto px-4 py-16 text-center text-red-600">Unauthorized: Agents only.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">Agent Dashboard</h1>
      <button
        className="luxury-button mb-8 px-6 py-2 rounded font-bold text-white bg-forest-600 dark:bg-forest-400 hover:bg-forest-700 dark:hover:bg-forest-500"
        onClick={() => { setShowEditor(true); setEditingPost(null); }}
      >
        Write New Blog Post
      </button>
      {showEditor && (
        <BlogEditor
          initialTitle={editingPost?.title}
          initialContent={editingPost?.content}
          initialCategory={editingPost?.category}
          initialTags={editingPost?.tags}
          initialSEOTitle={editingPost?.seoTitle}
          initialSEODescription={editingPost?.seoDescription}
          initialSEOTags={editingPost?.seoTags}
          onSave={handleSave}
        />
      )}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
        {posts.map(post => (
          <div key={post.id} className="relative">
            <BlogPostCard {...post} />
            <div className="absolute top-2 right-2 flex space-x-2">
              <button className="px-2 py-1 bg-blue-600 text-white rounded" onClick={() => handleEdit(post)}>Edit</button>
              <button className="px-2 py-1 bg-red-600 text-white rounded" onClick={() => handleDelete(post.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
