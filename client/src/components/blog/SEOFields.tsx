import { useState } from 'react';

interface SEOFieldsProps {
  initialTitle?: string;
  initialDescription?: string;
  initialTags?: string[];
  onChange: (data: { title: string; description: string; tags: string[] }) => void;
}

export function SEOFields({ initialTitle = '', initialDescription = '', initialTags = [], onChange }: SEOFieldsProps) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [tags, setTags] = useState(initialTags.join(', '));

  function handleChange() {
    onChange({ title, description, tags: tags.split(',').map(t => t.trim()) });
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 mb-4">
      <input
        type="text"
        value={title}
        onChange={e => { setTitle(e.target.value); handleChange(); }}
        placeholder="SEO Title"
        className="w-full mb-4 p-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-black dark:text-white"
      />
      <textarea
        value={description}
        onChange={e => { setDescription(e.target.value); handleChange(); }}
        placeholder="SEO Description"
        rows={3}
        className="w-full mb-4 p-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-black dark:text-white"
      />
      <input
        type="text"
        value={tags}
        onChange={e => { setTags(e.target.value); handleChange(); }}
        placeholder="SEO Tags (comma separated)"
        className="w-full mb-4 p-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-black dark:text-white"
      />
    </div>
  );
}
