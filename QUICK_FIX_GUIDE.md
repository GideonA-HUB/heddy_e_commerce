# Quick Fix Guide - Payment & Email Issues

## 🚨 URGENT FIXES NEEDED

### Issue 1: Payment Initialization Failing

**Error:** `TransactionResource.__init__() missing 1 required positional argument: 'api_secret'`

**✅ FIXED:** Changed Paystack integration to use direct API calls instead of the library.

**What You Need to Do:**
1. **Get Paystack Keys:**
   - Go to: https://dashboard.paystack.com
   - Login to your Paystack account
   - Go to Settings → API Keys & Webhooks
   - Copy your **Live Secret Key** (starts with `sk_live_...`)
   - Copy your **Live Public Key** (starts with `pk_live_...`)

2. **Add to Railway Environment Variables:**
   ```bash
   PAYSTACK_PUBLIC_KEY=pk_live_your_live_public_key_here
   PAYSTACK_SECRET_KEY=sk_live_your_live_secret_key_here
   ```

3. **Test:**
   - Try creating an order
   - Click "Continue to Payment"
   - Should redirect to Paystack payment page

---

### Issue 2: Email Not Sending (Network Unreachable)

**Error:** `[Errno 101] Network is unreachable`

**Problem:** Railway blocks direct SMTP connections to Gmail.

**✅ SOLUTION:** Use Resend (Easiest) or another email service.

#### Quick Setup with Resend (5 minutes):

1. **Sign Up:**
   - Go to: https://resend.com
   - Click "Get Started"
   - Sign up (no credit card needed)

2. **Get API Key:**
   - After signup, go to "API Keys"
   - Click "Create API Key"
   - Name: "HEDDIEKITCHEN Production"
   - Copy the key (starts with `re_...`)

3. **⚠️ IMPORTANT - Domain Verification:**
   - **Railway domains (heddyecommerce-production.up.railway.app) don't support custom DNS records**
   - **You can skip domain verification!** Resend will still work without it
   - Emails will be sent from Resend's verified domain (works perfectly fine)
   - See `RESEND_SETUP_RAILWAY_DOMAIN.md` for details

4. **Add to Railway:**
   ```bash
   EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
   EMAIL_HOST=smtp.resend.com
   EMAIL_PORT=587
   EMAIL_USE_TLS=True
   EMAIL_USE_SSL=False
   EMAIL_HOST_USER=resend
   EMAIL_HOST_PASSWORD=re_your_api_key_here
   DEFAULT_FROM_EMAIL=heddiekitchen@gmail.com
   FRONTEND_URL=https://heddyecommerce-production.up.railway.app
   ```

5. **Test:**
   - Subscribe to newsletter
   - Check email inbox (and spam folder)
   - Create an order
   - Check for order confirmation email

---

## Complete Railway Environment Variables

Add ALL of these to Railway:

```bash
# Paystack (REQUIRED for payments)
PAYSTACK_PUBLIC_KEY=pk_live_your_live_public_key
PAYSTACK_SECRET_KEY=sk_live_your_live_secret_key

# Email - Resend (REQUIRED for emails)
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.resend.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_USE_SSL=False
EMAIL_HOST_USER=resend
EMAIL_HOST_PASSWORD=re_your_resend_api_key
DEFAULT_FROM_EMAIL=heddiekitchen@gmail.com
FRONTEND_URL=https://heddyecommerce-production.up.railway.app

# Other existing variables (keep these)
SECRET_KEY=your-secret-key
DEBUG=False
ALLOWED_HOSTS=heddyecommerce-production.up.railway.app,*.railway.app
# ... (all your other existing variables)
```

---

## What Was Fixed in Code

### ✅ Payment Initialization
- Changed from Paystack library to direct API calls
- Added proper error handling
- Added check for missing Paystack keys
- Fixed to use `order.total` instead of `order.total_amount`

### ✅ Email Sending
- Made email sending non-blocking (background threads)
- Added better error logging
- Added email configuration checks
- Fixed email template errors

---

## Testing Checklist

After adding the environment variables:

- [ ] **Test Newsletter:**
  - Subscribe with your email
  - Check inbox (and spam folder)
  - Should receive welcome email

- [ ] **Test Order:**
  - Add items to cart
  - Go to checkout
  - Fill shipping information
  - Click "Continue to Payment"
  - Should redirect to Paystack
  - Check email for order confirmation

- [ ] **Check Railway Logs:**
  - Look for "email sent successfully" messages
  - No "Network is unreachable" errors
  - No Paystack initialization errors

---

## If You Still Have Issues

### Payment Not Working:
1. Verify Paystack keys are correct in Railway
2. Check Paystack dashboard for any account issues
3. Make sure you're using **Live** keys (not test keys)
4. Check Railway logs for specific error messages

### Email Not Working:
1. Verify Resend API key is correct
2. Check Resend dashboard for email logs
3. Check spam folder
4. Try a different email service (see EMAIL_ALTERNATIVES.md)

---

## Support

**Paystack Support:**
- Dashboard: https://dashboard.paystack.com
- Docs: https://paystack.com/docs
- Support: support@paystack.com

**Resend Support:**
- Dashboard: https://resend.com
- Docs: https://resend.com/docs
- Support: support@resend.com

---

**Priority Actions:**
1. ⚡ Add Paystack keys to Railway (REQUIRED for payments)
2. ⚡ Set up Resend and add email config to Railway (REQUIRED for emails)
3. ⚡ Test both features
4. ⚡ Deploy and verify everything works

---

**Last Updated:** January 2025

