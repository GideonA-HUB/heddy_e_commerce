# Paystack Live Mode Setup Guide for HEDDIEKITCHEN

## Overview
This guide will help you configure Paystack Live Mode for production. Since your Paystack account is now live, you need to add the live keys to Railway and configure webhooks.

---

## 1. Railway Environment Variables (REQUIRED)

Add these **two environment variables** to your Railway project:

### Step 1: Go to Railway Dashboard
1. Open your Railway project: https://railway.app/dashboard
2. Click on your project
3. Go to **Variables** tab
4. Click **+ New Variable**

### Step 2: Add the Environment Variables

Add these two variables:

#### Variable 1: Live Public Key
- **Name:** `PAYSTACK_PUBLIC_KEY`
- **Value:** `pk_live_6cd16884207c8de0f84aae77` (or your actual live public key from Paystack)
- **Description:** Paystack Live Public Key (visible to frontend)

#### Variable 2: Live Secret Key
- **Name:** `PAYSTACK_SECRET_KEY`
- **Value:** `sk_live_xxxxxxxxxxxxx` (copy your **Live Secret Key** from Paystack dashboard - **NEVER share this!**)
- **Description:** Paystack Live Secret Key (server-side only, keep secret!)

### Step 3: Save and Redeploy
1. Click **Add** for each variable
2. Railway will automatically redeploy your application
3. Wait for deployment to complete

---

## 2. Understanding Paystack Dashboard Settings

### IP Whitelist (OPTIONAL - Usually NOT Needed)

**What it is:**
- IP Whitelist restricts which IP addresses can access your Paystack API keys
- It adds an extra layer of security

**Do you need it?**
- **NO, you usually don't need this** for Railway deployments because:
  - Railway uses dynamic IP addresses that change
  - Your backend runs on Railway's servers (not a fixed IP)
  - IP Whitelist would break your integration if Railway's IP changes

**When to use it:**
- Only if you have a dedicated server with a fixed IP address
- Only if you want to restrict API access to specific servers

**Recommendation:** **Leave IP Whitelist EMPTY** for Railway deployments.

---

### Live Callback URL (OPTIONAL - Legacy Feature)

**What it is:**
- The Callback URL is where Paystack redirects users **after they complete payment** on Paystack's payment page
- This is an **old method** that redirects users back to your website

**Do you need it?**
- **NO, this is optional** because:
  - Your code already sets a dynamic callback URL in the payment initialization (line 98 of `payments/views.py`)
  - Modern payment flows use **webhooks** instead (more reliable)
  - The callback URL in your code is: `https://heddiekitchen.com/order-confirmation/{order.id}/`

**What to set (if you want):**
- **Live Callback URL:** `https://heddiekitchen.com/order-confirmation/` (optional, can leave empty)

**Recommendation:** **Leave it empty** or use `https://heddiekitchen.com/order-confirmation/` as a fallback.

---

### Live Webhook URL (REQUIRED - Very Important!)

**What it is:**
- Webhook URL is where Paystack **sends payment status updates automatically**
- When a payment succeeds or fails, Paystack sends a POST request to this URL
- This is the **modern, reliable way** to handle payment status updates
- Webhooks work even if the user closes their browser

**Why it's important:**
- Automatically updates order status when payment completes
- Handles failed payments
- More reliable than callbacks (works even if user doesn't return to your site)
- Your code listens for webhook events at `/api/payments/webhook/`

**What to set:**

#### Option 1: Using Custom Domain (Recommended)
```
https://heddiekitchen.com/api/payments/webhook/
```

#### Option 2: Using Railway Domain (Fallback)
```
https://heddyecommerce-production.up.railway.app/api/payments/webhook/
```

**Steps to configure:**
1. In Paystack Dashboard → Settings → API Keys & Webhooks
2. Scroll to **"Live Webhook URL"** section
3. Enter the webhook URL (use Option 1 if your custom domain is configured, otherwise Option 2)
4. Click **"Save"** or **"Test Webhook"** to verify it works

**Events to Listen For:**
In Paystack Dashboard, select these events:
- ✅ **charge.success** - When payment is successful (REQUIRED)
- ✅ **charge.failed** - When payment fails (REQUIRED)
- ✅ **transfer.success** - When transfer is successful (optional, for payouts)
- ✅ **transfer.failed** - When transfer fails (optional, for payouts)

---

## 3. Complete Environment Variables Checklist

Here are **ALL** the environment variables you should have in Railway:

```bash
# Django Settings
SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=heddiekitchen.com,www.heddiekitchen.com,heddyecommerce-production.up.railway.app,*.railway.app
CORS_ALLOWED_ORIGINS=https://heddiekitchen.com,https://www.heddiekitchen.com
CSRF_TRUSTED_ORIGINS=https://heddiekitchen.com,https://www.heddiekitchen.com

# Database (Railway provides automatically)
DATABASE_URL=postgresql://... (provided by Railway)

# Email Configuration (Resend API with custom domain)
RESEND_API_KEY=re_xxxxxxxxxxxxx
DEFAULT_FROM_EMAIL=noreply@heddiekitchen.com
FRONTEND_URL=https://heddiekitchen.com

# Paystack Configuration (LIVE MODE - ADD THESE!)
PAYSTACK_PUBLIC_KEY=pk_live_6cd16884207c8de0f84aae77
PAYSTACK_SECRET_KEY=sk_live_xxxxxxxxxxxxx (your actual live secret key)

# Cloudinary (if using)
CLOUDINARY_URL=cloudinary://... (if using Cloudinary)
USE_CLOUDINARY=True

# Redis (optional, if using)
REDIS_URL=redis://... (if using Redis)
USE_REDIS_CACHE=True
```

---

## 4. Step-by-Step Setup Instructions

### Step 1: Copy Your Live Keys from Paystack

1. Go to Paystack Dashboard: https://dashboard.paystack.com/#/settings/developers
2. Make sure you're in **"Live Mode"** (green toggle should be ON)
3. Scroll to **"Live Secret Key"**
4. Click the **eye icon** to reveal your secret key
5. Click **"Copy"** button to copy the secret key
6. Also copy the **"Live Public Key"** (visible without revealing)

### Step 2: Add to Railway

1. Go to Railway Dashboard: https://railway.app/dashboard
2. Select your project
3. Go to **Variables** tab
4. Add the two variables:
   - `PAYSTACK_PUBLIC_KEY` = your live public key
   - `PAYSTACK_SECRET_KEY` = your live secret key
5. Click **"Add"** for each
6. Railway will automatically redeploy

### Step 3: Configure Webhook in Paystack

1. In Paystack Dashboard, go to **Settings → API Keys & Webhooks**
2. Scroll to **"Live Webhook URL"**
3. Enter: `https://heddiekitchen.com/api/payments/webhook/`
   - (Or use Railway domain if custom domain isn't configured yet)
4. Select events:
   - ✅ `charge.success`
   - ✅ `charge.failed`
5. Click **"Save"** or **"Test Webhook"**

### Step 4: Test the Integration

1. Go to your website: https://heddiekitchen.com
2. Add items to cart
3. Go to checkout
4. Use a **real test card** (Paystack test cards won't work in live mode)
5. Complete payment
6. Check that:
   - Order status updates to "paid"
   - Webhook is received (check PaystackWebhook logs in Django admin)
   - Order confirmation email is sent

---

## 5. Security Best Practices

### ✅ DO:
- ✅ Keep your **Live Secret Key** secret (never commit to git, never share)
- ✅ Use environment variables (Railway) - ✅ Already done!
- ✅ Use HTTPS for all URLs - ✅ Already configured!
- ✅ Verify webhook signatures - ✅ Already implemented in code!
- ✅ Monitor webhook logs in Django admin
- ✅ Test payments in test mode before going live

### ❌ DON'T:
- ❌ Never commit secret keys to git
- ❌ Never share secret keys publicly
- ❌ Never use test keys in production
- ❌ Don't use IP Whitelist on Railway (dynamic IPs)

---

## 6. Testing Checklist

After setup, test these scenarios:

- [ ] Payment initialization works (user can click "Pay Now")
- [ ] Payment page loads correctly
- [ ] Real payment succeeds and updates order status
- [ ] Webhook is received and processed (check Django admin → Payments → PaystackWebhook)
- [ ] Order confirmation email is sent after successful payment
- [ ] Failed payment is handled correctly
- [ ] Order status updates correctly in admin

---

## 7. Troubleshooting

### Problem: "Paystack secret key not configured" error
**Solution:** Make sure `PAYSTACK_SECRET_KEY` is added to Railway environment variables and deployment has completed.

### Problem: Webhook not being received
**Solution:**
1. Check webhook URL is correct in Paystack dashboard
2. Verify your domain is accessible (test: `https://heddiekitchen.com/api/payments/webhook/`)
3. Check Railway logs for webhook requests
4. Check Django admin → Payments → PaystackWebhook for webhook logs

### Problem: Payment succeeds but order status doesn't update
**Solution:**
1. Check webhook is configured correctly
2. Check PaystackWebhook logs in Django admin
3. Verify webhook signature verification is working
4. Check Railway logs for errors

### Problem: "Invalid signature" error in webhook
**Solution:**
- Make sure `PAYSTACK_SECRET_KEY` in Railway matches the one in Paystack dashboard
- Redeploy after changing secret key
- Clear webhook logs and try again

---

## 8. Quick Reference

### Webhook URL (Add to Paystack):
```
https://heddiekitchen.com/api/payments/webhook/
```

### Callback URL (Optional, already handled in code):
```
https://heddiekitchen.com/order-confirmation/
```

### Environment Variables to Add to Railway:
```
PAYSTACK_PUBLIC_KEY=pk_live_6cd16884207c8de0f84aae77
PAYSTACK_SECRET_KEY=sk_live_your_actual_secret_key_here
```

### IP Whitelist:
**Leave EMPTY** (not needed for Railway)

---

## 9. Support

- **Paystack Support:** support@paystack.com
- **Paystack Docs:** https://paystack.com/docs
- **Check webhook logs:** Django Admin → Payments → PaystackWebhook
- **Check payment logs:** Django Admin → Payments → Payment

---

**Remember:** After adding environment variables to Railway, wait for the deployment to complete before testing payments!
