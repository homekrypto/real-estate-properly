# n8n Webhook Integration for Blog Automation

## Endpoint
`POST /api/blog/n8n/webhook`

## Example Payload
See `n8n-webhook-payload-example.json` for a sample payload.

## Supported Automation Steps
- Create blog post (required fields: title, summary, content, category, authorId)
- SEO analysis (optional: seoTitle, seoDescription)
- Image upload (optional: image)
- Scheduling (optional: publishDate, status)
- Notifications (optional: email, social)

## Usage
1. Configure n8n to send a POST request to `/api/blog/n8n/webhook` with the payload.
2. The backend will add the post and trigger further automation (SEO, notifications, etc).
3. Extend the backend to process additional fields as needed.

## Example Workflow
- Trigger: New post created in n8n
- Action: Send POST to `/api/blog/n8n/webhook`
- Action: Call external SEO API, update post
- Action: Upload image to CDN/storage
- Action: Schedule post (set publishDate/status)
- Action: Send notifications (email/social)

---
Update this document as you add more automation steps or change the payload structure.
