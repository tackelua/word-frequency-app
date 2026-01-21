# API Documentation

## Table of Contents
- [Authentication](#authentication)
- [File Upload & Analysis](#file-upload--analysis)
- [Vocabulary Management](#vocabulary-management)
- [Feedback](#feedback)

---

## Authentication

### Send OTP

**Endpoint:** `POST /api/auth/send-otp`

Send OTP code to email for login/register.

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "message": "OTP sent to email"
}
```

---

### Verify OTP

**Endpoint:** `POST /api/auth/verify`

Verify OTP code and receive JWT token.

**Request:**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

---

## File Upload & Analysis

### Upload Document

**Endpoint:** `POST /api/upload`

Upload and analyze a document.

**Request:** `multipart/form-data`
- `file`: Document file (PDF, DOCX, TXT, CSV)

**Response:**
```json
{
  "fileName": "document.pdf",
  "analysis": {
    "results": [
      {
        "word": "example",
        "count": 42,
        "percentage": "2.5",
        "context": [
          "This is an example sentence.",
          "Another example appears here."
        ]
      }
    ],
    "totalWords": 1680,
    "uniqueWords": 523
  }
}
```

**Limits:**
- Max file size: 100MB
- Max results: 500 words
- Supported formats: `.pdf`, `.docx`, `.doc`, `.txt`, `.csv`

---

## Vocabulary Management

### Get Saved Words

**Endpoint:** `GET /api/user/words`

Get user's saved words with SRS data.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "word": "vocabulary",
    "srsInterval": 1440,
    "nextReview": "2026-01-23T00:00:00.000Z",
    "streak": 3
  },
  {
    "word": "example",
    "srsInterval": 60,
    "nextReview": "2026-01-22T02:00:00.000Z",
    "streak": 0
  }
]
```

---

### Sync Vocabulary

**Endpoint:** `POST /api/user/words/sync`

Sync vocabulary data to cloud.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "words": [
    {
      "word": "example",
      "srsInterval": 60,
      "nextReview": null,
      "streak": 0
    },
    {
      "word": "test",
      "srsInterval": 1440,
      "nextReview": "2026-01-23T00:00:00.000Z",
      "streak": 2
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Synced 2 words"
}
```

**SRS Intervals:**
- Hard: 1 min (60 seconds)
- Good: 1 day (1440 minutes)
- Easy: 4 days (5760 minutes)

---

## Feedback

### Submit Feedback

**Endpoint:** `POST /api/feedback`

Submit user feedback with optional media attachments.

**Request:** `multipart/form-data`
- `type`: `"bug"` | `"feature"` | `"general"`
- `content`: Feedback message (required)
- `email`: User email (optional)
- `media`: Files (max 5, optional)

**Example (JavaScript):**
```javascript
const formData = new FormData();
formData.append('type', 'bug');
formData.append('content', 'The upload button is not working');
formData.append('email', 'user@example.com');
formData.append('media', file1);
formData.append('media', file2);

const response = await fetch('/api/feedback', {
  method: 'POST',
  body: formData
});
```

**Response:**
```json
{
  "success": true,
  "message": "Feedback received"
}
```

**Media Limits:**
- Max files: 5
- Max size per file: 10MB
- Allowed types: `image/*`, `video/*` (jpeg, jpg, png, gif, mp4, mov, avi)

---

## Error Responses

All endpoints may return error responses:

**400 Bad Request:**
```json
{
  "error": "Invalid email format"
}
```

**401 Unauthorized:**
```json
{
  "error": "Invalid or expired token"
}
```

**500 Server Error:**
```json
{
  "error": "Internal server error"
}
```

---

## Rate Limiting

Currently no rate limiting is implemented. Planned for future versions.

---

## Authentication Flow

1. User enters email
2. Server generates 6-digit OTP
3. OTP sent via email (expires in 10 minutes)
4. User enters OTP
5. Server verifies OTP
6. Server returns JWT token (expires in 30 days)
7. Client stores token in localStorage
8. Client includes token in Authorization header for protected routes

---

## Example Usage

### Full Login Flow

```javascript
// Step 1: Send OTP
const sendResponse = await fetch('/api/auth/send-otp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'user@example.com' })
});

// Step 2: User receives OTP via email, then verify
const verifyResponse = await fetch('/api/auth/verify', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    email: 'user@example.com',
    otp: '123456'
  })
});

const { token, user } = await verifyResponse.json();
localStorage.setItem('wfa_token', token);

// Step 3: Use token for authenticated requests
const wordsResponse = await fetch('/api/user/words', {
  headers: { 
    'Authorization': `Bearer ${token}` 
  }
});
```

---

**Last Updated:** 2026-01-22
