# Gmail Setup Guide for HEDDIEKITCHEN

This guide will walk you through setting up Gmail to send emails from your Railway deployment.

## Prerequisites

- A Gmail account (heddiekitchen@gmail.com or your preferred email)
- Access to your Google Account settings
- Access to Railway environment variables

---

## Step-by-Step Setup

### Step 1: Enable 2-Factor Authentication (2FA)

Gmail requires 2FA to be enabled before you can generate app passwords.

1. **Go to your Google Account:**
   - Visit: https://myaccount.google.com
   - Sign in with your Gmail account

2. **Navigate to Security:**
   - Click on "Security" in the left sidebar
   - Or go directly to: https://myaccount.google.com/security

3. **Enable 2-Step Verification:**
   - Scroll down to "How you sign in to Google"
   - Find "2-Step Verification"
   - Click "Get started" or "Turn on"
   - Follow the prompts to set up 2FA:
     - Choose your verification method (phone number, authenticator app, etc.)
     - Complete the setup process

**Note:** This is required! Gmail won't let you create app passwords without 2FA enabled.

---

### Step 2: Generate App Password

Once 2FA is enabled, you can create an app password.

1. **Go to App Passwords:**
   - Visit: https://myaccount.google.com/apppasswords
   - Or navigate: Google Account → Security → 2-Step Verification → App passwords

2. **Select App and Device:**
   - **Select app:** Choose "Mail" from the dropdown
   - **Select device:** Choose "Other (Custom name)"
   - **Enter name:** Type "HEDDIEKITCHEN Railway" (or any name you prefer)
   - Click "Generate"

3. **Copy the App Password:**
   - Google will show you a 16-character password
   - **IMPORTANT:** Copy this password immediately - you won't be able to see it again!
   - It will look like: `abcd efgh ijkl mnop` (with spaces, but you can ignore the spaces)
   - Example: `abcd efgh ijkl mnop` = `abcdefghijklmnop`

**⚠️ Security Note:** 
- This password is different from your regular Gmail password
- Store it securely
- You can revoke it anytime from the same page

---

### Step 3: Configure Railway Environment Variables

Now add the Gmail settings to your Railway project.

1. **Go to Railway Dashboard:**
   - Open your project: https://railway.app
   - Select your "heddy_e_commerce" project
   - Click on your service/deployment

2. **Open Variables Tab:**
   - Click on the "Variables" tab
   - Or go to Settings → Variables

3. **Add the Following Variables:**

   Click "New Variable" for each of these:

   ```bash
   # Email Backend
   EMAIL_BACKEND = django.core.mail.backends.smtp.EmailBackend
   
   # Gmail SMTP Settings
   EMAIL_HOST = smtp.gmail.com
   EMAIL_PORT = 587
   EMAIL_USE_TLS = True
   EMAIL_USE_SSL = False
   
   # Your Gmail Credentials
   EMAIL_HOST_USER = heddiekitchen@gmail.com
   EMAIL_HOST_PASSWORD = your-16-character-app-password-here
   
   # Default From Email
   DEFAULT_FROM_EMAIL = heddiekitchen@gmail.com
   
   # Frontend URL (for email links)
   FRONTEND_URL = https://heddyecommerce-production.up.railway.app
   ```

4. **Important Notes:**
   - Replace `heddiekitchen@gmail.com` with your actual Gmail address
   - Replace `your-16-character-app-password-here` with the app password you generated (remove spaces)
   - Make sure there are NO spaces in the app password
   - All values should be entered exactly as shown (case-sensitive)

5. **Save Variables:**
   - After adding all variables, Railway will automatically redeploy
   - Wait for the deployment to complete

---

### Step 4: Test Email Configuration

After deployment, test if emails are working:

1. **Test Newsletter Subscription:**
   - Go to your website
   - Scroll to the newsletter section
   - Enter your email and click "Subscribe"
   - Check your email inbox (and spam folder) for the welcome email

2. **Test Order Confirmation:**
   - Add items to cart
   - Go through checkout
   - Create an order
   - Check your email for order confirmation

3. **Check Railway Logs:**
   - Go to Railway → Deploy Logs
   - Look for messages like:
     - ✅ "Newsletter welcome email sent successfully to..."
     - ✅ "Order confirmation email sent successfully to..."
     - ❌ If you see errors, check the error message

---

## Troubleshooting

### Problem: "Network is unreachable" Error

**Cause:** Railway may block direct SMTP connections to Gmail.

**Solutions:**
1. **Try SendGrid instead** (more reliable on Railway):
   - See `EMAIL_FIX_GUIDE.md` for SendGrid setup
   - SendGrid is specifically designed for transactional emails

2. **Check Gmail Settings:**
   - Make sure "Less secure app access" is NOT enabled (it's deprecated)
   - Use App Password instead (which you already did)

3. **Verify App Password:**
   - Make sure you copied the app password correctly
   - No spaces in the password
   - Regenerate if needed

### Problem: "Invalid credentials" Error

**Solutions:**
1. **Regenerate App Password:**
   - Go back to https://myaccount.google.com/apppasswords
   - Delete the old one
   - Create a new one
   - Update Railway variable

2. **Check Email Address:**
   - Make sure `EMAIL_HOST_USER` matches the Gmail account you used
   - Check for typos

### Problem: Emails Going to Spam

**Solutions:**
1. **Check Spam Folder:**
   - Gmail may mark automated emails as spam initially
   - Mark as "Not Spam" to train Gmail

2. **Verify Sender:**
   - Make sure `DEFAULT_FROM_EMAIL` matches your Gmail address
   - Gmail requires the "from" address to match your account

### Problem: "Connection timeout" Error

**Solutions:**
1. **Check Port:**
   - Make sure `EMAIL_PORT = 587` (not 465)
   - Port 587 uses TLS, which is more reliable

2. **Check TLS Settings:**
   - `EMAIL_USE_TLS = True`
   - `EMAIL_USE_SSL = False`

3. **Try SendGrid:**
   - Railway may have network restrictions
   - SendGrid is more reliable for cloud deployments

---

## Alternative: Use SendGrid (Recommended)

If Gmail continues to have issues on Railway, I highly recommend using SendGrid:

**Advantages:**
- ✅ More reliable on cloud platforms
- ✅ Better deliverability
- ✅ Free tier: 100 emails/day
- ✅ Designed for transactional emails
- ✅ Better analytics

**Setup:**
- See `EMAIL_FIX_GUIDE.md` for SendGrid instructions
- Takes about 5 minutes to set up

---

## Security Best Practices

1. **Never commit app passwords to Git:**
   - Only store in Railway environment variables
   - Never share in code or documentation

2. **Rotate passwords regularly:**
   - Regenerate app passwords every 90 days
   - Revoke old ones immediately

3. **Use separate accounts:**
   - Consider using a dedicated Gmail account for your application
   - Don't use your personal Gmail

4. **Monitor usage:**
   - Check Gmail activity regularly
   - Set up alerts for unusual activity

---

## Quick Reference

**Gmail SMTP Settings:**
```
Host: smtp.gmail.com
Port: 587
Security: TLS
Username: your-email@gmail.com
Password: 16-character-app-password
```

**Railway Variables Needed:**
```
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_USE_SSL=False
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=your-email@gmail.com
FRONTEND_URL=https://heddyecommerce-production.up.railway.app
```

---

## Support

If you continue to have issues:

1. **Check Railway Logs:**
   - Look for detailed error messages
   - Check the timestamp of errors

2. **Verify Configuration:**
   - Double-check all environment variables
   - Make sure there are no typos

3. **Try SendGrid:**
   - More reliable for production
   - Better suited for cloud platforms

4. **Contact Support:**
   - Railway support: https://railway.app/help
   - Gmail support: https://support.google.com/mail

---

**Last Updated:** January 2025

