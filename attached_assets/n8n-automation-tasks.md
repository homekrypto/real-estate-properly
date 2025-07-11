# n8n Automation Tasks for Blog

## 1. Blog Post Creation
- Trigger: Webhook (POST /api/blog/n8n/webhook)
- Action: Insert post into DB (payload as in n8n-webhook-payload-example.json)

## 2. SEO Optimization
- Action: Call external SEO API with post content
- Action: Update post with SEO fields (seoTitle, seoDescription)

## 3. Image Upload
- Action: Upload image to CDN/storage
- Action: Update post with image URL

## 4. Scheduling/Publishing
- Action: Set publishDate and status (draft/scheduled/published)
- Action: Use n8n Cron node for scheduled publishing

## 5. Notifications
- Action: Send email to subscribers
- Action: Share post on social media (Twitter, Facebook, LinkedIn)

## 6. Weekly Digest
- Action: Aggregate posts from last 7 days
- Action: Send digest email to subscribers

---
Update this file as you add more automation steps or change workflow logic.
