import { useEffect, useState } from 'react';
import { Link } from 'wouter';

interface Category {
  id: string;
  name: string;
  description: string;
}

export default function BlogCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/blog/categories')
      .then(res => res.json())
      .then(data => {
        setCategories(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">Blog Categories</h1>
      {loading ? (
        <div className="text-center text-gray-400">Loading categories...</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <Link key={cat.id} href={`/blog/category/${cat.id}`} className="block bg-white dark:bg-gray-900 rounded-lg shadow p-6 hover:shadow-lg transition-all">
              <h2 className="text-2xl font-semibold mb-2">{cat.name}</h2>
              <p className="text-gray-600 dark:text-gray-400">{cat.description}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
