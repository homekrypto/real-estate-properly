import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
// import { setupAuth, isAuthenticated } from "./replitAuth"; // Disabled Replit Auth
import { insertSavedPropertySchema, insertMessageSchema } from "@shared/schema";
import blogRouter from './routes/blog';

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware disabled - using custom auth instead
  // await setupAuth(app);

  // Auth routes - Custom auth system
  app.get('/api/auth/user', async (req: any, res) => {
    try {
      // TODO: Replace with real session/token logic
      // For now, get agent1 and override status/subscription for testing
      let user = await storage.getUser('agent1');
      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }
      user.status = 'verified';
      user.subscriptionStatus = 'active';
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Registration route
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = req.body;
      console.log(`[DEBUG] Attempting to create user:`, userData);
      // Validate required fields
      if (!userData.firstName || !userData.lastName || !userData.email || !userData.password) {
        console.error(`[ERROR] Missing required fields:`, userData);
        return res.status(400).json({ error: "Missing required fields" });
      }
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        console.error(`[ERROR] User with this email already exists:`, userData.email);
        return res.status(400).json({ error: "User with this email already exists" });
      }
      // Create user in database
      try {
        const user = await storage.upsertUser({
          id: `user_${Date.now()}`,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: userData.role || "seeker",
          status: "unverified",
          agencyName: userData.agencyName,
          phone: userData.phone,
          profileImageUrl: null
        });
        console.log(`[SUCCESS] User '${userData.email}' created in database. Role: '${user.role}', Status: '${user.status}'.`);
        // Generate verification token
        const verificationToken = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        await storage.createVerificationToken({
          token: verificationToken,
          userId: user.id,
          type: "email_verification",
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
        });
        console.log(`[INFO] Verification email simulation triggered for ${userData.email}`);
        res.json({ 
          success: true, 
          user,
          message: "Registration successful. Please check your email to verify your account.",
          verificationToken // For testing purposes
        });
      } catch (dbError) {
        const message = dbError instanceof Error ? dbError.message : String(dbError);
        console.error(`[ERROR] Database error during user creation:`, dbError);
        res.status(500).json({ error: "Database error during user creation", details: message });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error("Registration error:", error);
      res.status(500).json({ error: "Registration failed", details: message });
    }
  });

  // Email verification route
  app.get("/api/auth/verify-email/:token", async (req, res) => {
    try {
      const { token } = req.params;
      
      console.log(`[DEBUG] Verification token received. Looking up user.`);
      
      if (!token) {
        return res.status(400).json({ error: "Verification token required" });
      }
      
      // Get verification token from database
      const verificationRecord = await storage.getVerificationToken(token);
      if (!verificationRecord) {
        return res.status(400).json({ error: "Invalid verification token" });
      }
      
      // Check if token has expired
      if (new Date() > verificationRecord.expiresAt) {
        return res.status(400).json({ error: "Verification token has expired" });
      }
      
      // Update user status to verified
      const user = await storage.updateUserStatus(verificationRecord.userId, "verified");
      
      console.log(`[SUCCESS] User '${user.email}' status updated to 'verified'.`);
      
      // Mark token as used
      await storage.markTokenAsUsed(token);
      
      res.json({ 
        success: true, 
        message: "Account verified. You may now log in.",
        user 
      });
    } catch (error) {
      console.error("Email verification error:", error);
      res.status(500).json({ error: "Email verification failed" });
    }
  });

  // Resend verification email route
  app.post("/api/auth/resend-verification", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: "Email required" });
      }
      
      // For now, simulate successful resend
      res.json({ success: true, message: "Verification email sent" });
    } catch (error) {
      console.error("Resend verification error:", error);
      res.status(500).json({ error: "Failed to resend verification email" });
    }
  });

  // Forgot password route
  app.post("/api/auth/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: "Email required" });
      }
      // Simulate token generation and email sending
      const resetToken = `reset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await storage.createVerificationToken({
        token: resetToken,
        userId: email,
        type: "password_reset",
        expiresAt: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
      });
      console.log(`[INFO] Password reset email simulation triggered for ${email}.`);
      res.json({ success: true, message: "Password reset email sent", resetToken });
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({ error: "Failed to send password reset email" });
    }
  });

  // Reset password route
  app.post("/api/auth/reset-password", async (req, res) => {
    try {
      const { token, newPassword } = req.body;
      if (!token || !newPassword) {
        return res.status(400).json({ error: "Token and new password required" });
      }
      // Simulate token lookup and password update
      const verificationRecord = await storage.getVerificationToken(token);
      if (!verificationRecord || verificationRecord.type !== "password_reset") {
        return res.status(400).json({ error: "Invalid or expired token" });
      }
      // Simulate password update
      await storage.updateUserPassword(verificationRecord.userId, newPassword);
      await storage.markTokenAsUsed(token);
      console.log(`[SUCCESS] Password updated for user '${verificationRecord.userId}'.`);
      res.json({ success: true, message: "Password updated successfully" });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({ error: "Failed to reset password" });
    }
  });

  // Get subscription plans
  app.get("/api/subscription-plans", async (req, res) => {
    try {
      const plans = [
        {
          id: "bronze",
          name: "Bronze",
          description: "Perfect for independent agents",
          monthlyPrice: 40,
          annualPrice: 432,
          propertyLimit: 10,
          features: [
            "Up to 10 listings",
            "Global audience in 35 countries",
            "80+ additional portals",
            "Basic analytics",
            "Email support"
          ]
        },
        {
          id: "silver",
          name: "Silver",
          description: "For growing agencies",
          monthlyPrice: 60,
          annualPrice: 648,
          propertyLimit: 25,
          features: [
            "Up to 25 listings",
            "Global audience in 35 countries",
            "80+ additional portals",
            "Advanced CRM integration",
            "Advanced analytics & reporting",
            "Priority support"
          ]
        },
        {
          id: "gold",
          name: "Gold",
          description: "For established agencies",
          monthlyPrice: 80,
          annualPrice: 864,
          propertyLimit: 35,
          features: [
            "Up to 35 listings",
            "Global audience in 35 countries",
            "80+ additional portals",
            "Full CRM integration",
            "Complete analytics suite",
            "Dedicated account manager",
            "Premium luxury portals",
            "Advanced AI tools"
          ]
        }
      ];
      res.json(plans);
    } catch (error) {
      console.error("Error fetching subscription plans:", error);
      res.status(500).json({ message: "Failed to fetch subscription plans" });
    }
  });

  // Create Stripe checkout session (placeholder)
  app.post("/api/stripe/create-checkout", async (req, res) => {
    try {
      const { planId, billingPeriod } = req.body;
      
      // For now, simulate Stripe checkout creation
      // In a real app, you'd create an actual Stripe checkout session
      res.json({ 
        success: true, 
        checkoutUrl: `https://checkout.stripe.com/mock/${planId}/${billingPeriod}`,
        message: "Checkout session created (demo mode)"
      });
    } catch (error) {
      console.error("Stripe checkout error:", error);
      res.status(500).json({ error: "Failed to create checkout session" });
    }
  });

  // Redirect GET /api/login to inform about correct endpoint
  app.get("/api/login", (req, res) => {
    res.status(404).json({ 
      error: "Method not allowed. Use POST /api/auth/login for authentication" 
    });
  });

  // Login route
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }
      
      // Get user from database
      const user = await storage.getUserByEmail(email);
      console.log('[DEBUG] User object from DB:', user);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      // Check if user is verified
      if (user.status !== "verified") {
        return res.status(401).json({ error: "Please verify your email before logging in" });
      }
      
      // In a real app, you'd verify the password hash here
      // For now, we'll simulate password verification
      
      console.log(`[SUCCESS] Authentication successful for '${email}'. Session initiated.`);
      
      // Check if agent needs to be redirected to pricing
      let redirectUrl = "/";
      if (user.role === "agent") {
        // Check if agent has active subscription
        // Drizzle ORM returns camelCase: subscriptionStatus
        const hasActiveSubscription = user.subscriptionStatus === "active";
        if (!hasActiveSubscription) {
          console.log(`[INFO] Agent '${email}' has no active subscription. Forcing redirect to /pricing.`);
          redirectUrl = "/pricing";
        } else {
          redirectUrl = "/dashboard/agent";
        }
      }
      
      res.json({ 
        success: true, 
        user,
        redirectUrl
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  // --- API for frontend data ---
  app.get('/api/countries', async (req, res) => {
    try {
      const countries = await storage.getCountries();
      res.json(countries);
    } catch (error) {
      console.error('Error fetching countries:', error);
      res.status(500).json({ error: 'Failed to fetch countries' });
    }
  });

  app.get('/api/properties/featured', async (req, res) => {
    try {
      const properties = await storage.getFeaturedProperties();
      res.json(properties);
    } catch (error) {
      console.error('Error fetching featured properties:', error);
      res.status(500).json({ error: 'Failed to fetch featured properties' });
    }
  });

  // Blog API routes
  app.use('/api/blog', blogRouter);

  // Countries
  app.get("/api/countries", async (req, res) => {
    try {
      const countries = await storage.getCountries();
      res.json(countries);
    } catch (error) {
      console.error("Error fetching countries:", error);
      res.status(500).json({ message: "Failed to fetch countries" });
    }
  });

  app.get("/api/countries/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const country = await storage.getCountry(id);
      if (!country) {
        return res.status(404).json({ message: "Country not found" });
      }
      res.json(country);
    } catch (error) {
      console.error("Error fetching country:", error);
      res.status(500).json({ message: "Failed to fetch country" });
    }
  });

  // Regions
  app.get("/api/regions/:countryId", async (req, res) => {
    try {
      const countryId = parseInt(req.params.countryId);
      const regions = await storage.getRegionsByCountry(countryId);
      res.json(regions);
    } catch (error) {
      console.error("Error fetching regions:", error);
      res.status(500).json({ message: "Failed to fetch regions" });
    }
  });

  // Cities
  app.get("/api/cities/:regionId", async (req, res) => {
    try {
      const regionId = parseInt(req.params.regionId);
      const cities = await storage.getCitiesByRegion(regionId);
      res.json(cities);
    } catch (error) {
      console.error("Error fetching cities:", error);
      res.status(500).json({ message: "Failed to fetch cities" });
    }
  });

  // Properties
  app.get("/api/properties", async (req, res) => {
    try {
      const properties = await storage.getProperties(req.query);
      res.json(properties);
    } catch (error) {
      console.error("Error fetching properties:", error);
      res.status(500).json({ message: "Failed to fetch properties" });
    }
  });

  app.get("/api/properties/featured", async (req, res) => {
    try {
      const properties = await storage.getFeaturedProperties();
      res.json(properties);
    } catch (error) {
      console.error("Error fetching featured properties:", error);
      res.status(500).json({ message: "Failed to fetch featured properties" });
    }
  });

  app.get("/api/properties/search", async (req, res) => {
    try {
      const properties = await storage.searchProperties(req.query);
      res.json(properties);
    } catch (error) {
      console.error("Error searching properties:", error);
      res.status(500).json({ message: "Failed to search properties" });
    }
  });

  app.get("/api/properties/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const property = await storage.getProperty(id);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      // Increment view count
      await storage.incrementViewCount(id);
      
      res.json(property);
    } catch (error) {
      console.error("Error fetching property:", error);
      res.status(500).json({ message: "Failed to fetch property" });
    }
  });

  // Saved Properties
  app.get("/api/saved-properties", async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const savedProperties = await storage.getSavedProperties(userId);
      res.json(savedProperties);
    } catch (error) {
      console.error("Error fetching saved properties:", error);
      res.status(500).json({ message: "Failed to fetch saved properties" });
    }
  });

  app.post("/api/saved-properties", async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { propertyId } = req.body;
      
      const savedProperty = await storage.saveProperty({
        userId,
        propertyId: parseInt(propertyId),
      });
      
      res.json(savedProperty);
    } catch (error) {
      console.error("Error saving property:", error);
      res.status(500).json({ message: "Failed to save property" });
    }
  });

  app.delete("/api/saved-properties/:propertyId", async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const propertyId = parseInt(req.params.propertyId);
      
      await storage.unsaveProperty(userId, propertyId);
      res.json({ message: "Property unsaved successfully" });
    } catch (error) {
      console.error("Error unsaving property:", error);
      res.status(500).json({ message: "Failed to unsave property" });
    }
  });

  // Messages
  app.get("/api/messages", async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const messages = await storage.getMessages(userId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.post("/api/messages", async (req: any, res) => {
    try {
      const fromUserId = req.user.claims.sub;
      const messageData = insertMessageSchema.parse({
        ...req.body,
        fromUserId,
      });
      
      const message = await storage.createMessage(messageData);
      res.json(message);
    } catch (error) {
      console.error("Error creating message:", error);
      res.status(500).json({ message: "Failed to create message" });
    }
  });

  app.patch("/api/messages/:id/read", async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.markMessageAsRead(id);
      res.json({ message: "Message marked as read" });
    } catch (error) {
      console.error("Error marking message as read:", error);
      res.status(500).json({ message: "Failed to mark message as read" });
    }
  });

  // Blog Posts
  app.get("/api/blog", async (req, res) => {
    try {
      const posts = await storage.getBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog/:slug", async (req, res) => {
    try {
      const post = await storage.getBlogPost(req.params.slug);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
