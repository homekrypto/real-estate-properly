CREATE TABLE "blog_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar NOT NULL,
	"slug" varchar NOT NULL,
	"excerpt" text NOT NULL,
	"content" text NOT NULL,
	"category" varchar NOT NULL,
	"author_id" varchar NOT NULL,
	"featured_image" varchar NOT NULL,
	"is_published" boolean DEFAULT false,
	"featured" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "blog_posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "cities" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"region_id" integer NOT NULL,
	"latitude" numeric(10, 7),
	"longitude" numeric(10, 7),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "comments" (
	"id" varchar(32) PRIMARY KEY NOT NULL,
	"post_id" varchar(32) NOT NULL,
	"name" varchar(128) NOT NULL,
	"text" text NOT NULL,
	"date" timestamp NOT NULL,
	"status" varchar(16) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "countries" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"code" varchar(2) NOT NULL,
	"flag" varchar NOT NULL,
	"currency" varchar NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "countries_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"from_user_id" varchar NOT NULL,
	"to_user_id" varchar NOT NULL,
	"property_id" integer,
	"subject" varchar NOT NULL,
	"message" text NOT NULL,
	"is_read" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "properties" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar NOT NULL,
	"description" text NOT NULL,
	"price" numeric(12, 2) NOT NULL,
	"currency" varchar DEFAULT 'USD' NOT NULL,
	"property_type" varchar NOT NULL,
	"listing_type" varchar NOT NULL,
	"bedrooms" integer NOT NULL,
	"bathrooms" integer NOT NULL,
	"square_meters" integer NOT NULL,
	"plot_area" integer,
	"year_built" integer,
	"floor" integer,
	"total_floors" integer,
	"address" varchar NOT NULL,
	"city_id" integer NOT NULL,
	"region" varchar NOT NULL,
	"city" varchar NOT NULL,
	"country_id" integer NOT NULL,
	"agent_id" varchar NOT NULL,
	"images" text[] NOT NULL,
	"features" text[],
	"amenities" text[],
	"status" varchar DEFAULT 'draft',
	"is_active" boolean DEFAULT true,
	"is_featured" boolean DEFAULT false,
	"view_count" integer DEFAULT 0,
	"contact_count" integer DEFAULT 0,
	"seo_slug" varchar,
	"meta_title" varchar,
	"meta_description" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "properties_seo_slug_unique" UNIQUE("seo_slug")
);
--> statement-breakpoint
CREATE TABLE "property_inquiries" (
	"id" serial PRIMARY KEY NOT NULL,
	"property_id" integer NOT NULL,
	"agent_id" varchar NOT NULL,
	"seeker_name" varchar NOT NULL,
	"seeker_email" varchar NOT NULL,
	"seeker_phone" varchar,
	"message" text,
	"status" varchar DEFAULT 'new',
	"source" varchar DEFAULT 'website',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "regions" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"country_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "saved_properties" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"property_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"sid" varchar PRIMARY KEY NOT NULL,
	"sess" jsonb NOT NULL,
	"expire" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscription_plans" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"description" text,
	"monthly_price" numeric(10, 2) NOT NULL,
	"annual_price" numeric(10, 2) NOT NULL,
	"property_limit" integer NOT NULL,
	"features" text[] NOT NULL,
	"stripe_price_id_monthly" varchar,
	"stripe_price_id_annual" varchar,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY NOT NULL,
	"email" varchar,
	"password" varchar,
	"first_name" varchar,
	"last_name" varchar,
	"profile_image_url" varchar,
	"role" varchar DEFAULT 'seeker' NOT NULL,
	"company" varchar,
	"phone" varchar,
	"language" varchar DEFAULT 'en',
	"theme" varchar DEFAULT 'light',
	"status" varchar DEFAULT 'unverified',
	"verification_token" varchar,
	"password_reset_token" varchar,
	"password_reset_expires" timestamp,
	"agency_name" varchar,
	"subscription_status" varchar DEFAULT 'none',
	"subscription_tier" varchar,
	"subscription_id" varchar,
	"customer_id" varchar,
	"current_period_end" timestamp,
	"property_limit" integer DEFAULT 0,
	"active_properties" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"token" varchar NOT NULL,
	"type" varchar NOT NULL,
	"expires_at" timestamp NOT NULL,
	"used" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "verification_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE INDEX "IDX_session_expire" ON "sessions" USING btree ("expire");