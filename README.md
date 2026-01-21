# Word Frequency Analyzer 📊

A modern web app to help language learners analyze books/documents, extract high-frequency vocabulary, and learn effectively.

## 🚀 Features & Roadmap

### Core Analysis & Visualization
- [x] **Multi-Format Support**: Upload `.pdf`, `.docx`, `.txt`, `.csv` (Max 100MB).
- [x] **Smart Analysis**: Extract top 500 frequent words, filter short words (3+ chars).
- [x] **Visualizations**: Interactive Word Cloud & detailed frequency statistics.
- [x] **Data Tools**: Search, filter, and sort word lists.
- [x] **Export**: Download analysis results to CSV.
- [x] **Multi-File Analysis**: Combine multiple documents for comprehensive analysis.

### Learning Tools
- [x] **Context Viewer**: Show original sentence/paragraph where word appears.
- [x] **Instant Lookups**: Popup translation & auto-pronunciation (TTS).
- [x] **Flashcards & SRS**: Built-in Spaced Repetition System for vocabulary review.
- [x] **Vocabulary Management**: Star/save words across documents (Cloud sync).

### System & UX
- [x] **Mobile Optimization**: Complete responsive design for learning on the go.
- [x] **User Accounts**: Secure login via Email OTP (passwordless).
- [x] **Cloud Sync**: Sync saved vocabulary and progress across devices.

### Community & Feedback
- [x] **Feedback Portal**: In-app form for users to submit ideas (supports images, video).
- [x] **Admin Dashboard**: Internal tool for devs to view and manage user feedback.

### Testing & Quality
- [x] **Automated Testing**: Playwright E2E test suite with Page Object Model.
- [x] **Documentation**: Complete API docs, configuration guide, contributing guidelines.

## 🛠️ Tech Stack
*   **Backend**: Node.js, Express, SQLite, Sequelize, Multer.
*   **Frontend**: Vanilla JS, HTML5/CSS3 (Glassmorphism), D3.js.
*   **Auth**: JWT + Email OTP (Nodemailer).
*   **Testing**: Playwright.

## � Quick Start

```bash
# Clone repository
git clone https://github.com/tackelua/word-frequency-analyzer.git
cd word-frequency-analyzer

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your email credentials

# Run server
npm run dev
# Open http://localhost:3000
```

## � Documentation

- 📘 [API Documentation](docs/API.md)
- 🛠️ [Configuration Guide](docs/CONFIGURATION.md)
- 🧪 [Testing Guide](tests/README.md)
- 🤝 [Contributing](docs/CONTRIBUTING.md)

## 🗺️ Future Roadmap

### v1.1.0 (Planned)
- [ ] **Admin Dashboard Redesign**: Modern UI with charts and analytics.
- [ ] **Anki Integration**: Export saved words to `.apkg` format.
- [ ] **More Languages**: Vietnamese, Spanish, French translation support.
- [ ] **Word Difficulty**: Estimate CEFR level (A1-C2) for each word.

### v1.2.0 (Planned)
- [ ] **Code Refactoring**: Modularize frontend JavaScript.
- [ ] **Performance**: Optimize for faster loading and analysis.
- [ ] **PWA Support**: Offline mode and app installation.
- [ ] **Audio Library**: Native speaker pronunciations.

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Made with ❤️ for language learners worldwide**
