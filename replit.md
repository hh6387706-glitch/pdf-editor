# WordPress to Blogger XML Converter

## Overview

This is a full-stack web application that converts WordPress export XML files to Blogger-compatible XML format. The application is built with a Node.js/Express backend and a React frontend, designed to provide a simple and secure file conversion service. Users can upload their WordPress export files through a web interface and receive converted Blogger XML files for import into their Blogger accounts.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Components**: Shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **File Processing**: Multer for file uploads with memory storage
- **XML Processing**: xml2js library for parsing and converting XML formats
- **API Design**: RESTful endpoints with structured error handling

### Development Setup
- **Monorepo Structure**: Client and server code in separate directories with shared schemas
- **Build System**: Vite for frontend, esbuild for backend bundling
- **Development**: Hot module replacement and development server integration
- **Type Safety**: Shared TypeScript schemas between frontend and backend

### File Processing Architecture
- **Upload Strategy**: In-memory file processing (no persistent storage)
- **File Validation**: MIME type checking for XML files with 50MB size limit
- **Conversion Logic**: WordPress RSS/XML to Blogger XML format transformation
- **Content Mapping**: Posts, pages, categories (as labels), and metadata preservation
- **Security**: File type validation and memory-based processing to avoid disk storage

### Database Architecture
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Migration Strategy**: Drizzle Kit for schema management
- **Current Usage**: Database configuration present but not actively used for core conversion functionality

## External Dependencies

### Frontend Dependencies
- **UI Framework**: React 18 with TypeScript
- **Component Library**: Radix UI primitives with Shadcn/ui wrapper components
- **Styling**: Tailwind CSS with PostCSS for processing
- **State Management**: TanStack Query for API data fetching and caching
- **Form Management**: React Hook Form with Hookform resolvers
- **Validation**: Zod for runtime type checking and validation
- **Icons**: Lucide React for consistent iconography
- **Routing**: Wouter for lightweight client-side routing

### Backend Dependencies
- **Server Framework**: Express.js with TypeScript support
- **File Handling**: Multer for multipart form data processing
- **XML Processing**: xml2js for parsing and transforming XML documents
- **Database**: Neon Database serverless PostgreSQL with Drizzle ORM
- **Validation**: Zod for shared schema validation
- **Development**: tsx for TypeScript execution and hot reloading

### Build and Development Tools
- **Frontend Build**: Vite with React plugin and runtime error overlay
- **Backend Build**: esbuild for production bundling
- **Package Management**: npm with lockfile version 3
- **TypeScript**: Shared configuration across frontend and backend
- **Development Integration**: Replit-specific plugins for development environment

### Third-party Services
- **Database Hosting**: Neon Database for PostgreSQL hosting
- **Font Loading**: Google Fonts for typography (Inter, Architects Daughter, DM Sans, Fira Code, Geist Mono)
- **Development Platform**: Replit integration for cloud-based development