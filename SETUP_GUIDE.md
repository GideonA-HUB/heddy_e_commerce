# HEDDIEKITCHEN Setup Guide

## 1. Fixed Issues

### ✅ Cart Double-Add Issue
**Problem:** Clicking "Add to Cart" once was adding items twice.

**Solution:** 
- Removed duplicate `addItem` calls in `HomePage.tsx` and `MenuPage.tsx`
- The `onAddToCart` callback is now only used for UI feedback, not for actually adding items
- The actual cart addition is handled only in `MenuItemCard.tsx`

**Files Modified:**
- `frontend/src/components/MenuItemCard.tsx`
- `frontend/src/pages/HomePage.tsx`
- `frontend/src/pages/MenuPage.tsx`

---

## 2. Email Notifications Setup

### Email Configuration for Railway

Add these environment variables to your Railway project:

```bash
# Email Backend (use SMTP for production)
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend

# Gmail SMTP Configuration (Recommended)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_USE_SSL=False
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-specific-password

# Alternative: SendGrid (More reliable for production)
# EMAIL_HOST=smtp.sendgrid.net
# EMAIL_PORT=587
# EMAIL_HOST_USER=apikey
# EMAIL_HOST_PASSWORD=your-sendgrid-api-key

# Default From Email
DEFAULT_FROM_EMAIL=heddiekitchen@gmail.com

# Frontend URL (for email links)
FRONTEND_URL=https://heddyecommerce-production.up.railway.app
```

### Setting Up Gmail for Email Sending

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Enter "HEDDIEKITCHEN" as the name
   - Copy the 16-character password
   - Use this password as `EMAIL_HOST_PASSWORD`

3. **Alternative: Use SendGrid (Recommended for Production)**
   - Sign up at: https://sendgrid.com
   - Create an API key
   - Use SendGrid SMTP settings above

### Email Features Implemented

✅ **Newsletter Welcome Email**
- Sent automatically when users subscribe
- Includes welcome message and benefits

✅ **Order Confirmation Email**
- Sent automatically when an order is created
- Includes:
  - Order number and details
  - Complete itemized receipt
  - Delivery information
  - Estimated delivery time
  - Order tracking link
  - Contact information

---

## 3. Paystack Integration Setup

### Step 1: Register for Paystack Account

1. **Visit Paystack:** https://paystack.com
2. **Click "Get Started"** or "Sign Up"
3. **Choose Account Type:**
   - Select "Business" account
   - Fill in your business details:
     - Business name: HEDDIEKITCHEN
     - Business type: Food & Beverage / Restaurant
     - Business address: Abuja, Nigeria
     - Phone: +234 903 523 4365
     - Email: heddiekitchen@gmail.com

4. **Verify Your Email:**
   - Check your email inbox
   - Click the verification link

### Step 2: Complete Business Verification

1. **Business Information:**
   - Upload business registration documents (if available)
   - Or use personal information for sole proprietorship
   - Provide bank account details for payouts

2. **Bank Account Setup:**
   - Add your Nigerian bank account
   - This is where Paystack will send your payments
   - Verify the account with test deposits

3. **Identity Verification:**
   - Upload a valid ID (National ID, Driver's License, or International Passport)
   - Take a selfie for verification

### Step 3: Get Your API Keys

1. **Login to Paystack Dashboard:** https://dashboard.paystack.com

2. **Navigate to Settings:**
   - Click on "Settings" in the sidebar
   - Select "API Keys & Webhooks"

3. **Get Test Keys (for Development):**
   - Scroll to "Test Keys"
   - Copy the **Public Key** (starts with `pk_test_...`)
   - Copy the **Secret Key** (starts with `sk_test_...`)

4. **Get Live Keys (for Production):**
   - After verification is complete, scroll to "Live Keys"
   - Copy the **Public Key** (starts with `pk_live_...`)
   - Copy the **Secret Key** (starts with `sk_live_...`)

### Step 4: Set Up Webhook

1. **In Paystack Dashboard:**
   - Go to Settings → API Keys & Webhooks
   - Scroll to "Webhooks"

2. **Add Webhook URL:**
   ```
   https://heddyecommerce-production.up.railway.app/api/payments/webhook/
   ```

3. **Select Events to Listen For:**
   - ✅ `charge.success` - When payment is successful
   - ✅ `charge.failed` - When payment fails
   - ✅ `transfer.success` - When transfer is successful
   - ✅ `transfer.failed` - When transfer fails

4. **Save the Webhook**

### Step 5: Configure Railway Environment Variables

Add these to your Railway project:

```bash
# Paystack Configuration
PAYSTACK_PUBLIC_KEY=pk_live_your_live_public_key_here
PAYSTACK_SECRET_KEY=sk_live_your_live_secret_key_here

# For testing (use test keys)
# PAYSTACK_PUBLIC_KEY=pk_test_your_test_public_key_here
# PAYSTACK_SECRET_KEY=sk_test_your_test_secret_key_here
```

### Step 6: Test the Integration

1. **Test Mode:**
   - Use test keys in development
   - Use Paystack test cards:
     - Card: `4084 0840 8408 4081`
     - CVV: `408`
     - Expiry: Any future date
     - PIN: `0000`

2. **Live Mode:**
   - Switch to live keys after testing
   - Real payments will be processed

### Paystack Features Already Implemented

✅ **Payment Initialization**
- Creates payment records
- Generates Paystack payment links
- Handles payment callbacks

✅ **Webhook Handling**
- Processes payment success/failure events
- Updates order status automatically
- Logs all webhook events

✅ **Payment Verification**
- Verifies transaction status
- Updates payment records
- Handles refunds (if needed)

---

## 4. Complete Railway Environment Variables

Here's the complete list of environment variables you need in Railway:

```bash
# Django Settings
SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=heddyecommerce-production.up.railway.app,*.railway.app
CORS_ALLOWED_ORIGINS=https://heddyecommerce-production.up.railway.app
CSRF_TRUSTED_ORIGINS=https://heddyecommerce-production.up.railway.app

# Database (Railway provides this automatically)
DATABASE_URL=postgresql://...

# Email Configuration
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_USE_SSL=False
EMAIL_HOST_USER=heddiekitchen@gmail.com
EMAIL_HOST_PASSWORD=your-gmail-app-password
DEFAULT_FROM_EMAIL=heddiekitchen@gmail.com
FRONTEND_URL=https://heddyecommerce-production.up.railway.app

# Paystack Configuration
PAYSTACK_PUBLIC_KEY=pk_live_your_live_public_key
PAYSTACK_SECRET_KEY=sk_live_your_live_secret_key

# Cloudinary (if using)
CLOUDINARY_URL=cloudinary://...
USE_CLOUDINARY=True

# Redis (if using)
REDIS_URL=redis://...

# Sentry (optional)
SENTRY_DSN=your-sentry-dsn
```

---

## 5. Testing Checklist

### Email Testing
- [ ] Subscribe to newsletter - check for welcome email
- [ ] Place a test order - check for order confirmation email
- [ ] Verify email links work correctly
- [ ] Check email formatting on mobile devices

### Paystack Testing
- [ ] Test payment with test card
- [ ] Verify webhook receives events
- [ ] Check order status updates after payment
- [ ] Test payment failure handling
- [ ] Verify payment records in admin

### Cart Testing
- [ ] Add single item - verify quantity is 1
- [ ] Add same item again - verify quantity increases to 2
- [ ] Add different items - verify all items in cart
- [ ] Check cart count in navbar

---

## 6. Support & Resources

### Paystack Resources
- **Documentation:** https://paystack.com/docs
- **API Reference:** https://paystack.com/docs/api
- **Support:** support@paystack.com
- **Status Page:** https://status.paystack.com

### Email Resources
- **Gmail App Passwords:** https://support.google.com/accounts/answer/185833
- **SendGrid Docs:** https://docs.sendgrid.com

### Troubleshooting

**Email not sending?**
- Check EMAIL_HOST_PASSWORD is correct
- Verify EMAIL_USE_TLS is True for Gmail
- Check Railway logs for email errors
- Test with console backend first: `EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend`

**Paystack webhook not working?**
- Verify webhook URL is correct
- Check webhook signature in Paystack dashboard
- Review webhook logs in Django admin
- Ensure PAYSTACK_SECRET_KEY matches webhook secret

**Cart still adding duplicates?**
- Clear browser cache
- Check browser console for errors
- Verify frontend is using latest code

---

## 7. Security Notes

⚠️ **Important Security Practices:**

1. **Never commit API keys to Git**
   - All sensitive keys should be in environment variables only

2. **Use different keys for test and production**
   - Test keys: `pk_test_...` and `sk_test_...`
   - Live keys: `pk_live_...` and `sk_live_...`

3. **Rotate keys regularly**
   - Change Paystack keys every 90 days
   - Update email passwords if compromised

4. **Monitor webhook logs**
   - Check PaystackWebhook model in admin regularly
   - Investigate any failed webhook events

5. **Use HTTPS in production**
   - Railway provides SSL automatically
   - Never use HTTP for payment processing

---

## 8. Next Steps

1. ✅ Add environment variables to Railway
2. ✅ Complete Paystack account verification
3. ✅ Set up Gmail app password or SendGrid
4. ✅ Test email sending with newsletter subscription
5. ✅ Test payment flow with Paystack test cards
6. ✅ Switch to live Paystack keys after testing
7. ✅ Monitor email delivery and payment processing

---

**Last Updated:** January 2025
**Version:** 1.0

