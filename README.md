# Snippet Summarizer

An AI-powered text summarization service that allows users to paste raw text and get back short, AI-generated summaries.

## Features

- **Create snippets**: Paste raw text and get AI-generated summaries (≤30 words)
- **Read snippets**: Retrieve individual snippets by ID
- **List snippets**: View all stored snippets
- **RESTful API**: Clean, well-documented endpoints
- **TypeScript**: Full type safety across the stack
- **TDD**: Test-driven development approach
- **Docker**: Easy containerized deployment

## Tech Stack

- **Backend**: Node.js 20+, Express, TypeScript, MongoDB
- **Frontend**: React, TypeScript
- **AI**: OpenAI API for text summarization
- **Testing**: Jest + Supertest
- **Containerization**: Docker + Docker Compose

## Quick Start with Docker

### Development with Hot Reload

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd house_number_tech_challenge
   ```

2. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env and add your OpenAI API key
   ```

3. **Run with Docker Compose**
   ```bash
   # Development mode (with hot reload)
   docker-compose --profile dev up --build
   
   # Production mode
   docker-compose --profile prod up --build
   ```

   This will:
   - Start MongoDB on port 27017
   - Start the API server on port 3000 (with tests)
   - Start the React frontend on port 3030 (with hot reload + tests)
   - Run tests automatically before starting services

**Features:**
- ✅ Hot reload enabled for frontend development
- ✅ Source code mounted as volumes
- ✅ Real-time file changes
- ✅ Tests run automatically before starting services
- ✅ Single docker-compose file for all environments

## Local Development

### Prerequisites
- Node.js 20+
- MongoDB (or use Docker)
- OpenAI API key

### Backend Setup
```bash
# Install dependencies
npm install

# Set up environment variables
cp env.example .env
# Edit .env with your configuration

# Run tests
npm test

# Start development server
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## API Documentation

### Base URL
```
http://localhost:3000
```

### Endpoints

#### Create Snippet
```http
POST /snippets
Content-Type: application/json

{
  "text": "Your raw text content here..."
}
```

**Response:**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "text": "Your raw text content here...",
  "summary": "AI-generated summary in 30 words or less"
}
```

#### Get Snippet
```http
GET /snippets/:id
```

**Response:**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "text": "Your raw text content here...",
  "summary": "AI-generated summary in 30 words or less"
}
```

#### List All Snippets
```http
GET /snippets
```

**Response:**
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "text": "First snippet text...",
    "summary": "First snippet summary"
  },
  {
    "id": "507f1f77bcf86cd799439012",
    "text": "Second snippet text...",
    "summary": "Second snippet summary"
  }
]
```

#### Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Testing

### Run Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Examples

```bash
# Test health endpoint
curl http://localhost:3000/health

# Create a snippet
curl -X POST http://localhost:3000/snippets \
  -H "Content-Type: application/json" \
  -d '{"text": "This is a test snippet for summarization."}'

# Get all snippets
curl http://localhost:3000/snippets
```

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NODE_ENV` | Environment mode | No | `development` |
| `PORT` | Server port | No | `3000` |
| `MONGODB_URI` | MongoDB connection string | Yes | - |
| `OPENAI_API_KEY` | OpenAI API key | Yes | - |

## Project Structure

```
├── src/
│   ├── controllers/     # Route controllers
│   ├── models/         # MongoDB models
│   ├── services/       # Business logic
│   ├── routes/         # Express routes
│   ├── middleware/     # Custom middleware
│   ├── test/          # Test files
│   └── index.ts       # App entry point
├── frontend/          # React frontend
├── Dockerfile         # Backend Dockerfile
├── docker-compose.yml # Docker orchestration
└── package.json       # Dependencies
```

## Development Workflow

This project follows Test-Driven Development (TDD):

1. **Write tests first** - Define expected behavior
2. **Run tests** - Verify they fail (red)
3. **Write minimal code** - Make tests pass (green)
4. **Refactor** - Improve code while keeping tests green
5. **Repeat** - Continue the cycle

## API Keys Setup

### OpenAI
1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Create an account and get your API key
3. Add to `.env`: `OPENAI_API_KEY=your_key_here`

## Contributing

1. Follow TDD approach
2. Write meaningful commit messages
3. Ensure all tests pass
4. Update documentation as needed

## License

MIT 