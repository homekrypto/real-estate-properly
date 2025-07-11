import { useEffect, useState } from 'react';

interface PendingComment {
  id: string;
  name: string;
  text: string;
  date: string;
  postId: string;
}

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<PendingComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/blog/admin/comments')
      .then(res => res.json())
      .then(data => {
        setComments(data);
        setLoading(false);
      });
  }, []);

  const handleApprove = async (comment: PendingComment) => {
    setActionLoading(comment.id);
    await fetch(`/api/blog/posts/${comment.postId}/comments/${comment.id}/approve`, { method: 'POST' });
    setComments(prev => prev.filter(c => c.id !== comment.id));
    setActionLoading(null);
  };

  const handleDelete = async (comment: PendingComment) => {
    setActionLoading(comment.id);
    await fetch(`/api/blog/posts/${comment.postId}/comments/${comment.id}`, { method: 'DELETE' });
    setComments(prev => prev.filter(c => c.id !== comment.id));
    setActionLoading(null);
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">Admin: Comment Moderation</h1>
      {loading ? (
        <div className="text-gray-400">Loading pending comments...</div>
      ) : comments.length === 0 ? (
        <div className="text-green-600">No pending comments. All caught up!</div>
      ) : (
        <div className="space-y-6">
          {comments.map(comment => (
            <div key={comment.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded shadow">
              <div className="font-semibold mb-1">{comment.name}</div>
              <div className="text-gray-600 dark:text-gray-400 mb-2">{comment.text}</div>
              <div className="text-xs text-gray-400 mb-2">{new Date(comment.date).toLocaleString()}</div>
              <div className="text-xs text-blue-600 mb-2">Post ID: {comment.postId}</div>
              <div className="flex gap-4">
                <button
                  className="px-4 py-1 rounded bg-green-600 text-white font-bold hover:bg-green-700 disabled:opacity-50"
                  onClick={() => handleApprove(comment)}
                  disabled={actionLoading === comment.id}
                >Approve</button>
                <button
                  className="px-4 py-1 rounded bg-red-600 text-white font-bold hover:bg-red-700 disabled:opacity-50"
                  onClick={() => handleDelete(comment)}
                  disabled={actionLoading === comment.id}
                >Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
