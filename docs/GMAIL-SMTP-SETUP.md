# Gmail SMTP Configuration Guide for codefolio

## ✅ What I've Done

Updated your `.env` file with Gmail SMTP settings. Now you need to complete the setup with your Gmail credentials.

---

## 📧 Step-by-Step Gmail Configuration

### Step 1: Enable 2-Factor Authentication on Gmail

Gmail requires 2FA to create App Passwords for SMTP access.

1. Go to: https://myaccount.google.com/security
2. Click **"2-Step Verification"**
3. Follow the prompts to enable 2FA (if not already enabled)
4. You'll need your phone to verify

### Step 2: Create a Gmail App Password

App Passwords are special 16-character passwords for apps that can't use standard 2FA.

1. Go to: https://myaccount.google.com/apppasswords
    - Or: Google Account → Security → 2-Step Verification → App passwords
2. Sign in if prompted
3. Click **"Select app"** → Choose **"Mail"**
4. Click **"Select device"** → Choose **"Other (Custom name)"**
5. Type: **"codefolio Laravel App"**
6. Click **"Generate"**
7. **Copy the 16-character password** (format: `xxxx xxxx xxxx xxxx`)
    - Remove the spaces when pasting into .env

### Step 3: Update Your .env File

Replace the placeholders in your `.env` file:

```env
MAIL_USERNAME=your-actual-gmail@gmail.com
MAIL_PASSWORD=your16characterapppassword
MAIL_FROM_ADDRESS="your-actual-gmail@gmail.com"
```

**Example:**

```env
MAIL_USERNAME=john.doe@gmail.com
MAIL_PASSWORD=abcdwxyzefgh1234
MAIL_FROM_ADDRESS="john.doe@gmail.com"
```

### Step 4: Clear Laravel Configuration Cache

After updating `.env`, run:

```bash
php artisan config:clear
```

### Step 5: Test Password Reset

1. Visit: http://127.0.0.1:8000/forgot-password
2. Enter a valid user email address
3. Click "Email password reset link"
4. Check the user's **actual Gmail inbox** for the email

---

## ⚙️ Current Gmail SMTP Settings

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_ENCRYPTION=tls
```

These are the standard Gmail SMTP settings and should not be changed.

---

## 📊 Gmail Sending Limits

**Free Gmail Account:**

- **500 emails per day** (rolling 24-hour period)
- **500 recipients per email**
- Suitable for small applications

**Google Workspace (Paid):**

- **2,000 emails per day**
- Better deliverability
- Professional domain support

For production apps with high email volume, consider:

- **SendGrid** (free tier: 100 emails/day)
- **Mailgun** (free tier: 5,000 emails/month)
- **Amazon SES** (very cheap, highly scalable)

---

## 🛡️ Preventing Spam Issues

### 1. Use a Professional From Address

✅ Use your actual Gmail address as the sender
❌ Don't use fake addresses like "noreply@codefolio.com" (unless you own that domain)

### 2. Warm Up Your Account

- Start with low email volume
- Gradually increase sending over several days
- Don't send 500 emails immediately

### 3. Domain Reputation (Advanced)

If you own a domain (e.g., codefolio.com):

- Set up SPF records
- Configure DKIM signing
- Add DMARC policy
- Use a professional email service

### 4. Email Content

- Avoid spam trigger words ("FREE!!!", "URGENT!!!")
- Include unsubscribe links (for marketing emails)
- Use proper HTML structure
- Your custom codefolio template is already well-structured ✅

---

## 🔧 Troubleshooting

### "Username and Password not accepted"

- ✅ Verify 2FA is enabled
- ✅ Use App Password (not your regular Gmail password)
- ✅ Copy App Password without spaces
- ✅ Run `php artisan config:clear`

### "Connection could not be established"

- ✅ Check internet connection
- ✅ Verify port 587 is not blocked by firewall
- ✅ Try port 465 with `MAIL_ENCRYPTION=ssl` (alternative)

### "Less secure app access"

- Gmail deprecated this in May 2022
- **Must use App Passwords** (requires 2FA)
- No way around this requirement

### Emails Going to Spam

- Check sender reputation
- Verify SPF/DKIM if using custom domain
- Ask recipients to mark as "Not Spam"
- Consider using SendGrid/Mailgun for better deliverability

---

## 🚀 Alternative Email Services (Recommended for Production)

### SendGrid (Recommended)

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.sendgrid.net
MAIL_PORT=587
MAIL_USERNAME=apikey
MAIL_PASSWORD=your-sendgrid-api-key
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="verified@yourdomain.com"
```

**Benefits:**

- Free tier: 100 emails/day
- Excellent deliverability
- Email analytics
- No Gmail limits

**Setup:** https://sendgrid.com/

### Mailgun

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailgun.org
MAIL_PORT=587
MAIL_USERNAME=your-mailgun-username
MAIL_PASSWORD=your-mailgun-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="verified@yourdomain.com"
```

**Benefits:**

- Free tier: 5,000 emails/month
- Pay-as-you-go pricing
- Laravel officially recommends it

**Setup:** https://www.mailgun.com/

---

## 📝 Quick Reference

**Current Status:**

- ✅ Custom codefolio email template created
- ✅ Gmail SMTP settings configured in .env
- ⏳ Waiting for Gmail App Password

**Next Steps:**

1. Enable 2FA on Gmail
2. Generate App Password
3. Update MAIL_USERNAME and MAIL_PASSWORD in .env
4. Run `php artisan config:clear`
5. Test at /forgot-password

**Support Links:**

- Gmail App Passwords: https://myaccount.google.com/apppasswords
- Gmail 2FA Setup: https://myaccount.google.com/security
- Laravel Mail Docs: https://laravel.com/docs/11.x/mail

---

## 🎨 Your Custom Email Template

Your password reset emails now include:

- ✅ "codefolio" branding instead of "Laravel"
- ✅ Amber button color (#d97706)
- ✅ Amber header text
- ✅ Professional footer with codefolio name
- ✅ Fully responsive design

All functional elements remain intact:

- Reset password button with secure token
- 60-minute expiration notice
- Backup URL for button issues
- Professional formatting
