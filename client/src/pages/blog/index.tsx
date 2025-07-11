import { useEffect, useState, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { BlogPostCard } from '@/components/blog/BlogPostCard';


type BlogPost = {
  id: string;
  title: string;
  summary: string;
  date: string;
  slug?: string;
  imageUrl?: string;
  imageAlt?: string;
  category?: string;
  featured?: boolean;
  authorId?: string;
  authorName?: string;
};
const PAGE_SIZE = 9;

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<BlogPost[] | null>(null);
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (search.trim()) return;
    setLoading(true);
    fetch(`/api/blog/posts?page=${page}&limit=${PAGE_SIZE}`)
      .then(res => res.json())
      .then(data => {
        if (page === 1) {
          setPosts(data.posts);
        } else {
          setPosts(prev => [...prev, ...data.posts]);
        }
        setHasMore(data.posts.length === PAGE_SIZE);
        setLoading(false);
      });
  }, [page, search]);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewsletterStatus(null);
    const res = await fetch('/api/blog/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: newsletterEmail })
    });
    if (res.ok) {
      setNewsletterStatus('Subscribed!');
      setNewsletterEmail('');
    } else {
      const data = await res.json();
      setNewsletterStatus(data.error || 'Error');
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    setLoading(true);
    const res = await fetch(`/api/blog/search?query=${encodeURIComponent(search)}`);
    const results = await res.json();
    setSearchResults(results);
    setLoading(false);
  };

  const loadMore = () => {
    if (hasMore && !loading) setPage(page + 1);
  };

  const handleScroll = useCallback(() => {
    if (!loaderRef.current || loading || !hasMore) return;
    const rect = loaderRef.current.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      loadMore();
    }
  }, [loading, hasMore, loadMore]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div className="container mx-auto px-4 py-16">
      <Helmet>
        <title>Blog | Real Estate Properly</title>
        <meta name="description" content="Latest real estate news, guides, and tips." />
        <meta property="og:title" content="Blog | Real Estate Properly" />
        <meta property="og:description" content="Latest real estate news, guides, and tips." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
        <meta property="og:image" content="/logo.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Blog | Real Estate Properly" />
        <meta name="twitter:description" content="Latest real estate news, guides, and tips." />
        <meta name="twitter:image" content="/logo.png" />
      </Helmet>
      {/* Newsletter Signup */}
      <div className="bg-forest-50 dark:bg-gray-900 rounded-lg shadow p-6 mb-12 max-w-xl mx-auto">
        <h2 className="text-2xl font-bold mb-2 text-forest-600 dark:text-forest-400">Subscribe to our Newsletter</h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">Get the latest real estate news, guides, and tips delivered to your inbox.</p>
        <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            required
            placeholder="Your email address"
            className="p-3 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white"
            value={newsletterEmail}
            onChange={e => setNewsletterEmail(e.target.value)}
            disabled={!!newsletterStatus}
          />
          <button type="submit" className="luxury-button px-6 py-2 rounded font-bold text-white bg-forest-600 dark:bg-forest-400 hover:bg-forest-700 dark:hover:bg-forest-500" disabled={!!newsletterStatus}>
            {newsletterStatus ? newsletterStatus : 'Subscribe'}
          </button>
        </form>
        {newsletterStatus && <div className="mt-2 text-green-600">{newsletterStatus}</div>}
      </div>
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-8 max-w-xl mx-auto flex gap-4">
        <input
          type="text"
          placeholder="Search blog posts..."
          className="p-3 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white flex-1"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button type="submit" className="luxury-button px-6 py-2 rounded font-bold text-white bg-blue-600 hover:bg-blue-700">Search</button>
      </form>
      {/* Featured Posts */}
      {posts.filter(p => p.featured).length > 0 && !searchResults && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-yellow-600">Featured Posts</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.filter(p => p.featured).map(post => (
              <BlogPostCard key={post.id} {...post} />
            ))}
          </div>
        </div>
      )}
      {/* Blog Posts */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {(searchResults || posts.filter(p => !p.featured)).map(post => (
          <BlogPostCard key={post.id} {...post} />
        ))}
      </div>
      {loading && <div className="text-center text-gray-400 mt-8">Loading posts...</div>}
      {hasMore && !loading && !searchResults && (
        <div ref={loaderRef} className="flex justify-center mt-8">
          <button
            className="luxury-button px-6 py-2 rounded font-bold text-white bg-forest-600 dark:bg-forest-400 hover:bg-forest-700 dark:hover:bg-forest-500"
            onClick={loadMore}
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
