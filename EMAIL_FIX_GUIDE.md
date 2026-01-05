# Email Configuration Fix Guide

## Issues Fixed

### 1. ✅ Order Creation 400 Error
**Problem:** Required fields `shipping_city` and `shipping_state` were causing validation errors when empty.

**Solution:**
- Made `shipping_city` and `shipping_state` optional in the serializer
- Added better error messages to show validation details
- Fixed shipping fee calculation to match frontend (₦5,000)

### 2. ✅ Email Network Unreachable Error
**Problem:** Email sending was failing with "Network is unreachable" error, likely because Railway blocks direct SMTP connections.

**Solution:**
- Added email configuration checks before attempting to send
- Changed `fail_silently=True` to prevent blocking
- Added better error logging
- Made email sending asynchronous (non-blocking)

### 3. ✅ CSRF Token Error
**Problem:** Some endpoints were getting CSRF errors.

**Solution:**
- Added `permission_classes=[permissions.AllowAny]` to `create_order` endpoint
- CSRF middleware already exempts `/api/` endpoints

## Email Configuration for Railway

Railway may block direct SMTP connections. Here are two solutions:

### Option 1: Use SendGrid (Recommended)

SendGrid is more reliable for production and works well with Railway.

1. **Sign up for SendGrid:**
   - Go to: https://sendgrid.com
   - Create a free account (100 emails/day free)
   - Verify your email

2. **Create API Key:**
   - Go to Settings → API Keys
   - Click "Create API Key"
   - Name it "HEDDIEKITCHEN Production"
   - Give it "Full Access" or "Mail Send" permissions
   - Copy the API key (you'll only see it once!)

3. **Add to Railway Environment Variables:**
   ```bash
   EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
   EMAIL_HOST=smtp.sendgrid.net
   EMAIL_PORT=587
   EMAIL_USE_TLS=True
   EMAIL_USE_SSL=False
   EMAIL_HOST_USER=apikey
   EMAIL_HOST_PASSWORD=your-sendgrid-api-key-here
   DEFAULT_FROM_EMAIL=heddiekitchen@gmail.com
   FRONTEND_URL=https://heddyecommerce-production.up.railway.app
   ```

### Option 2: Use Gmail with App Password

If you prefer Gmail, you need to:

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Enter "HEDDIEKITCHEN Railway"
   - Copy the 16-character password

3. **Add to Railway Environment Variables:**
   ```bash
   EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USE_TLS=True
   EMAIL_USE_SSL=False
   EMAIL_HOST_USER=heddiekitchen@gmail.com
   EMAIL_HOST_PASSWORD=your-16-character-app-password
   DEFAULT_FROM_EMAIL=heddiekitchen@gmail.com
   FRONTEND_URL=https://heddyecommerce-production.up.railway.app
   ```

**Note:** Gmail may still have issues with Railway's network. SendGrid is more reliable.

## Testing Email

After configuring email:

1. **Test Newsletter Subscription:**
   - Subscribe to newsletter
   - Check logs for "Newsletter welcome email sent successfully"
   - Check your email inbox

2. **Test Order Confirmation:**
   - Create a test order
   - Check logs for "Order confirmation email sent successfully"
   - Check your email inbox

3. **Check Logs:**
   - If email fails, check Railway logs for detailed error messages
   - Look for "Error sending..." messages with traceback

## Email Features

✅ **Newsletter Welcome Email**
- Sent automatically when users subscribe
- Includes welcome message and benefits
- Sent in background (non-blocking)

✅ **Order Confirmation Email**
- Sent automatically when order is created
- Includes complete order details and receipt
- Sent in background (non-blocking)

## Troubleshooting

**"Network is unreachable" error:**
- Railway may be blocking SMTP connections
- Solution: Use SendGrid instead of Gmail
- Or check Railway's network policies

**"Email not configured" message:**
- Check that `EMAIL_HOST_USER` and `EMAIL_HOST_PASSWORD` are set in Railway
- Verify the values are correct

**Emails not arriving:**
- Check spam/junk folder
- Verify email address is correct
- Check SendGrid/Gmail dashboard for delivery status
- Review Railway logs for errors

**Email sending slowly:**
- Emails are sent in background threads (non-blocking)
- This is normal - the request returns immediately
- Check logs to confirm emails are being sent

## Current Status

✅ Order creation validation fixed
✅ Email sending made non-blocking
✅ Better error handling and logging
✅ Shipping fee calculation fixed
⏳ Email configuration needs to be set up in Railway (see above)

---

**Next Steps:**
1. Set up SendGrid account (recommended) or Gmail app password
2. Add email environment variables to Railway
3. Test newsletter subscription
4. Test order creation and confirmation email

