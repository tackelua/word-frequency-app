# Word Frequency Analyzer 📊

A powerful, modern web application designed to help language learners analyze books and documents, extract high-frequency vocabulary, and learn effectively with built-in spaced repetition and context-aware tools.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)

---

## ✨ Features

### 📚 Core Analysis & Visualization
- ✅ **Multi-Format Support**: Upload PDF, DOCX, TXT, CSV files (up to 100MB)
- ✅ **Smart Analysis**: Extract top 500 frequent words with intelligent filtering
- ✅ **Interactive Word Cloud**: Visual representation of word frequency with 100+ words
- ✅ **Detailed Statistics**: Comprehensive frequency table with sorting and search
- ✅ **CSV Export**: Download your analysis results
- ✅ **Multi-File Analysis**: Combine multiple documents for comprehensive vocabulary extraction

### 🎓 Learning Tools
- ✅ **Context Viewer**: See original sentences where words appear
- ✅ **Text-to-Speech**: Instant pronunciation for any word
- ✅ **Word Definitions**: Integrated dictionary lookups
- ✅ **Google Translate**: Quick translation to your language
- ✅ **Flashcard System**: Built-in spaced repetition (SRS) for vocabulary review
- ✅ **Smart Scheduling**: Cards reappear based on difficulty (1 min, 1 day, 4 days, etc.)
- ✅ **Vocabulary Manager**: Star/save words across multiple documents

### 🔐 User System
- ✅ **Passwordless Login**: Secure Email OTP authentication
- ✅ **Cloud Sync**: Sync vocabulary and SRS progress across devices
- ✅ **User Profiles**: Personal vocabulary library
- ✅ **Data Privacy**: Your data is encrypted and secure

### 💬 Community & Feedback
- ✅ **Feedback Portal**: Submit bugs, feature requests, or general feedback
- ✅ **Media Upload**: Attach screenshots/videos (up to 5 files)
- ✅ **Admin Dashboard**: Internal tool for managing user feedback

### 🎨 Modern UI/UX
- ✅ **Glassmorphism Design**: Beautiful, modern interface
- ✅ **Responsive**: Works on desktop, tablet, and mobile
- ✅ **Dark Theme**: Easy on the eyes for long study sessions
- ✅ **Smooth Animations**: Polished user experience
- ✅ **Accessibility**: WCAG compliant design

---

## 🚀 Quick Start

### Prerequisites
- Node.js >= 14.0.0
- npm or yarn
- SQLite3 (auto-installed)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/word-frequency-app.git
cd word-frequency-app

# Install dependencies
npm install

# Create .env file (copy from example)
cp .env.example .env

# Edit .env with your email credentials
nano .env
```

### Configuration

Edit `.env` file with your settings:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
DATABASE_PATH=./database.sqlite

# JWT Secret (generate a secure random string)
JWT_SECRET=your-super-secret-jwt-key-change-this

# Email Configuration (for OTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
EMAIL_FROM="Word Frequency App <your-email@gmail.com>"
```

> **Note**: For Gmail, you need to create an [App Password](https://support.google.com/accounts/answer/185833)

### Running the App

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start

# Open in browser
# http://localhost:3000
```

---

## 📖 Usage Guide

### 1. Upload Your Document
- Drag & drop or click to browse
- Supported formats: PDF, DOCX, TXT, CSV
- Max file size: 100MB

### 2. Analyze Results
- **Word Cloud**: Visual overview of top words
- **Frequency Table**: Detailed breakdown with counts and percentages
- **Search & Filter**: Find specific words quickly
- **Sort**: By rank, word, count, or percentage

### 3. Save Words
- Click ⭐ to save words to your vocabulary list
- View all saved words by clicking "Saved Words" filter
- Export to CSV for use in other tools

### 4. Learn with Flashcards
- Click the "Saved Words" card (shows count)
- Practice with spaced repetition system
- Rate difficulty: Hard, Good, or Easy
- Cards automatically scheduled based on your performance

### 5. Explore Context
- Click any word in the table to view context
- See definitions from integrated dictionary
- Use Text-to-Speech to hear pronunciation
- Translate with Google Translate

---

## 🧪 Testing

We use Playwright for automated end-to-end testing.

```bash
# Install test dependencies
cd tests
npm install

# Run tests (with visible browser)
npm test

# Run headless (for CI/CD)
npm run test:headless

# Debug mode
npm run test:debug
```

See [tests/README.md](tests/README.md) for detailed testing guide.

---

## 🗂️ Project Structure

```
word-frequency-app/
├── server.js                 # Express server entry point
├── package.json              # Dependencies and scripts
├── .env.example              # Environment variables template
├── database.sqlite           # SQLite database (auto-created)
│
├── src/                      # Backend source code
│   ├── analyzer.js           # Text analysis engine
│   ├── db.js                 # Database connection
│   ├── middleware/           # Express middleware
│   │   └── auth.js           # JWT authentication
│   ├── models/               # Sequelize models
│   │   ├── index.js
│   │   ├── User.js
│   │   ├── Word.js
│   │   └── Feedback.js
│   └── routes/               # API routes
│       ├── auth.js           # Login/register
│       ├── user_words.js     # Vocabulary sync
│       └── feedback.js       # Feedback submission
│
├── public/                   # Frontend files (served statically)
│   ├── index.html            # Main app page
│   ├── admin.html            # Admin dashboard
│   ├── app.js                # Frontend logic
│   └── styles.css            # Styles (glassmorphism)
│
├── uploads/                  # User-uploaded files
├── tests/                    # Automated test suite
│   ├── phase5-verification.js
│   ├── helpers/
│   │   ├── page-objects.js
│   │   └── test-data.js
│   └── README.md
│
└── docs/                     # Documentation (optional)
```

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: SQLite3 with Sequelize ORM
- **Authentication**: JWT + Email OTP
- **Email**: Nodemailer
- **File Upload**: Multer
- **Text Extraction**: pdf-parse, mammoth, natural

### Frontend
- **UI**: Vanilla JavaScript (ES6+)
- **Styling**: CSS3 with Glassmorphism
- **Visualization**: D3.js + d3-cloud
- **Icons**: Emoji (native)
- **No frameworks**: Pure, lightweight, fast

### Testing
- **E2E**: Playwright
- **Pattern**: Page Object Model
- **CI/CD Ready**: Headless mode

---

## 🌍 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port | No | 3000 |
| `NODE_ENV` | Environment | No | development |
| `DATABASE_PATH` | SQLite file path | No | ./database.sqlite |
| `JWT_SECRET` | JWT signing key | **Yes** | - |
| `EMAIL_HOST` | SMTP server | **Yes** | - |
| `EMAIL_PORT` | SMTP port | **Yes** | 587 |
| `EMAIL_USER` | SMTP username | **Yes** | - |
| `EMAIL_PASS` | SMTP password | **Yes** | - |
| `EMAIL_FROM` | Sender address | **Yes** | - |

---

## 📚 API Documentation

### Authentication

#### POST `/api/auth/send-otp`
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

#### POST `/api/auth/verify`
Verify OTP and get JWT token.

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

### File Upload & Analysis

#### POST `/api/upload`
Upload and analyze a document.

**Request:** `multipart/form-data`
- `file`: Document file

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
        "context": ["This is an example sentence.", "..."]
      }
    ],
    "totalWords": 1680,
    "uniqueWords": 523
  }
}
```

### Vocabulary Management

#### GET `/api/user/words`
Get user's saved words (requires authentication).

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
  }
]
```

#### POST `/api/user/words/sync`
Sync vocabulary data (requires authentication).

**Request:**
```json
{
  "words": [
    {
      "word": "example",
      "srsInterval": 60,
      "nextReview": null,
      "streak": 0
    }
  ]
}
```

### Feedback

#### POST `/api/feedback`
Submit user feedback.

**Request:** `multipart/form-data`
- `type`: "bug" | "feature" | "general"
- `content`: Feedback message
- `email`: User email (optional)
- `media`: Files (max 5, optional)

**Response:**
```json
{
  "success": true,
  "message": "Feedback received"
}
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm test`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Code Style
- Use ES6+ features
- Follow existing naming conventions
- Add comments for complex logic
- Write tests for new features

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [D3.js](https://d3js.org/) for data visualization
- [pdf-parse](https://www.npmjs.com/package/pdf-parse) for PDF extraction
- [mammoth](https://www.npmjs.com/package/mammoth) for DOCX parsing
- [Playwright](https://playwright.dev/) for testing
- [Free Dictionary API](https://dictionaryapi.dev/) for definitions

---

## 📧 Support

- **Email**: support@wordfrequency.app
- **Issues**: [GitHub Issues](https://github.com/yourusername/word-frequency-app/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/word-frequency-app/discussions)

---

## 🗺️ Roadmap

### v1.1.0 (Planned)
- [ ] Anki export (.apkg format)
- [ ] More language support (Vietnamese, Spanish, etc.)
- [ ] Audio pronunciation from native speakers
- [ ] Progress tracking dashboard
- [ ] Word difficulty estimation (A1-C2)

### v1.2.0 (Planned)
- [ ] Admin dashboard redesign with charts
- [ ] Code refactoring (modular frontend)
- [ ] Performance optimizations
- [ ] PWA support (offline mode)

---

**Made with ❤️ for language learners worldwide**

<p align="center">
  <a href="https://github.com/yourusername/word-frequency-app">⭐ Star this repo if you find it useful!</a>
</p>
