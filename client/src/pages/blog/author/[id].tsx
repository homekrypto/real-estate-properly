import React, { useEffect, useState } from 'react';
import { useParams } from 'wouter';
import { Helmet } from 'react-helmet-async';

interface Author {
  id: string;
  name: string;
  bio: string;
  avatarUrl: string;
  website?: string;
  twitter?: string;
  linkedin?: string;
  email?: string;
}

const AuthorProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [author, setAuthor] = useState<Author | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/blog/authors/${id}`)
      .then(res => res.json())
      .then(data => {
        setAuthor(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading author...</div>;
  if (!author) return <div className="p-8 text-center text-red-500">Author not found.</div>;

  return (
    <div className="max-w-2xl mx-auto p-8">
      <Helmet>
        <title>{author.name} | Author Profile</title>
        <meta name="description" content={author.bio} />
      </Helmet>
      <div className="flex flex-col items-center">
        <img src={author.avatarUrl} alt={author.name} className="w-32 h-32 rounded-full mb-4" />
        <h1 className="text-3xl font-bold mb-2">{author.name}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">{author.bio}</p>
        <div className="flex gap-4 mb-4">
          {author.website && (
            <a href={author.website} target="_blank" rel="noopener" className="text-blue-500 hover:underline">Website</a>
          )}
          {author.twitter && (
            <a href={`https://twitter.com/${author.twitter}`} target="_blank" rel="noopener" className="text-blue-500 hover:underline">Twitter</a>
          )}
          {author.linkedin && (
            <a href={`https://linkedin.com/in/${author.linkedin}`} target="_blank" rel="noopener" className="text-blue-500 hover:underline">LinkedIn</a>
          )}
          {author.email && (
            <a href={`mailto:${author.email}`} className="text-blue-500 hover:underline">Email</a>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthorProfile;
