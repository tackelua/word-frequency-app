# Configuration Guide

## Environment Variables

### Required Variables

#### JWT_SECRET
Secret key for signing JWT tokens.

```bash
# Generate a secure random string
JWT_SECRET=your-super-secret-jwt-key-change-this-to-random-string
```

**Security:** Use a strong, random string. Generate with:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

#### Email Configuration

For sending OTP codes via email.

**Gmail Example:**
```bash
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
EMAIL_FROM="Word Frequency App <your-email@gmail.com>"
```

**Gmail Setup:**
1. Enable 2-factor authentication
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use the 16-character app password as `EMAIL_PASS`

**Other Providers:**
- **Outlook:** `smtp-mail.outlook.com:587`
- **Yahoo:** `smtp.mail.yahoo.com:587`
- **SendGrid:** `smtp.sendgrid.net:587`
- **Mailgun:** `smtp.mailgun.org:587`

---

### Optional Variables

#### PORT
Server port (default: 3000)

```bash
PORT=3000
```

---

#### NODE_ENV
Environment mode

```bash
NODE_ENV=development  # or 'production'
```

In production mode:
- More verbose error logging disabled
- Performance optimizations enabled

---

#### DATABASE_PATH
SQLite database file path

```bash
DATABASE_PATH=./database.sqlite
```

Default location works for most cases. Change if you want database elsewhere.

---

## Complete .env Example

```bash
# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE_PATH=./database.sqlite

# JWT
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6

# Email (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=myapp@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop
EMAIL_FROM="Word Frequency App <myapp@gmail.com>"
```

---

## Security Best Practices

### 1. Never Commit .env to Git

Already configured in `.gitignore`:
```
.env
*.sqlite
uploads/
```

### 2. Use Strong JWT Secret

Minimum 32 characters, random.

### 3. Use App-Specific Passwords

For Gmail, Yahoo, etc. Never use your main password.

### 4. Rotate Secrets

Change JWT_SECRET periodically (will invalidate existing tokens).

### 5. HTTPS in Production

Use reverse proxy (nginx) with SSL certificate.

---

## Troubleshooting

### Email Not Sending

**Problem:** OTP emails not arriving

**Solutions:**
1. Check SMTP credentials
2. Verify app password (not account password)
3. Check spam folder
4. Enable "Less secure app access" (Gmail legacy)
5. Check email quota/rate limits

**Debug:**
```bash
# Add to server.js for debugging
console.log('Email config:', {
  host: process.env.EMAIL_HOST,
  user: process.env.EMAIL_USER,
  // Don't log password!
});
```

---

### Database Errors

**Problem:** SQLite connection errors

**Solutions:**
1. Check write permissions on project folder
2. Verify `DATABASE_PATH` exists
3. Delete `database.sqlite` and restart (recreates tables)

---

### JWT Token Errors

**Problem:** "Invalid token" errors

**Causes:**
1. JWT_SECRET changed (invalidates all tokens)
2. Token expired (30 days)
3. Token format incorrect

**Solution:**
```javascript
// Clear localStorage and re-login
localStorage.removeItem('wfa_token');
localStorage.removeItem('wfa_user');
```

---

## Production Deployment

### Environment Setup

```bash
NODE_ENV=production
PORT=3000

# Use strong secret
JWT_SECRET=$(openssl rand -hex 32)

# Production email service (e.g., SendGrid)
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=SG.xxxxxxxxxxxxx
EMAIL_FROM="noreply@yourdomain.com"
```

### Reverse Proxy (nginx)

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Process Manager (PM2)

```bash
# Install PM2
npm install -g pm2

# Start app
pm2 start server.js --name word-frequency-app

# Auto-restart on reboot
pm2 startup
pm2 save
```

---

## Database Backup

### Manual Backup

```bash
# Backup
cp database.sqlite database.backup.sqlite

# Restore
cp database.backup.sqlite database.sqlite
```

### Automated Backup (cron)

```bash
# Add to crontab
0 2 * * * cp /path/to/database.sqlite /path/to/backups/db-$(date +\%Y\%m\%d).sqlite
```

---

**Last Updated:** 2026-01-22
