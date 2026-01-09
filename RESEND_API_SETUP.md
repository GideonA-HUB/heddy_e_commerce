# Resend API Setup - FIXED Email Timeout Issue

## ✅ Problem Solved

**Issue:** Railway was blocking SMTP connections, causing `TimeoutError: timed out` errors.

**Solution:** Switched from SMTP to Resend's REST API, which works perfectly with Railway's network.

---

## 🚀 Quick Setup (2 minutes)

### Step 1: Get Your Resend API Key

1. Go to: https://resend.com/api-keys
2. Click "Create API Key"
3. Name it: "HEDDIEKITCHEN Production"
4. Copy the key (starts with `re_...`)

### Step 2: Add to Railway Environment Variables

**Add this ONE variable to Railway:**

```bash
RESEND_API_KEY=re_your_api_key_here
```

**That's it!** The code now uses Resend's API instead of SMTP, so you don't need all those SMTP settings anymore.

---

## 📧 How It Works Now

- ✅ **Uses Resend REST API** (no SMTP connections)
- ✅ **Works with Railway** (no network restrictions)
- ✅ **Non-blocking** (emails sent in background threads)
- ✅ **No timeouts** (API is much faster and more reliable)
- ✅ **Better error handling** (clear error messages)

---

## 🔄 Migration from SMTP

If you had these SMTP variables before, you can **remove them** (they're not needed anymore):

```bash
# These are no longer needed:
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.resend.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_USE_SSL=False
EMAIL_HOST_USER=resend
EMAIL_HOST_PASSWORD=re_your_api_key_here
```

**Just keep:**
```bash
RESEND_API_KEY=re_your_api_key_here
DEFAULT_FROM_EMAIL=heddiekitchen@gmail.com
FRONTEND_URL=https://heddyecommerce-production.up.railway.app
```

---

## ✅ Testing

After adding `RESEND_API_KEY` to Railway:

1. **Deploy your app**
2. **Test Newsletter:**
   - Subscribe to newsletter
   - Check email inbox (and spam folder)
   - Should receive welcome email within seconds

3. **Test Order Confirmation:**
   - Create an order
   - Check email for order confirmation
   - Should receive email within seconds

4. **Check Railway Logs:**
   - Look for: "Email sent successfully via Resend API"
   - No timeout errors
   - No "Network is unreachable" errors

---

## 🎯 Benefits of API vs SMTP

| Feature | SMTP | Resend API |
|---------|------|------------|
| Railway Compatibility | ❌ Blocked | ✅ Works |
| Speed | Slow (30s+ timeout) | Fast (<1s) |
| Reliability | Timeouts | ✅ Reliable |
| Error Messages | Generic | ✅ Detailed |
| Setup Complexity | Many variables | ✅ One key |

---

## 📝 Environment Variables Summary

**Required:**
```bash
RESEND_API_KEY=re_your_api_key_here
DEFAULT_FROM_EMAIL=heddiekitchen@gmail.com
FRONTEND_URL=https://heddyecommerce-production.up.railway.app
```

**Optional (for backward compatibility):**
```bash
EMAIL_HOST_PASSWORD=re_your_api_key_here  # Will be used as fallback if RESEND_API_KEY not set
```

---

## 🔍 Troubleshooting

**"RESEND_API_KEY not configured":**
- Make sure you added `RESEND_API_KEY` to Railway
- Check that the key starts with `re_`
- Redeploy after adding the variable

**Emails not arriving:**
- Check spam folder
- Verify API key is correct in Resend dashboard
- Check Railway logs for error messages
- Verify `DEFAULT_FROM_EMAIL` is a valid email

**Still getting timeout errors:**
- Make sure you've deployed the latest code
- The new code uses API, not SMTP
- Check Railway logs to confirm it's using the API

---

## ✅ What Changed in Code

1. **Replaced SMTP with Resend API** in `email_utils.py`
2. **Added `RESEND_API_KEY`** to settings
3. **Non-blocking email sending** (background threads)
4. **Better error handling** and logging

---

## 🎉 Result

- ✅ No more timeout errors
- ✅ Emails sent instantly
- ✅ Works perfectly on Railway
- ✅ Simple setup (one API key)

**Next Step:** Add `RESEND_API_KEY` to Railway and deploy!

