# Properly - Premium Real Estate Platform

## Overview

Properly is a comprehensive real estate platform designed to connect property seekers, real estate agents, and developers across 35+ countries. The application serves as a luxury marketplace for international property listings with sophisticated search capabilities, multi-language support, and professional tools for real estate professionals.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with shadcn/ui components
- **State Management**: TanStack Query for server state, React hooks for local state
- **Build Tool**: Vite with custom configuration for client-side bundling

### Backend Architecture
- **Runtime**: Node.js with Express server
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful API with conventional endpoints
- **Authentication**: Replit Auth with OpenID Connect integration
- **Session Management**: Express sessions with PostgreSQL storage

### Database Architecture
- **Primary Database**: PostgreSQL with Drizzle ORM
- **Connection**: Neon Database serverless PostgreSQL
- **Schema Management**: Drizzle Kit for migrations and schema generation
- **Session Storage**: PostgreSQL-backed session store using connect-pg-simple

## Key Components

### Authentication System
- **Provider**: Replit Auth integration with OIDC
- **User Types**: Buyers, Agents, Developers with role-based access
- **Session Handling**: Secure session management with PostgreSQL backend
- **Authorization**: Route-level protection with user role validation

### Property Management
- **Listing System**: Comprehensive property data model with images, features, and location data
- **Search Engine**: Multi-criteria search with country, region, city, and property type filtering
- **Featured Properties**: Special highlighting system for premium listings
- **Saved Properties**: User favorites with heart/save functionality

### Geographic Hierarchy
- **Country Level**: Top-level geographic organization
- **Regional Structure**: Countries → Regions → Cities hierarchy
- **Search Optimization**: URL structure optimized for SEO with geographic paths

### User Dashboards
- **Buyer Dashboard**: Saved properties, searches, messages, and preferences
- **Agent Dashboard**: Property management, analytics, and client communication
- **Developer Dashboard**: Project management and multi-unit property handling

### Content Management
- **Blog System**: Articles, guides, and market insights
- **Internationalization**: Multi-language support with translation files
- **SEO Optimization**: Strategic URL structure and content organization

## Data Flow

### Client-Server Communication
1. **API Requests**: RESTful endpoints with consistent error handling
2. **Authentication Flow**: OIDC-based login with session persistence
3. **Data Fetching**: TanStack Query for caching and synchronization
4. **File Uploads**: Property images and document handling

### Search Flow
1. **User Input**: Location and criteria selection
2. **URL Generation**: SEO-friendly URLs with search parameters
3. **Backend Processing**: Database queries with filtering logic
4. **Results Display**: Paginated property listings with map integration

### User Management Flow
1. **Registration**: Role-based signup with different user types
2. **Profile Management**: User preferences and settings
3. **Dashboard Access**: Role-specific functionality and data

## External Dependencies

### Core Infrastructure
- **Database**: Neon Database (PostgreSQL serverless)
- **Authentication**: Replit Auth service
- **File Storage**: Attached assets handling
- **Session Storage**: PostgreSQL-backed sessions

### Frontend Libraries
- **UI Framework**: React with TypeScript
- **Styling**: Tailwind CSS with custom theme
- **Components**: Radix UI primitives
- **Icons**: Lucide React icon library
- **Date Handling**: date-fns utility library

### Backend Services
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Validation**: Zod schema validation
- **Session Management**: connect-pg-simple for PostgreSQL sessions

### Development Tools
- **Build System**: Vite with ESBuild for production
- **Type Checking**: TypeScript with strict configuration
- **Code Quality**: ESLint and Prettier integration
- **Development Server**: Hot module replacement with Vite

## Deployment Strategy

### Production Build
- **Frontend**: Vite build process generating optimized static assets
- **Backend**: ESBuild bundling for Node.js deployment
- **Assets**: Static file serving with proper caching headers

### Environment Configuration
- **Database**: Environment-based connection strings
- **Authentication**: Replit-specific environment variables
- **Sessions**: Secure session secrets and configuration

### Scalability Considerations
- **Database**: Serverless PostgreSQL for automatic scaling
- **Caching**: Query-level caching with TanStack Query
- **Static Assets**: Optimized delivery through Vite build process

### Monitoring and Logging
- **Request Logging**: Express middleware for API request tracking
- **Error Handling**: Centralized error management with user-friendly messages
- **Performance**: Built-in metrics for database and API response times

## Internationalization Architecture (December 2024)

### Translation System Implementation
- **Framework**: React i18next with comprehensive language support
- **Languages Supported**: English (en), Spanish (es), German (de), French (fr), Italian (it), Portuguese (pt), Polish (pl)
- **Translation Structure**: Organized with navigation, ui, errors, and page-specific sections
- **Key Features**: 600+ translation keys covering all user-facing content

### Data Localization Features
- **Currency Formatting**: Dynamic currency display based on locale (USD for English, EUR for European languages, PLN for Polish)
- **Date Formatting**: Locale-specific date formats using Intl.DateTimeFormat
- **Number Formatting**: Region-appropriate number and area formatting (sq ft for US, m² for metric regions)
- **Relative Time**: Context-aware time display with Intl.RelativeTimeFormat

### Implementation Status
- **Core Pages**: Property detail, agents, pricing, home pages fully translated
- **UI Components**: Button, form, and common UI elements with translation support
- **Error Handling**: Comprehensive error message translations for all validation scenarios
- **Loading States**: All loading and status messages properly localized

### Technical Architecture
- **Localization Hook**: useLocalization() provides formatCurrency, formatDate, formatNumber, formatArea utilities
- **Translation Files**: Modular JSON structure in client/src/i18n/locales/{language}/common.json
- **Type Safety**: Integration with TypeScript for translation key validation
- **Performance**: Efficient language switching with cached translations

## User & Agent Lifecycle Implementation (January 2025)

### Phase I: Property Seeker Lifecycle
- **Registration System**: Full name, email, password with confirmation validation
- **Email Verification**: Simulated email verification flow with unique verification links
- **Authentication**: Login/logout system with password reset functionality
- **User Dashboard**: Personalized dashboard for property seekers

### Phase II: Agent Monetization System
- **Agent Registration**: Extended registration with agency name and phone number
- **Subscription Tiers**: Bronze ($40/mo, 10 properties), Silver ($60/mo, 25 properties), Gold ($80/mo, 35 properties)
- **Payment Integration**: Stripe Checkout integration with annual savings options
- **Subscription Management**: Billing portal and plan management

### Phase III: Property Management Platform
- **Agent Dashboard**: Comprehensive property management interface
- **Property Creation**: Rich property listing forms with media upload and feature selection
- **Feature Gating**: Subscription-based property limits with upgrade prompts
- **Public Listings**: SEO-optimized property detail pages at /listing/{property-id}