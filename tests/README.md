# Test Scripts

This directory contains test scripts for validating the LeetCode authentication and API functionality.

## Available Tests

### `test-npm-package.js`
Tests the `leetcode-query` npm package API directly:
- Public user profile fetching
- Authentication with expired cookies (should fail)
- Problem details API
- Daily challenge API

**Usage:**
```bash
cd tests
node test-npm-package.js
```

### `test-public-api.js`
Tests the public API endpoints of the application:
- Public submissions endpoint
- User profile endpoint
- Error handling

**Usage:**
```bash
# Make sure the development server is running first
npm run dev

# Then in another terminal:
cd tests
node test-public-api.js
```

## Notes

- These scripts are for development and debugging purposes
- They help verify that both the npm package integration and the API endpoints work correctly
- The tests use real LeetCode data and may be rate-limited
