import {
  users,
  countries,
  regions,
  cities,
  properties,
  savedProperties,
  messages,
  blogPosts,
  verificationTokens,
  subscriptionPlans,
  propertyInquiries,
  type User,
  type UpsertUser,
  type Country,
  type InsertCountry,
  type Region,
  type InsertRegion,
  type City,
  type InsertCity,
  type Property,
  type InsertProperty,
  type SavedProperty,
  type InsertSavedProperty,
  type Message,
  type InsertMessage,
  type BlogPost,
  type InsertBlogPost,
  type VerificationToken,
  type InsertVerificationToken,
  type SubscriptionPlan,
  type PropertyInquiry,
  type InsertPropertyInquiry,
} from "@shared/schema";
import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
const { Pool } = pkg;
import * as schema from '@shared/schema';
import { eq, and } from 'drizzle-orm';

// Interface for storage operations
export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getUserByEmail(email: string): Promise<User | undefined>;
  updateUserStatus(id: string, status: string): Promise<User>;
  updateUserSubscription(id: string, subscription: {
    status: string;
    tier?: string;
    subscriptionId?: string;
    customerId?: string;
    currentPeriodEnd?: Date;
  }): Promise<User>;
  
  // Verification token operations
  createVerificationToken(data: InsertVerificationToken): Promise<VerificationToken>;
  getVerificationToken(token: string): Promise<VerificationToken | undefined>;
  markTokenAsUsed(token: string): Promise<void>;
  
  // Subscription operations
  getSubscriptionPlans(): Promise<SubscriptionPlan[]>;
  getSubscriptionPlan(id: string): Promise<SubscriptionPlan | undefined>;
  
  // Property inquiry operations
  createPropertyInquiry(data: InsertPropertyInquiry): Promise<PropertyInquiry>;
  getPropertyInquiries(agentId: string): Promise<PropertyInquiry[]>;
  updateInquiryStatus(id: number, status: string): Promise<void>;
  
  // Country operations
  getCountries(): Promise<Country[]>;
  getCountry(id: number): Promise<Country | undefined>;
  
  // Region operations
  getRegionsByCountry(countryId: number): Promise<Region[]>;
  
  // City operations
  getCitiesByRegion(regionId: number): Promise<City[]>;
  
  // Property operations
  getProperties(filters?: any): Promise<Property[]>;
  getProperty(id: number): Promise<Property | undefined>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: number, property: Partial<InsertProperty>): Promise<Property>;
  getFeaturedProperties(): Promise<Property[]>;
  searchProperties(query: any): Promise<Property[]>;
  incrementViewCount(id: number): Promise<void>;
  
  // Saved properties
  getSavedProperties(userId: string): Promise<SavedProperty[]>;
  saveProperty(data: InsertSavedProperty): Promise<SavedProperty>;
  unsaveProperty(userId: string, propertyId: number): Promise<void>;
  
  // Messages
  getMessages(userId: string): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(id: number): Promise<void>;
  
  // Blog posts
  getBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(slug: string): Promise<BlogPost | undefined>;
}

class PgStorage implements IStorage {
  private db;
  constructor() {
    console.log('[DEBUG] PgStorage: Initializing database connection...');
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    this.db = drizzle(pool, { schema });
    console.log('[DEBUG] PgStorage: Database connection initialized.');
  }
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return await this.db.query.users.findFirst({ where: eq(users.id, id) }) ?? undefined;
  }
  async upsertUser(userData: UpsertUser): Promise<User> {
    const existing = await this.getUser(userData.id);
    if (existing) {
      await this.db.update(users).set({ ...userData, updatedAt: new Date() }).where(eq(users.id, userData.id));
      return (await this.getUser(userData.id))!;
    } else {
      await this.db.insert(users).values({ ...userData, createdAt: new Date(), updatedAt: new Date() });
      return (await this.getUser(userData.id))!;
    }
  }
  async getUserByEmail(email: string): Promise<User | undefined> {
    return await this.db.query.users.findFirst({ where: eq(users.email, email) }) ?? undefined;
  }
  async updateUserStatus(id: string, status: string): Promise<User> {
    await this.db.update(users).set({ status, updatedAt: new Date() }).where(eq(users.id, id));
    return (await this.getUser(id))!;
  }
  async updateUserSubscription(id: string, subscription: {
    status: string;
    tier?: string;
    subscriptionId?: string;
    customerId?: string;
    currentPeriodEnd?: Date;
  }): Promise<User> {
    await this.db.update(users).set({
      subscriptionStatus: subscription.status,
      subscriptionTier: subscription.tier,
      subscriptionId: subscription.subscriptionId,
      customerId: subscription.customerId,
      currentPeriodEnd: subscription.currentPeriodEnd,
      updatedAt: new Date(),
    }).where(eq(users.id, id));
    return (await this.getUser(id))!;
  }

  // Verification token operations
  async createVerificationToken(data: InsertVerificationToken): Promise<VerificationToken> {
    await this.db.insert(verificationTokens).values({ ...data });
    return (await this.getVerificationToken(data.token))!;
  }
  async getVerificationToken(token: string): Promise<VerificationToken | undefined> {
    return await this.db.query.verificationTokens.findFirst({ where: eq(verificationTokens.token, token) }) ?? undefined;
  }
  async markTokenAsUsed(token: string): Promise<void> {
    await this.db.update(verificationTokens).set({ used: true }).where(eq(verificationTokens.token, token));
  }

  // Subscription operations
  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    return await this.db.select().from(subscriptionPlans);
  }
  async getSubscriptionPlan(id: string): Promise<SubscriptionPlan | undefined> {
    return await this.db.query.subscriptionPlans.findFirst({ where: eq(subscriptionPlans.id, id) }) ?? undefined;
  }
  // Property inquiry operations
  async createPropertyInquiry(data: InsertPropertyInquiry): Promise<PropertyInquiry> {
    await this.db.insert(propertyInquiries).values({ ...data });
    // Assuming id is auto-incremented and returned
    const [last] = await this.db.select().from(propertyInquiries).orderBy(propertyInquiries.id.desc()).limit(1);
    return last;
  }
  async getPropertyInquiries(agentId: string): Promise<PropertyInquiry[]> {
    return await this.db.select().from(propertyInquiries).where(eq(propertyInquiries.agentId, agentId));
  }
  async updateInquiryStatus(id: number, status: string): Promise<void> {
    await this.db.update(propertyInquiries).set({ status }).where(eq(propertyInquiries.id, id));
  }
  // Country operations
  async getCountries(): Promise<Country[]> {
    return await this.db.select().from(countries);
  }
  async getCountry(id: number): Promise<Country | undefined> {
    return await this.db.query.countries.findFirst({ where: eq(countries.id, id) }) ?? undefined;
  }
  // Region operations
  async getRegionsByCountry(countryId: number): Promise<Region[]> {
    return await this.db.select().from(regions).where(eq(regions.countryId, countryId));
  }
  // City operations
  async getCitiesByRegion(regionId: number): Promise<City[]> {
    return await this.db.select().from(cities).where(eq(cities.regionId, regionId));
  }
  // Property operations
  async getProperties(filters?: any): Promise<Property[]> {
    // For now, return all properties. Add filter logic as needed.
    return await this.db.select().from(properties);
  }
  async getProperty(id: number): Promise<Property | undefined> {
    return await this.db.query.properties.findFirst({ where: eq(properties.id, id) }) ?? undefined;
  }
  async createProperty(property: InsertProperty): Promise<Property> {
    await this.db.insert(properties).values({ ...property });
    const [last] = await this.db.select().from(properties).orderBy(properties.id.desc()).limit(1);
    return last;
  }
  async updateProperty(id: number, property: Partial<InsertProperty>): Promise<Property> {
    await this.db.update(properties).set({ ...property }).where(eq(properties.id, id));
    return (await this.getProperty(id))!;
  }
  async getFeaturedProperties(): Promise<Property[]> {
    // Example: return properties with a featured flag (add logic as needed)
    return await this.db.select().from(properties); // Add .where if you have a featured column
  }
  async searchProperties(query: any): Promise<Property[]> {
    // Implement search logic as needed
    return await this.db.select().from(properties);
  }
  async incrementViewCount(id: number): Promise<void> {
    // Increment view count by 1
    const prop = await this.getProperty(id);
    if (prop) {
      await this.db.update(properties).set({ viewCount: (prop.viewCount || 0) + 1 }).where(eq(properties.id, id));
    }
  }
  // Saved properties
  async getSavedProperties(userId: string): Promise<SavedProperty[]> {
    return await this.db.select().from(savedProperties).where(eq(savedProperties.userId, userId));
  }
  async saveProperty(data: InsertSavedProperty): Promise<SavedProperty> {
    await this.db.insert(savedProperties).values({ ...data });
    const [last] = await this.db.select().from(savedProperties).orderBy(savedProperties.id.desc()).limit(1);
    return last;
  }
  async unsaveProperty(userId: string, propertyId: number): Promise<void> {
    await this.db.delete(savedProperties).where(and(eq(savedProperties.userId, userId), eq(savedProperties.propertyId, propertyId)));
  }
  // Messages
  async getMessages(userId: string): Promise<Message[]> {
    return await this.db.select().from(messages).where(eq(messages.userId, userId));
  }
  async createMessage(message: InsertMessage): Promise<Message> {
    await this.db.insert(messages).values({ ...message });
    const [last] = await this.db.select().from(messages).orderBy(messages.id.desc()).limit(1);
    return last;
  }
  async markMessageAsRead(id: number): Promise<void> {
    await this.db.update(messages).set({ isRead: true }).where(eq(messages.id, id));
  }
  // Blog posts
  async getBlogPosts(): Promise<BlogPost[]> {
    return await this.db.select().from(blogPosts);
  }
  async getBlogPost(slug: string): Promise<BlogPost | undefined> {
    return await this.db.query.blogPosts.findFirst({ where: eq(blogPosts.slug, slug) }) ?? undefined;
  }
}

export const storage = new PgStorage();
