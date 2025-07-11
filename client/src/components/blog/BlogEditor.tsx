import { useState } from 'react';

interface BlogEditorProps {
  initialTitle?: string;
  initialContent?: string;
  initialCategory?: string;
  initialTags?: string[];
  initialSEOTitle?: string;
  initialSEODescription?: string;
  initialSEOTags?: string[];
  initialSlug?: string; 
  initialImageUrl?: string; 
  initialImageAlt?: string; 
  onSave: (data: { title: string; content: string; category: string; tags: string[]; seoTitle: string; seoDescription: string; seoTags: string[]; slug?: string; imageUrl?: string; imageAlt?: string }) => void;
}

export function BlogEditor({ initialTitle = '', initialContent = '', initialCategory = '', initialTags = [], initialSEOTitle = '', initialSEODescription = '', initialSEOTags = [], initialSlug = '', initialImageUrl = '', initialImageAlt = '', onSave }: BlogEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [category, setCategory] = useState(initialCategory);
  const [tags, setTags] = useState(initialTags ? initialTags.join(', ') : '');
  const [seoTitle, setSEOTitle] = useState(initialSEOTitle);
  const [seoDescription, setSEODescription] = useState(initialSEODescription);
  const [seoTags, setSEOTags] = useState(initialSEOTags ? initialSEOTags.join(', ') : '');
  const [slug, setSlug] = useState(initialSlug);
  const [imageUrl, setImageUrl] = useState(initialImageUrl);
  const [imageAlt, setImageAlt] = useState(initialImageAlt);
  // ...existing code...

  function handleSave() {
    onSave({
      title,
      content,
      category,
      tags: tags.split(',').map(t => t.trim()),
      seoTitle,
      seoDescription,
      seoTags: seoTags.split(',').map(t => t.trim()),
      slug,
      imageUrl,
      imageAlt,
    });
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Title"
        className="w-full mb-4 p-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-black dark:text-white"
      />
      <input
        type="text"
        value={slug}
        onChange={e => setSlug(e.target.value)}
        placeholder="Slug (clean URL, e.g. how-to-buy-property-2025)"
        className="w-full mb-4 p-2 rounded border border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-800 text-black dark:text-white"
      />
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Content"
        rows={8}
        className="w-full mb-4 p-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-black dark:text-white"
      />
      <input
        type="text"
        value={imageUrl}
        onChange={e => setImageUrl(e.target.value)}
        placeholder="Image URL"
        className="w-full mb-4 p-2 rounded border border-yellow-300 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-800 text-black dark:text-white"
      />
      <input
        type="text"
        value={imageAlt}
        onChange={e => setImageAlt(e.target.value)}
        placeholder="Image Alt Text (for accessibility/SEO)"
        className="w-full mb-4 p-2 rounded border border-yellow-300 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-800 text-black dark:text-white"
      />
      <input
        type="text"
        value={category}
        onChange={e => setCategory(e.target.value)}
        placeholder="Category"
        className="w-full mb-4 p-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-black dark:text-white"
      />
      <input
        type="text"
        value={tags}
        onChange={e => setTags(e.target.value)}
        placeholder="Tags (comma separated)"
        className="w-full mb-4 p-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-black dark:text-white"
      />
      <input
        type="text"
        value={seoTitle}
        onChange={e => setSEOTitle(e.target.value)}
        placeholder="SEO Title"
        className="w-full mb-4 p-2 rounded border border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-800 text-black dark:text-white"
      />
      <textarea
        value={seoDescription}
        onChange={e => setSEODescription(e.target.value)}
        placeholder="SEO Description"
        rows={3}
        className="w-full mb-4 p-2 rounded border border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-800 text-black dark:text-white"
      />
      <input
        type="text"
        value={seoTags}
        onChange={e => setSEOTags(e.target.value)}
        placeholder="SEO Tags (comma separated)"
        className="w-full mb-4 p-2 rounded border border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-800 text-black dark:text-white"
      />
      <button
        onClick={handleSave}
        className="luxury-button px-6 py-2 rounded font-bold text-white bg-forest-600 dark:bg-forest-400 hover:bg-forest-700 dark:hover:bg-forest-500"
      >
        Save
      </button>
    </div>
  );
}
