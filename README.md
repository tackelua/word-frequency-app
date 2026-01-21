# Word Frequency Analyzer 📊

A modern web app to help language learners analyze books/documents, extract vocabulary, and learn with spaced repetition.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)

---

## ✨ Features

### 📚 Core Analysis
- ✅ Multi-format support (PDF, DOCX, TXT, CSV) up to 100MB
- ✅ Extract top 500 words with frequency stats
- ✅ Interactive word cloud + detailed tables
- ✅ Multi-file analysis

### 🎓 Learning Tools
- ✅ Context viewer with definitions
- ✅ Text-to-speech pronunciation
- ✅ Flashcards with spaced repetition (SRS)
- ✅ Vocabulary manager with cloud sync

### 🔐 User System
- ✅ Passwordless login (Email OTP)
- ✅ Cloud sync across devices
- ✅ Personal vocabulary library

### 💬 Feedback System
- ✅ Bug reports & feature requests
- ✅ Multi-file upload support
- ✅ Admin dashboard

---

## 🚀 Quick Start

### Installation

```bash
git clone https://github.com/yourusername/word-frequency-app.git
cd word-frequency-app
npm install
```

### Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit with your email credentials
nano .env
```

Required environment variables:
- `JWT_SECRET` - Random secret key
- `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS` - SMTP settings

See [Configuration Guide](docs/CONFIGURATION.md) for details.

### Run

```bash
# Development
npm run dev

# Production
npm start

# Open http://localhost:3000
```

---

## 📖 Documentation

- 📘 [API Documentation](docs/API.md)
- 🛠️ [Configuration Guide](docs/CONFIGURATION.md)
- 🧪 [Testing Guide](tests/README.md)
- 🤝 [Contributing](docs/CONTRIBUTING.md)

---

## 🧪 Testing

```bash
cd tests
npm install
npm test
```

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express, SQLite, Sequelize
- **Frontend**: Vanilla JS, CSS3 (Glassmorphism), D3.js
- **Auth**: JWT + Email OTP
- **Testing**: Playwright

---

## 📝 License

MIT License - see [LICENSE](LICENSE) file

---

## 🙏 Acknowledgments

- [D3.js](https://d3js.org/) - Visualization
- [pdf-parse](https://npmjs.com/package/pdf-parse) - PDF extraction
- [Playwright](https://playwright.dev/) - Testing
- [Free Dictionary API](https://dictionaryapi.dev/) - Definitions

---

**Made with ❤️ for language learners**

