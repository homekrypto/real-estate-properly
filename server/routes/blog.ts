// ...existing code...


// ...existing code...




import express, { Request, Response } from 'express';
import { storage } from '../storage';
const router = express.Router();

// TEMP: Seed agents with active subscriptions for testing
router.post('/seed-agents', async (req: Request, res: Response) => {
  try {
    const agents = [
      {
        id: 'agent1',
        name: 'Agent One',
        email: 'agent1@example.com',
        role: 'agent',
        subscriptionStatus: 'active',
        subscriptionTier: 'gold',
        password: 'test1234',
        status: 'verified',
      },
      {
        id: 'agent2',
        name: 'Agent Two',
        email: 'agent2@example.com',
        role: 'agent',
        subscriptionStatus: 'active',
        subscriptionTier: 'silver',
        password: 'test1234',
      },
    ];
    const results = [];
    for (const agent of agents) {
      // Upsert agent (create if not exists)
      const existing = await storage.getUser(agent.id);
      if (!existing) {
        await storage.upsertUser(agent);
        results.push({ id: agent.id, status: 'created' });
      } else {
        results.push({ id: agent.id, status: 'already exists' });
      }
    }
    res.json({ success: true, results });
  } catch (error) {
    res.status(500).json({ error: 'Failed to seed agents' });
  }
});

// Create blog post (agent must have active subscription)
router.post('/posts', async (req: Request, res: Response) => {
  try {
    // Example: agentId should be sent in req.body or from session
    const { authorId } = req.body;
    if (!authorId) {
      return res.status(400).json({ error: 'Missing authorId (agent)' });
    }
    // Fetch agent user and check subscription
    const agent = await storage.getUser(authorId);
    if (!agent || agent.role !== 'agent') {
      return res.status(403).json({ error: 'Only agents can create posts' });
    }
    if (!agent.subscriptionTier) {
      return res.status(403).json({ error: 'Agent does not have a subscription plan' });
    }
    // Ensure 'featured' is boolean and present
    const slugify = (str: string) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const postData = {
      ...req.body,
      slug: req.body.slug || (req.body.title ? slugify(req.body.title) : undefined),
      excerpt: req.body.excerpt || (req.body.content ? req.body.content.slice(0, 80) : ''),
      featuredImage: req.body.featuredImage || 'https://via.placeholder.com/600x400.png?text=Blog+Image',
      featured: req.body.featured === true || req.body.featured === 'true' ? true : false,
    };
    // Validate required fields
    const required = ['title', 'slug', 'excerpt', 'content', 'category', 'authorId', 'featuredImage'];
    for (const field of required) {
      if (!postData[field]) {
        return res.status(400).json({ error: `Missing required field: ${field}` });
      }
    }
    const post = await storage.createBlogPost(postData);
    res.json({ success: true, post });
  } catch (error) {
    console.error('[BLOG POST ERROR]', error);
    res.status(500).json({ error: 'Failed to create post', details: JSON.stringify(error) });
  }
});



// Get paginated posts, support featured filter
router.get('/posts', async (req: Request, res: Response) => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 9;
    const start = (page - 1) * limit;
    let posts = await storage.getBlogPosts();
    // Fix: Use isPublished and featured logic
    if (req.query.featured === 'true') {
      posts = posts.filter((p: any) => {
        const isFeatured = p.featured === true || p.featured === 'true' || p.featured === 1 || p.featured === '1';
        return p.isPublished === true && isFeatured;
      });
    }
    res.json({ posts: posts.slice(start, start + limit) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Get single post by ID
router.get('/posts/:id', async (req: Request, res: Response) => {
  try {
    // Try to get by numeric ID first
    let post = undefined;
    if (/^\d+$/.test(req.params.id)) {
      const posts = await storage.getBlogPosts();
      post = posts.find((p: any) => p.id === Number(req.params.id));
    }
    // If not found, try by slug
    if (!post) {
      post = await storage.getBlogPost(req.params.id);
    }
    if (!post) return res.status(404).json({ error: 'Not found' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

// Get categories

// Get all categories (extract from posts)
router.get('/categories', async (req: Request, res: Response) => {
  try {
    const posts = await storage.getBlogPosts();
    const categories = Array.from(new Set(posts.map((p: any) => p.category)));
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get posts by category, support featured filter

// Get posts by category (filter from all posts)
router.get('/category/:id', async (req: Request, res: Response) => {
  try {
    let posts = await storage.getBlogPosts();
    posts = posts.filter((p: any) => p.category === req.params.id);
    // Fix: Use isPublished and featured logic
    if (req.query.featured === 'true') {
      posts = posts.filter((p: any) => p.isPublished === true && (p.featured === true || p.featured === 'true'));
    }
    res.json({ posts });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch category posts' });
  }
});

export default router;
