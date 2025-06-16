# Test Structure

This project follows a clear separation between **Unit Tests** and **Integration Tests** to demonstrate different testing approaches.

## 📁 Directory Structure

```
src/
├── services/
│   └── __tests__/
│       └── unit/
│           └── referralService.test.js     # Unit tests for business logic
└── controllers/
    └── __tests__/
        └── integration/
            └── userController.integration.test.js  # Integration tests for HTTP endpoints
```

## 🧪 Test Types

### Unit Tests (`/unit/`)

- **Purpose**: Test individual functions/modules in isolation
- **Characteristics**:
  - Mock all external dependencies
  - Fast execution
  - Focus on business logic
  - No network calls or file I/O

**Example**: `referralService.test.js`

- Mocks repositories (actionRepository, userRepository)
- Tests the DFS algorithm logic
- Validates edge cases and error handling
- 100% code coverage

### Integration Tests (`/integration/`)

- **Purpose**: Test how components work together
- **Characteristics**:
  - Test actual HTTP endpoints
  - Use real Fastify server
  - Mock only external systems (file system, databases)
  - Test request/response flow

**Example**: `userController.integration.test.js`

- Creates real Fastify server instance
- Tests actual HTTP requests/responses
- Validates status codes and response formats
- Tests error handling at HTTP level

## 🚀 Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

## 🎯 Key Differences

| Aspect           | Unit Tests             | Integration Tests      |
| ---------------- | ---------------------- | ---------------------- |
| **Scope**        | Single function/module | Multiple components    |
| **Dependencies** | All mocked             | Some real, some mocked |
| **Speed**        | Very fast              | Slower                 |
| **Purpose**      | Logic validation       | End-to-end flow        |
| **Isolation**    | Complete               | Partial                |

This structure demonstrates professional testing practices and understanding of different testing levels.
