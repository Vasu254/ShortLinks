# ShortLinks
# AffordMed URL Shortener

A modern, client-side URL shortener application built with React, Vite, and Material-UI. This project allows users to create short links with custom codes, track clicks, and manage link expiry.

## Features

- **URL Shortening**: Convert long URLs into short, memorable links
- **Custom Codes**: Optionally specify custom short codes (3-20 characters, alphanumeric + _-)
- **Batch Processing**: Shorten up to 5 URLs at once
- **Expiry Management**: Set custom expiry times for links (default 30 minutes)
- **Click Tracking**: Track clicks with source and location information
- **Statistics Dashboard**: View detailed analytics for all shortened links
- **Responsive Design**: Mobile-friendly interface using Material-UI
- **Local Storage**: Persist data in browser's localStorage
- **Logging System**: Built-in logging for debugging and analytics

## Tech Stack

- **Frontend Framework**: React 19
- **Build Tool**: Vite
- **UI Library**: Material-UI (MUI) with Emotion
- **Routing**: React Router DOM
- **State Management**: React Hooks
- **Storage**: Browser localStorage
- **Styling**: Material-UI components with custom theming

## Project Structure

```
src/
├── components/
│   └── UrlBatchForm.jsx      # Form component for batch URL shortening
├── pages/
│   ├── ShortenPage.jsx       # Main page for creating short links
│   ├── RedirectPage.jsx      # Handles redirection from short links
│   └── StatsPage.jsx         # Statistics and analytics dashboard
├── services/
│   ├── storage.js            # localStorage operations
│   ├── shortener.js          # URL validation and code generation
│   └── logger.jsx            # Logging service with React context
├── App.jsx                   # Main app component with routing
├── main.jsx                  # App entry point
└── index.css                 # Global styles
```

## Implementation Process

### 1. Project Setup

1. **Initialize Vite Project**
   ```bash
   npm create vite@latest affordmed-url-shortener -- --template react
   cd affordmed-url-shortener
   ```

2. **Install Dependencies**
   ```bash
   npm install @mui/material @emotion/react @emotion/styled @mui/icons-material react-router-dom
   npm install -D @types/react @types/react-dom
   ```

3. **Configure Vite**
   - Basic Vite config with React plugin
   - ESLint configuration for code quality

### 2. Core Services Implementation

#### Storage Service (`src/services/storage.js`)
- **Purpose**: Handle all localStorage operations
- **Functions**:
  - `loadAll()`: Retrieve all shortened links
  - `saveAll()`: Persist links to localStorage
  - `upsert()`: Add or update a link record
  - `getByCode()`: Find link by short code
  - `recordClick()`: Log click events
  - `codeExists()`: Check if code is already in use

#### Shortener Service (`src/services/shortener.js`)
- **Purpose**: URL validation and short code generation
- **Features**:
  - URL validation with protocol checking
  - Short code validation (regex: `/^[A-Za-z0-9_-]{3,20}$/`)
  - Random code generation (6-character default)
  - Unique code generation with collision handling
  - Expiry timestamp calculation
  - Date formatting utilities

#### Logger Service (`src/services/logger.jsx`)
- **Purpose**: Centralized logging system
- **Implementation**:
  - React Context for state management
  - Log entries with timestamp, event type, and details
  - Console logging for debugging
  - Log clearing functionality

### 3. UI Components

#### UrlBatchForm Component
- **Purpose**: Multi-row form for batch URL shortening
- **Features**:
  - Dynamic row addition/removal (max 5 rows)
  - Input validation for URLs, codes, and validity periods
  - Real-time validation feedback
  - Material-UI form components

#### Page Components

**ShortenPage.jsx**
- Main interface for creating short links
- Integrates UrlBatchForm
- Displays created links in a table
- Shows all existing links with status

**RedirectPage.jsx**
- Handles `/code` routes
- Validates link existence and expiry
- Records click analytics
- Performs automatic redirection

**StatsPage.jsx**
- Analytics dashboard
- Link overview table
- Detailed click logs with expandable accordions
- Client-side logging display

### 4. Routing and App Structure

#### App.jsx
- **Routing Setup**:
  - `/` - ShortenPage (default)
  - `/stats` - StatsPage
  - `/:code` - RedirectPage (dynamic)
  - `/shorten` - Redirect to `/`
  - `*` - Fallback to `/`

- **Navigation Bar**:
  - AppBar with branding
  - Navigation links to main pages
  - Route-based logging

#### Main Entry Point
- `src/main.jsx`: Renders App with React.StrictMode
- `index.html`: Basic HTML template with root div

### 5. Data Model

Each shortened link record contains:
```javascript
{
  code: "abc123",           // Short code
  longUrl: "https://...",   // Original URL
  createdAt: 1234567890,    // Creation timestamp
  expiresAt: 1234567890,    // Expiry timestamp
  clicks: [                 // Click history
    {
      ts: 1234567890,       // Click timestamp
      source: "google.com", // Referrer domain
      location: "America/New_York" // Timezone
    }
  ]
}
```

### 6. Key Features Implementation

#### Batch Processing
- Form allows multiple URLs in single submission
- Server-side validation before processing
- Atomic operation - all succeed or none processed

#### Click Tracking
- Captures referrer information
- Records timezone for location approximation
- Stores click history per link

#### Expiry System
- Configurable expiry periods
- Automatic expiry checking on access
- Visual status indicators

#### Responsive Design
- Material-UI responsive grid system
- Mobile-optimized layouts
- Touch-friendly interface

## Development

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation
```bash
git clone <repository-url>
cd affordmed-url-shortener
npm install
```

### Running the Application
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173)

### Building for Production
```bash
npm run build
npm run preview
```

### Code Quality
```bash
npm run lint
```

## Deployment

This is a client-side only application that can be deployed to any static hosting service:

- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

Since all data is stored in localStorage, no backend database is required for basic functionality.

## Future Enhancements

- Backend API for centralized storage
- User authentication and link management
- Advanced analytics with charts
- QR code generation
- Link tags and categorization
- Bulk import/export functionality
- API rate limiting
- Link password protection

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
