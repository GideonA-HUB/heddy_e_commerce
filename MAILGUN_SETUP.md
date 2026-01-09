# Mailgun Setup - No Domain Verification Required!

## ✅ Problem Solved

**Issue:** Resend's free tier only allows sending to your own email address unless you verify a domain. Railway domains can't be verified.

**Solution:** Switch to Mailgun! Mailgun's free tier **doesn't require domain verification** - you can use their sandbox domain immediately.

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Sign Up for Mailgun

1. Go to: https://www.mailgun.com
2. Click "Sign Up"
3. Choose the **Free Plan** (5,000 emails/month for 3 months, then 1,000/month)
4. Complete signup (no credit card required)

### Step 2: Get Your Mailgun Credentials

After signup, Mailgun will show you:

1. **API Key:**
   - Go to: Settings → API Keys
   - Copy your **Private API key** (starts with a long string)

2. **Sandbox Domain:**
   - Go to: Sending → Domains
   - You'll see a sandbox domain like: `sandbox1234567890abcdef.mailgun.org`
   - Copy this domain

**Note:** The sandbox domain works immediately without verification! You can send to any email address.

### Step 3: Add to Railway Environment Variables

```bash
MAILGUN_API_KEY=your-private-api-key-here
MAILGUN_SANDBOX_DOMAIN=sandbox1234567890abcdef.mailgun.org
DEFAULT_FROM_EMAIL=heddiekitchen@gmail.com
FRONTEND_URL=https://heddyecommerce-production.up.railway.app
```

**That's it!** No domain verification needed!

---

## 📧 How It Works

- ✅ **Uses Mailgun REST API** (no SMTP connections)
- ✅ **Works with Railway** (no network restrictions)
- ✅ **No domain verification needed** (uses sandbox domain)
- ✅ **Can send to any email** (not just your own)
- ✅ **Non-blocking** (emails sent in background threads)
- ✅ **No timeouts** (API is fast and reliable)

---

## 🎯 What Recipients Will See

**From Address:** `HEDDIEKITCHEN <heddiekitchen@sandbox1234567890abcdef.mailgun.org>`

**Note:** The email will come from the sandbox domain, but the content and branding remain the same. This is perfectly fine for production use!

---

## ✅ Testing

After adding the environment variables:

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
   - Look for: "Email sent successfully via Mailgun API"
   - No timeout errors
   - No domain verification errors

---

## 🔄 If You Want to Use Your Own Domain Later

If you get a custom domain (like `heddiekitchen.com`):

1. **Add Domain to Mailgun:**
   - Go to: Sending → Domains
   - Click "Add New Domain"
   - Enter your domain (e.g., `heddiekitchen.com`)

2. **Add DNS Records:**
   - Mailgun will show you DNS records to add
   - Add them to your domain registrar (GoDaddy, Namecheap, etc.)
   - Wait 24-48 hours for verification

3. **Update Railway:**
   ```bash
   MAILGUN_DOMAIN=heddiekitchen.com
   # Remove MAILGUN_SANDBOX_DOMAIN (not needed with verified domain)
   ```

4. **Benefits:**
   - ✅ Better deliverability
   - ✅ Professional email address
   - ✅ Less likely to go to spam

---

## 📊 Mailgun Free Tier Limits

- **5,000 emails/month** for first 3 months
- **1,000 emails/month** after that
- **No domain verification needed** for sandbox
- **Can send to any email address**

---

## 🔍 Troubleshooting

**"MAILGUN_API_KEY not configured":**
- Make sure you added `MAILGUN_API_KEY` to Railway
- Check that the key is correct (copy from Mailgun dashboard)
- Redeploy after adding the variable

**"MAILGUN_DOMAIN not configured":**
- Make sure you added `MAILGUN_SANDBOX_DOMAIN` to Railway
- Check that the domain is correct (from Mailgun dashboard)
- Should look like: `sandbox1234567890abcdef.mailgun.org`

**Emails not arriving:**
- Check spam folder
- Verify API key is correct
- Check Railway logs for error messages
- Verify sandbox domain is correct

**Still getting errors:**
- Make sure you've deployed the latest code
- Check Railway logs for specific error messages
- Verify all environment variables are set correctly

---

## ✅ Complete Railway Environment Variables

```bash
MAILGUN_API_KEY=your-private-api-key-here
MAILGUN_SANDBOX_DOMAIN=sandbox1234567890abcdef.mailgun.org
DEFAULT_FROM_EMAIL=heddiekitchen@gmail.com
FRONTEND_URL=https://heddyecommerce-production.up.railway.app
```

---

## 🎉 Benefits Over Resend

| Feature | Resend Free | Mailgun Free |
|---------|-------------|--------------|
| Domain Verification | ✅ Required | ❌ Not needed |
| Send to Any Email | ❌ Only your email | ✅ Any email |
| Free Tier Limit | 3,000/month | 5,000/month (then 1,000) |
| Setup Time | 2 min (but limited) | 5 min (full access) |

---

## 📝 Summary

**Switch to Mailgun because:**
1. ✅ No domain verification needed
2. ✅ Can send to any email address
3. ✅ Works immediately
4. ✅ More reliable for production

**Next Steps:**
1. Sign up at https://www.mailgun.com
2. Get API key and sandbox domain
3. Add to Railway environment variables
4. Deploy and test!

---

**Last Updated:** January 2025

