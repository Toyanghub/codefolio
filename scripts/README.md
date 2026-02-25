# Utility Scripts

This folder contains utility scripts for testing, debugging, and maintenance tasks.

## 📜 Available Scripts

### User Management Scripts
- **check_user.php** - Check user account details and status
- **verify_single_user.php** - Verify a single user account
- **verify_legacy_users.php** - Batch verification of legacy user accounts
- **quick_check.php** - Quick diagnostic check of user data

### Testing Scripts
- **test-email.php** - Test email functionality and SMTP configuration
- **test-password-reset.php** - Test password reset workflow

## 🚀 Usage

These scripts are designed to be run from the command line:

```bash
# Run from project root
php scripts/check_user.php

# Or navigate to scripts folder
cd scripts
php check_user.php
```

## ⚠️ Important Notes

- These scripts should **NOT** be accessible from the web
- Do not run these on production without understanding what they do
- Some scripts may modify database records
- Always backup your database before running maintenance scripts

## 🔒 Security

- These scripts are not included in the public web directory
- Ensure proper file permissions (not executable from web)
- Never commit credentials or sensitive data in these scripts
