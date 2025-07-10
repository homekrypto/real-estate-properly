import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  decimal,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").notNull().default("seeker"), // seeker, agent, developer, admin
  company: varchar("company"),
  phone: varchar("phone"),
  language: varchar("language").default("en"),
  theme: varchar("theme").default("light"),
  // Authentication fields
  status: varchar("status").default("unverified"), // unverified, verified, suspended
  verificationToken: varchar("verification_token"),
  passwordResetToken: varchar("password_reset_token"),
  passwordResetExpires: timestamp("password_reset_expires"),
  // Agent-specific fields
  agencyName: varchar("agency_name"),
  // Subscription fields
  subscriptionStatus: varchar("subscription_status").default("none"), // none, active, cancelled, past_due
  subscriptionTier: varchar("subscription_tier"), // bronze, silver, gold
  subscriptionId: varchar("subscription_id"),
  customerId: varchar("customer_id"),
  currentPeriodEnd: timestamp("current_period_end"),
  propertyLimit: integer("property_limit").default(0),
  activeProperties: integer("active_properties").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const countries = pgTable("countries", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  code: varchar("code", { length: 2 }).notNull().unique(),
  flag: varchar("flag").notNull(),
  currency: varchar("currency").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const regions = pgTable("regions", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  countryId: integer("country_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const cities = pgTable("cities", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  regionId: integer("region_id").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 7 }),
  longitude: decimal("longitude", { precision: 10, scale: 7 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  currency: varchar("currency").default("USD").notNull(),
  propertyType: varchar("property_type").notNull(), // villa, apartment, penthouse, farmhouse, townhouse
  listingType: varchar("listing_type").notNull(), // sale, rent
  bedrooms: integer("bedrooms").notNull(),
  bathrooms: integer("bathrooms").notNull(),
  squareMeters: integer("square_meters").notNull(),
  plotArea: integer("plot_area"),
  yearBuilt: integer("year_built"),
  floor: integer("floor"),
  totalFloors: integer("total_floors"),
  address: varchar("address").notNull(),
  cityId: integer("city_id").notNull(),
  region: varchar("region").notNull(),
  city: varchar("city").notNull(),
  countryId: integer("country_id").notNull(),
  agentId: varchar("agent_id").notNull(),
  images: text("images").array().notNull(),
  features: text("features").array(),
  amenities: text("amenities").array(),
  status: varchar("status").default("draft"), // draft, active, sold, rented, inactive
  isActive: boolean("is_active").default(true),
  isFeatured: boolean("is_featured").default(false),
  viewCount: integer("view_count").default(0),
  contactCount: integer("contact_count").default(0),
  seoSlug: varchar("seo_slug").unique(),
  metaTitle: varchar("meta_title"),
  metaDescription: text("meta_description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const savedProperties = pgTable("saved_properties", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  propertyId: integer("property_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Email verification tokens
export const verificationTokens = pgTable("verification_tokens", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  token: varchar("token").notNull().unique(),
  type: varchar("type").notNull(), // email_verification, password_reset
  expiresAt: timestamp("expires_at").notNull(),
  used: boolean("used").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Subscription plans
export const subscriptionPlans = pgTable("subscription_plans", {
  id: varchar("id").primaryKey(), // bronze, silver, gold
  name: varchar("name").notNull(),
  description: text("description"),
  monthlyPrice: decimal("monthly_price", { precision: 10, scale: 2 }).notNull(),
  annualPrice: decimal("annual_price", { precision: 10, scale: 2 }).notNull(),
  propertyLimit: integer("property_limit").notNull(),
  features: text("features").array().notNull(),
  stripePriceIdMonthly: varchar("stripe_price_id_monthly"),
  stripePriceIdAnnual: varchar("stripe_price_id_annual"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Property inquiries/leads
export const propertyInquiries = pgTable("property_inquiries", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").notNull(),
  agentId: varchar("agent_id").notNull(),
  seekerName: varchar("seeker_name").notNull(),
  seekerEmail: varchar("seeker_email").notNull(),
  seekerPhone: varchar("seeker_phone"),
  message: text("message"),
  status: varchar("status").default("new"), // new, contacted, qualified, closed
  source: varchar("source").default("website"), // website, email, phone
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  fromUserId: varchar("from_user_id").notNull(),
  toUserId: varchar("to_user_id").notNull(),
  propertyId: integer("property_id"),
  subject: varchar("subject").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  slug: varchar("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  category: varchar("category").notNull(),
  authorId: varchar("author_id").notNull(),
  featuredImage: varchar("featured_image").notNull(),
  isPublished: boolean("is_published").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type Country = typeof countries.$inferSelect;
export type InsertCountry = typeof countries.$inferInsert;

export type Region = typeof regions.$inferSelect;
export type InsertRegion = typeof regions.$inferInsert;

export type City = typeof cities.$inferSelect;
export type InsertCity = typeof cities.$inferInsert;

export type Property = typeof properties.$inferSelect;
export type InsertProperty = typeof properties.$inferInsert;

export type SavedProperty = typeof savedProperties.$inferSelect;
export type InsertSavedProperty = typeof savedProperties.$inferInsert;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;

export const insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  viewCount: true,
});

export const insertSavedPropertySchema = createInsertSchema(savedProperties).omit({
  id: true,
  createdAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
  isRead: true,
});

// Additional type definitions for new tables
export type VerificationToken = typeof verificationTokens.$inferSelect;
export type InsertVerificationToken = typeof verificationTokens.$inferInsert;

export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;
export type InsertSubscriptionPlan = typeof subscriptionPlans.$inferInsert;

export type PropertyInquiry = typeof propertyInquiries.$inferSelect;
export type InsertPropertyInquiry = typeof propertyInquiries.$inferInsert;

// Additional validation schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertVerificationTokenSchema = createInsertSchema(verificationTokens).omit({
  id: true,
  createdAt: true,
});

export const insertPropertyInquirySchema = createInsertSchema(propertyInquiries).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
