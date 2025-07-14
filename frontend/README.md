# Text Summarizer Frontend

A Next.js frontend application for the Text Summarizer service. This application allows users to create, view, and manage text snippets with AI-generated summaries.

## Features

- **Create Snippets**: Paste text and get AI-powered summaries
- **View Snippets**: Browse all created snippets with summaries
- **Real-time Updates**: See snippets update in real-time
- **Responsive Design**: Works on desktop and mobile devices
- **Toast Notifications**: User-friendly feedback for actions

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Testing**: Jest + React Testing Library
- **State Management**: React Hooks

## Prerequisites

- Node.js 20+
- npm or yarn
- Backend API running on port 3000

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 3. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### 4. Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### 5. Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── __tests__/         # Page tests
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   └── ui/               # shadcn/ui components
├── hooks/                # Custom React hooks
│   └── __tests__/        # Hook tests
├── lib/                  # Utility functions
├── services/             # API services
│   └── __tests__/        # Service tests
└── types/                # TypeScript type definitions
```

## Testing

The project follows Test-Driven Development (TDD) principles:

- **Unit Tests**: Test individual components and functions
- **Integration Tests**: Test component interactions
- **E2E Tests**: Test complete user workflows

### Test Structure

- `src/services/__tests__/`: API service tests
- `src/hooks/__tests__/`: Custom hook tests
- `src/app/__tests__/`: Page component tests

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- snippetService.test.ts

# Run tests with coverage
npm run test:coverage
```

## API Integration

The frontend communicates with the backend API through the `SnippetService` class:

- `getAllSnippets()`: Fetch all snippets
- `getSnippetById(id)`: Fetch a specific snippet
- `createSnippet(request)`: Create a new snippet

## Docker

### Build and Run with Docker

```bash
# Build the image
docker build -t text-summarizer-frontend .

# Run the container
docker run -p 3030:3030 text-summarizer-frontend
```

### Docker

#### Development with Hot Reload

The project includes Docker setup for development with hot reload:

```bash
# Start all services in development mode (with hot reload)
docker-compose up

# Start only frontend in development mode
docker-compose up frontend

# Rebuild and start
docker-compose up --build
```

**Features:**
- ✅ Hot reload enabled
- ✅ Source code mounted as volumes
- ✅ Real-time file changes
- ✅ Fast development cycle

#### Production

For production deployment:

```bash
# Use production docker-compose
docker-compose -f docker-compose.prod.yml up --build
```

#### Docker Commands

```bash
# Build development image
docker build -f Dockerfile.dev -t text-summarizer-frontend:dev .

# Build production image
docker build -f Dockerfile -t text-summarizer-frontend:prod .

# Run development container
docker run -p 3030:3030 -v $(pwd):/app text-summarizer-frontend:dev

# Run production container
docker run -p 3030:3030 text-summarizer-frontend:prod
```

## Development Guidelines

### Code Style

- Use TypeScript for all new code
- Follow ESLint configuration
- Use Prettier for code formatting
- Write meaningful commit messages

### Component Development

1. Write tests first (TDD approach)
2. Create components with proper TypeScript interfaces
3. Use shadcn/ui components for consistency
4. Implement proper error handling
5. Add loading states for async operations

### Testing Best Practices

- Test user interactions, not implementation details
- Use semantic queries (getByRole, getByText)
- Mock external dependencies
- Test error states and edge cases
- Keep tests focused and readable

## Troubleshooting

### Common Issues

1. **API Connection Errors**: Ensure the backend is running on port 3000
2. **Build Errors**: Check that all dependencies are installed
3. **Test Failures**: Verify that mocks are properly configured

### Debug Mode

Enable debug logging by setting the environment variable:

```env
DEBUG=true
```

## Contributing

1. Follow TDD approach - write tests first
2. Ensure all tests pass before submitting
3. Update documentation for new features
4. Follow the existing code style and patterns
