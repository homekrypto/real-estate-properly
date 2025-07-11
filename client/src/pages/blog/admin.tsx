import { useEffect, useState } from 'react';
import { BlogPostCard } from '@/components/blog/BlogPostCard';
import { BlogEditor } from '@/components/blog/BlogEditor';
import { CategorySelector } from '@/components/blog/CategorySelector';
import { ImageUploader } from '@/components/blog/ImageUploader';
import { SEOFields } from '@/components/blog/SEOFields';
import { useAuth } from '@/hooks/useAuth';

interface BlogPost {
  id: string;
  title: string;
  summary: string;
  content: string;
  date: string;
  slug?: string;
  imageUrl?: string;
  imageAlt?: string;
  category?: string;
  tags?: string[];
  seoTitle?: string;
  seoDescription?: string;
  seoTags?: string[];
}

interface Category {
  id: string;
  name: string;
}

export default function AdminDashboard() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/blog/posts')
      .then(res => res.json())
      .then(data => setPosts(data));
    fetch('/api/blog/categories')
      .then(res => res.json())
      .then(data => setCategories(data));
    setLoading(false);
  }, []);

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
        body: JSON.stringify(data)
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
        body: JSON.stringify(data)
      })
        .then(res => res.json())
        .then(newPost => {
          setPosts([...posts, newPost]);
          setShowEditor(false);
          setEditingPost(null);
        });
    }
  }

  function handleCategoryEdit(id: string, name: string) {
    fetch(`/api/blog/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    })
      .then(res => res.json())
      .then(() => setCategories(categories.map(c => (c.id === id ? { ...c, name } : c))));
  }

  function handleCategoryDelete(id: string) {
    fetch(`/api/blog/categories/${id}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(() => setCategories(categories.filter(c => c.id !== id)));
  }

  function handleCategoryCreate(name: string) {
    fetch('/api/blog/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    })
      .then(res => res.json())
      .then(newCat => setCategories([...categories, newCat]));
  }

  if (isLoading) {
    return <div className="container mx-auto px-4 py-16 text-center text-gray-400">Loading...</div>;
  }
  if (!isAuthenticated || user?.role !== 'admin') {
    return <div className="container mx-auto px-4 py-16 text-center text-red-600">Unauthorized: Admins only.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
      <button
        className="luxury-button mb-8 px-6 py-2 rounded font-bold text-white bg-forest-600 dark:bg-forest-400 hover:bg-forest-700 dark:hover:bg-forest-500"
        onClick={() => { setShowEditor(true); setEditingPost(null); }}
      >
        Create New Post
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
      <h2 className="text-2xl font-bold mt-16 mb-4">Categories</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map(cat => (
          <div key={cat.id} className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">{cat.name}</h3>
            <div className="flex space-x-2 mt-2">
              <button className="px-2 py-1 bg-blue-600 text-white rounded" onClick={() => {
                const newName = prompt('Edit category name:', cat.name);
                if (newName) handleCategoryEdit(cat.id, newName);
              }}>Edit</button>
              <button className="px-2 py-1 bg-red-600 text-white rounded" onClick={() => handleCategoryDelete(cat.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <input type="text" placeholder="New category name" id="newCatName" className="p-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-black dark:text-white mr-2" />
        <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={() => {
          const input = document.getElementById('newCatName') as HTMLInputElement;
          if (input && input.value) handleCategoryCreate(input.value);
        }}>Add Category</button>
      </div>
    </div>
  );
}
