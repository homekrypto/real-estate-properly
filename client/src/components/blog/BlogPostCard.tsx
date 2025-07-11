import { Link } from 'wouter';

interface BlogPostCardProps {
  id: string;
  title: string;
  summary: string;
  date: string;
  slug?: string;
  imageUrl?: string;
  imageAlt?: string;
  category?: string;
  authorId?: string;
  authorName?: string;
}

export function BlogPostCard({ id, title, summary, date, slug, imageUrl, imageAlt, category, authorId, authorName }: BlogPostCardProps) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 flex flex-col justify-between">
      {imageUrl && (
        <img src={imageUrl} alt={imageAlt || title} className="mb-4 rounded-lg w-full h-40 object-cover" />
      )}
      <div>
        <h2 className="text-2xl font-semibold mb-2">{title}</h2>
        {category && <span className="text-xs text-forest-600 dark:text-forest-400 mb-2 block">{category}</span>}
        <p className="text-gray-600 dark:text-gray-400 mb-4">{summary}</p>
        {authorId && authorName && (
          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            By{' '}
            <Link href={`/blog/author/${authorId}`} className="text-blue-600 dark:text-blue-400 hover:underline">
              {authorName}
            </Link>
          </div>
        )}
      </div>
      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-gray-400">{date}</span>
        <Link href={slug ? `/blog/${slug}` : `/blog/${id}`} className="text-forest-600 dark:text-forest-400 hover:underline text-sm font-medium">
          Read More
        </Link>
      </div>
    </div>
  );
}
