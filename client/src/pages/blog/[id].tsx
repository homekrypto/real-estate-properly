
import { Helmet } from 'react-helmet-async';
import { useParams } from 'wouter';
import { useEffect, useState } from 'react';
import { BlogPostCard } from '@/components/blog/BlogPostCard';

function BlogPostSEO({ post }) {
  if (!post) return null;
  const {
    seoTitle,
    seoDescription,
    ogTitle,
    ogDescription,
    ogImage,
    twitterTitle,
    twitterDescription,
    twitterImage,
    slug,
    imageUrl,
    authorId,
    date,
    title,
    summary,
    id,
  } = post;
  const schemaArticle = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": seoTitle || title,
    "description": seoDescription || summary,
    "image": imageUrl,
    "author": {
      "@type": "Person",
      "name": authorId,
    },
    "datePublished": date,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": typeof window !== 'undefined' ? `${window.location.origin}/blog/${slug || id}` : '',
    },
  };
  return (
    <Helmet>
      <title>{seoTitle || title}</title>
      <meta name="description" content={seoDescription || summary} />
      <meta property="og:title" content={ogTitle || seoTitle || title} />
      <meta property="og:description" content={ogDescription || seoDescription || summary} />
      <meta property="og:image" content={ogImage || imageUrl} />
      <meta property="og:type" content="article" />
      <meta property="og:url" content={typeof window !== 'undefined' ? `${window.location.origin}/blog/${slug || id}` : ''} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={twitterTitle || ogTitle || seoTitle || title} />
      <meta name="twitter:description" content={twitterDescription || ogDescription || seoDescription || summary} />
      <meta name="twitter:image" content={twitterImage || ogImage || imageUrl} />
      <script type="application/ld+json">{JSON.stringify(schemaArticle)}</script>
    </Helmet>
  );
}

// ...existing code...
  const { id } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState<BlogPost[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentLoading, setCommentLoading] = useState(false);
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [author, setAuthor] = useState<Author | null>(null);

  useEffect(() => {
    fetch(`/api/blog/posts/slug/${id}`)
      .then(res => {
        if (res.status === 404) {
          return fetch(`/api/blog/posts/${id}`);
        }
        return res;
      })
      .then(res => res.json())
      .then(data => {
        setPost(data);
        setLoading(false);
        if (data && data.authorId) {
          fetch(`/api/blog/authors/${data.authorId}`)
            .then(res => res.json())
            .then(authorData => setAuthor(authorData))
function BlogPostSEO({ post }) {
  if (!post) return null;
  const {
    seoTitle,
    seoDescription,
    ogTitle,
    ogDescription,
    ogImage,
    twitterTitle,
    twitterDescription,
    twitterImage,
    slug,
    imageUrl,
    authorId,
    date,
    title,
    summary,
    id,
  } = post;
  const schemaArticle = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": seoTitle || title,
    "description": seoDescription || summary,
    "image": imageUrl,
    "author": {
      "@type": "Person",
      "name": authorId,
    },
    "datePublished": date,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": typeof window !== 'undefined' ? `${window.location.origin}/blog/${slug || id}` : '',
    },
  };
  return (
    <Helmet>
      <title>{seoTitle || title}</title>
      <meta name="description" content={seoDescription || summary} />
      <meta property="og:title" content={ogTitle || seoTitle || title} />
      <meta property="og:description" content={ogDescription || seoDescription || summary} />
      <meta property="og:image" content={ogImage || imageUrl} />
      <meta property="og:type" content="article" />
      <meta property="og:url" content={typeof window !== 'undefined' ? `${window.location.origin}/blog/${slug || id}` : ''} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={twitterTitle || ogTitle || seoTitle || title} />
      <meta name="twitter:description" content={twitterDescription || ogDescription || seoDescription || summary} />
      <meta name="twitter:image" content={twitterImage || ogImage || imageUrl} />
      <script type="application/ld+json">{JSON.stringify(schemaArticle)}</script>
    </Helmet>
  );
}

const NewsletterSignup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess(false);
    const res = await fetch('/api/blog/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    if (res.ok) {
      setSuccess(true);
      setEmail('');
    } else {
      const data = await res.json();
      setError(data.error || 'Failed to subscribe');
    }
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="email"
        required
        placeholder="Your email address"
        className="p-3 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white"
        value={email}
        onChange={e => setEmail(e.target.value)}
        disabled={submitting}
      />
      <button
        type="submit"
        className="luxury-button px-6 py-2 rounded font-bold text-white bg-blue-600 dark:bg-blue-400 hover:bg-blue-700 dark:hover:bg-blue-500"
        disabled={submitting}
      >{submitting ? 'Subscribing...' : 'Subscribe'}</button>
      {success && <div className="text-green-600">Subscribed successfully!</div>}
      {error && <div className="text-red-600">{error}</div>}
    </form>
  );
};

export default function BlogPostPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentLoading, setCommentLoading] = useState(false);
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [author, setAuthor] = useState(null);

  useEffect(() => {
    fetch(`/api/blog/posts/slug/${id}`)
      .then(res => {
        if (res.status === 404) {
          return fetch(`/api/blog/posts/${id}`);
        }
        return res;
      })
      .then(res => res.json())
      .then(data => {
        setPost(data);
        setLoading(false);
        if (data && data.authorId) {
          fetch(`/api/blog/authors/${data.authorId}`)
            .then(res => res.json())
            .then(authorData => setAuthor(authorData))
            .catch(() => setAuthor(null));
        } else {
          setAuthor(null);
        }
        if (data && data.category) {
          fetch(`/api/blog/category/${data.category}`)
            .then(res => res.json())
            .then(catData => {
              const rel = (catData.posts || []).filter(p => p.id !== data.id).slice(0, 3);
              setRelated(rel);
            });
        }
      });
  }, [id]);

  useEffect(() => {
    if (!post?.id) return;
    setCommentLoading(true);
    fetch(`/api/blog/posts/${post.id}/comments`)
      .then(res => res.json())
      .then(data => {
        setComments(data);
        setCommentLoading(false);
      });
  }, [post?.id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;
    setSubmitting(true);
    const res = await fetch(`/api/blog/posts/${post?.id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, text })
    });
    const newComment = await res.json();
    setComments(prev => [...prev, newComment]);
    setName('');
    setText('');
    setSubmitting(false);
  };

  const handleDeleteComment = async (commentId) => {
    await fetch(`/api/blog/posts/${post?.id}/comments/${commentId}`, { method: 'DELETE' });
    setComments(prev => prev.filter(c => c.id !== commentId));
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-16 text-center text-gray-400">Loading post...</div>;
  }
  if (!post) {
    return <div className="container mx-auto px-4 py-16">Post not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <BlogPostSEO post={post} />
      {/* Author Info */}
      {author && (
        <div className="flex items-center mb-8 bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
          <img src={author.avatarUrl} alt={author.name} className="w-16 h-16 rounded-full mr-4" />
          <div>
            <div className="font-bold text-lg">
              <a href={`/blog/author/${author.id}`} className="text-blue-600 dark:text-blue-400 hover:underline">{author.name}</a>
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-sm mb-1">{author.bio}</div>
            <div className="flex gap-2 mt-1">
              {author.website && (
                <a href={author.website} target="_blank" rel="noopener" className="text-blue-500 hover:underline text-xs">Website</a>
              )}
              {author.twitter && (
                <a href={`https://twitter.com/${author.twitter}`} target="_blank" rel="noopener" className="text-blue-500 hover:underline text-xs">Twitter</a>
              )}
              {author.linkedin && (
                <a href={`https://linkedin.com/in/${author.linkedin}`} target="_blank" rel="noopener" className="text-blue-500 hover:underline text-xs">LinkedIn</a>
              )}
              {author.email && (
                <a href={`mailto:${author.email}`} className="text-blue-500 hover:underline text-xs">Email</a>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Schema.org Article JSON-LD markup for SEO */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        'headline': post.seoTitle || post.title || '',
        'description': post.seoDescription || '',
        'image': post.imageUrl ? [post.imageUrl] : [],
        'author': author ? { '@type': 'Person', 'name': author.name } : { '@type': 'Person', 'name': 'Admin' },
        'datePublished': post.date || '',
        'articleSection': post.category || '',
        'keywords': post.seoTags ? post.seoTags.join(', ') : '',
        'mainEntityOfPage': {
          '@type': 'WebPage',
          '@id': typeof window !== 'undefined' ? window.location.href : ''
        }
      }) }} />
      <h1 className="text-4xl font-bold mb-4">{post.title || ''}</h1>
      <div className="text-gray-400 mb-8">{post.date || ''}</div>
      {post.seoTitle && (
        <div className="mb-2 text-lg text-blue-600 dark:text-blue-400 font-semibold">SEO Title: {post.seoTitle}</div>
      )}
      {post.seoDescription && (
        <div className="mb-2 text-blue-700 dark:text-blue-300">SEO Description: {post.seoDescription}</div>
      )}
      {post.seoTags && post.seoTags.length > 0 && (
        <div className="mb-2">
          <span className="font-semibold">SEO Tags:</span>
          {post.seoTags.map(tag => (
            <span key={tag} className="ml-2 px-2 py-1 bg-blue-200 dark:bg-blue-800 rounded text-xs">{tag}</span>
          ))}
        </div>
      )}
      {post.imageUrl && (
        <img src={post.imageUrl} alt={post.imageAlt || post.seoTitle || post.title || ''} className="mb-8 rounded-lg w-full max-w-2xl object-cover" />
      )}
      <div className="prose dark:prose-invert max-w-2xl mb-8">{post.content || ''}</div>
      {/* Social sharing buttons */}
      <div className="mb-8 flex flex-wrap gap-4 items-center">
        <span className="font-semibold mr-2">Share:</span>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >Facebook</a>
        <a
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title || '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1 bg-blue-400 text-white rounded hover:bg-blue-500"
        >Twitter</a>
        <a
          href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(post.title || '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1 bg-blue-700 text-white rounded hover:bg-blue-800"
        >LinkedIn</a>
        <a
          href={`https://wa.me/?text=${encodeURIComponent((post.title || '') + ' ' + window.location.href)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
        >WhatsApp</a>
        <a
          href={`mailto:?subject=${encodeURIComponent(post.title || '')}&body=${encodeURIComponent(window.location.href)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
        >Email</a>
      </div>
      {post.tags && post.tags.length > 0 && (
        <div className="mb-4">
          <span className="font-semibold">Tags:</span>
          {post.tags.map(tag => (
            <span key={tag} className="ml-2 px-2 py-1 bg-gray-200 dark:bg-gray-800 rounded text-xs">{tag}</span>
          ))}
        </div>
      )}
// ...existing code...
            </div>
          </div>
        </div>
      )}
      {/* Schema.org Article JSON-LD markup for SEO */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        'headline': post?.seoTitle || post?.title || '',
        'description': post?.seoDescription || '',
        'image': post?.imageUrl ? [post.imageUrl] : [],
        'author': {
          '@type': 'Person',
          'name': 'Admin'
        },
        'datePublished': post?.date || '',
        'articleSection': post?.category || '',
        'keywords': post?.seoTags ? post.seoTags.join(', ') : '',
        'mainEntityOfPage': {
          '@type': 'WebPage',
          '@id': typeof window !== 'undefined' ? window.location.href : ''
        }
      }) }} />
      <h1 className="text-4xl font-bold mb-4">{post?.title || ''}</h1>
      <div className="text-gray-400 mb-8">{post?.date || ''}</div>
      {post?.seoTitle && (
        <div className="mb-2 text-lg text-blue-600 dark:text-blue-400 font-semibold">SEO Title: {post.seoTitle}</div>
      )}
      {post?.seoDescription && (
        <div className="mb-2 text-blue-700 dark:text-blue-300">SEO Description: {post.seoDescription}</div>
      )}
      {post?.seoTags && post.seoTags.length > 0 && (
        <div className="mb-2">
          <span className="font-semibold">SEO Tags:</span>
          {post.seoTags.map(tag => (
            <span key={tag} className="ml-2 px-2 py-1 bg-blue-200 dark:bg-blue-800 rounded text-xs">{tag}</span>
          ))}
        </div>
      )}
      {post?.imageUrl && (
        <img src={post.imageUrl} alt={post.imageAlt || post.seoTitle || post.title || ''} className="mb-8 rounded-lg w-full max-w-2xl object-cover" />
      )}
      <div className="prose dark:prose-invert max-w-2xl mb-8">{post?.content || ''}</div>
      {/* Social sharing buttons */}
      <div className="mb-8 flex flex-wrap gap-4 items-center">
        <span className="font-semibold mr-2">Share:</span>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >Facebook</a>
        <a
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post?.title || '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1 bg-blue-400 text-white rounded hover:bg-blue-500"
        >Twitter</a>
        <a
          href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(post?.title || '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1 bg-blue-700 text-white rounded hover:bg-blue-800"
        >LinkedIn</a>
        <a
          href={`https://wa.me/?text=${encodeURIComponent((post?.title || '') + ' ' + window.location.href)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
        >WhatsApp</a>
        <a
          href={`mailto:?subject=${encodeURIComponent(post?.title || '')}&body=${encodeURIComponent(window.location.href)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
        >Email</a>
      </div>
      {post?.tags && post.tags.length > 0 && (
        <div className="mb-4">
          <span className="font-semibold">Tags:</span>
          {post.tags.map(tag => (
            <span key={tag} className="ml-2 px-2 py-1 bg-gray-200 dark:bg-gray-800 rounded text-xs">{tag}</span>
          ))}
        </div>
      )}
      {post?.category && (
        <div className="mb-4 text-sm text-forest-600 dark:text-forest-400">Category: {post.category}</div>
      )}
      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Related Posts</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {related.map(rp => (
              <BlogPostCard key={rp.id} {...rp} summary={rp.seoDescription || ''} />
            ))}
          </div>
        </div>
      )}
      {/* Category */}
      {post?.category && (
        <div className="mb-4 text-sm text-forest-600 dark:text-forest-400">Category: {post.category}</div>
      )}
      {/* Related Posts */}
      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Related Posts</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {related.map(rp => (
              <BlogPostCard key={rp.id} {...rp} />
            ))}
          </div>
        </div>
      )}
      {/* Comments Section */}
      <div className="mt-16 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Comments</h2>
        {/* Display comments */}
        <div className="mb-6">
          {commentLoading ? (
            <div className="text-gray-400">Loading comments...</div>
          ) : comments.length === 0 ? (
            <div className="text-gray-400">No comments yet.</div>
          ) : (
            comments.map((c: any) => (
              <div key={c.id} className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded relative">
                <div className="font-semibold">{c.name}</div>
                <div className="text-gray-600 dark:text-gray-400 text-sm mb-1">{c.text}</div>
                <div className="text-xs text-gray-400">{new Date(c.date).toLocaleString()}</div>
                <button
                  className="absolute top-2 right-2 text-xs text-red-500 hover:underline"
                  onClick={() => handleDeleteComment(c.id)}
                  title="Delete comment"
                >Delete</button>
              </div>
            ))
          )}
        </div>
        {/* Add comment form */}
        <form onSubmit={handleCommentSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            required
            placeholder="Your name"
            className="p-3 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white"
            value={name}
            onChange={e => setName(e.target.value)}
            disabled={submitting}
          />
          <textarea
            required
            placeholder="Your comment"
            rows={3}
            className="p-3 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white"
            value={text}
            onChange={e => setText(e.target.value)}
            disabled={submitting}
          />
          <button
            type="submit"
            className="luxury-button px-6 py-2 rounded font-bold text-white bg-forest-600 dark:bg-forest-400 hover:bg-forest-700 dark:hover:bg-forest-500"
            disabled={submitting}
          >{submitting ? 'Submitting...' : 'Submit Comment'}</button>
        </form>
      </div>
    </div>
  );
// ...existing code...


