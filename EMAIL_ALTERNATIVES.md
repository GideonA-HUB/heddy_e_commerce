# Email Service Alternatives for Railway

Since Railway blocks direct SMTP connections and you can't use SendGrid, here are alternative email services that work well:

## Option 1: Resend (Recommended - Easiest Setup)

**Why Resend:**
- ✅ Free tier: 3,000 emails/month
- ✅ Very easy to set up
- ✅ Works perfectly with Railway
- ✅ Simple API
- ✅ Great deliverability

**Setup Steps:**

1. **Sign up:**
   - Go to: https://resend.com
   - Click "Get Started"
   - Sign up with your email (no credit card required for free tier)

2. **Get API Key:**
   - After signup, go to API Keys
   - Click "Create API Key"
   - Name it "HEDDIEKITCHEN Production"
   - Copy the API key (starts with `re_...`)

3. **Add to Railway:**
   ```bash
   EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
   EMAIL_HOST=smtp.resend.com
   EMAIL_PORT=587
   EMAIL_USE_TLS=True
   EMAIL_USE_SSL=False
   EMAIL_HOST_USER=resend
   EMAIL_HOST_PASSWORD=your-resend-api-key-here
   DEFAULT_FROM_EMAIL=heddiekitchen@gmail.com
   FRONTEND_URL=https://heddyecommerce-production.up.railway.app
   ```

4. **Verify Domain (Optional but Recommended):**
   - In Resend dashboard, go to Domains
   - Add your domain (heddyecommerce-production.up.railway.app)
   - Add the DNS records they provide
   - This improves deliverability

---

## Option 2: Mailgun

**Why Mailgun:**
- ✅ Free tier: 5,000 emails/month for 3 months, then 1,000/month
- ✅ Reliable and established
- ✅ Good documentation

**Setup Steps:**

1. **Sign up:**
   - Go to: https://www.mailgun.com
   - Click "Sign Up"
   - Choose the free plan

2. **Get API Key:**
   - After signup, go to Settings → API Keys
   - Copy your "Private API key"

3. **Add to Railway:**
   ```bash
   EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
   EMAIL_HOST=smtp.mailgun.org
   EMAIL_PORT=587
   EMAIL_USE_TLS=True
   EMAIL_USE_SSL=False
   EMAIL_HOST_USER=postmaster@your-domain.mailgun.org
   EMAIL_HOST_PASSWORD=your-mailgun-api-key
   DEFAULT_FROM_EMAIL=heddiekitchen@gmail.com
   FRONTEND_URL=https://heddyecommerce-production.up.railway.app
   ```

---

## Option 3: Postmark

**Why Postmark:**
- ✅ Free tier: 100 emails/month
- ✅ Excellent deliverability
- ✅ Great for transactional emails

**Setup Steps:**

1. **Sign up:**
   - Go to: https://postmarkapp.com
   - Click "Sign Up"
   - Choose free plan

2. **Get Server API Token:**
   - After signup, create a Server
   - Copy the "Server API Token"

3. **Add to Railway:**
   ```bash
   EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
   EMAIL_HOST=smtp.postmarkapp.com
   EMAIL_PORT=587
   EMAIL_USE_TLS=True
   EMAIL_USE_SSL=False
   EMAIL_HOST_USER=your-server-api-token
   EMAIL_HOST_PASSWORD=your-server-api-token
   DEFAULT_FROM_EMAIL=heddiekitchen@gmail.com
   FRONTEND_URL=https://heddyecommerce-production.up.railway.app
   ```

---

## Option 4: Use Console Backend (For Testing Only)

If you just need to test and don't need real emails right now:

```bash
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
```

This will print emails to Railway logs instead of sending them. **Only use for testing!**

---

## Recommended: Use Resend

I recommend **Resend** because:
1. Easiest to set up (5 minutes)
2. Generous free tier (3,000 emails/month)
3. Works perfectly with Railway
4. No domain verification needed initially
5. Great documentation

**Quick Setup:**
1. Sign up at https://resend.com
2. Get API key
3. Add to Railway:
   ```
   EMAIL_HOST=smtp.resend.com
   EMAIL_PORT=587
   EMAIL_USE_TLS=True
   EMAIL_HOST_USER=resend
   EMAIL_HOST_PASSWORD=re_your_api_key_here
   ```

---

## Testing After Setup

1. **Subscribe to newsletter** - Check email inbox
2. **Create an order** - Check for order confirmation email
3. **Check Railway logs** - Look for "email sent successfully" messages
4. **Check spam folder** - Emails might go there initially

---

## Troubleshooting

**"Network is unreachable":**
- Railway blocks direct SMTP to Gmail
- Use one of the services above instead

**Emails not arriving:**
- Check spam folder
- Verify API key is correct
- Check Railway logs for errors
- Verify sender email matches your account

**"Authentication failed":**
- Check API key/username is correct
- Make sure password field has the API key
- Verify the service is activated

---

**Next Steps:**
1. Choose an email service (Resend recommended)
2. Sign up and get API key
3. Add environment variables to Railway
4. Test newsletter subscription
5. Test order confirmation

