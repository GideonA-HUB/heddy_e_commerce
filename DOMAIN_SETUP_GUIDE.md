# Complete Domain Setup Guide - heddiekitchen.com

## 🎯 Overview

You've purchased `heddiekitchen.com` from Namecheap. This guide will help you:
1. ✅ Set up the domain on Railway
2. ✅ Configure DNS records on Namecheap
3. ✅ Set up Resend email with your verified domain

---

## 📋 Part 1: Railway Domain Setup

### Step 1: Add Custom Domain to Railway

1. **Go to Railway Dashboard:**
   - Open: https://railway.app
   - Login to your account
   - Select your project: `heddyecommerce-production` (or your project name)

2. **Add Custom Domain:**
   - Click on your project
   - Click on "Settings" tab (or your service/deployment)
   - Scroll down to "Domains" section
   - Click "Add Domain" or "Custom Domain"
   - Enter: `heddiekitchen.com`
   - Click "Add" or "Save"

3. **Railway will generate:**
   - A CNAME record you need to add to Namecheap
   - It will look something like: `cname.railway.app` or an IP address

**Important:** Keep Railway open - you'll need the CNAME/IP they provide!

---

## 📋 Part 2: Namecheap DNS Configuration

### Step 1: Access DNS Settings in Namecheap

1. **Go to Namecheap:**
   - Open: https://namecheap.com
   - Login to your account
   - Go to "Domain List" (from the dashboard you showed)

2. **Open Domain Settings:**
   - Find `heddiekitchen.com` in your domain list
   - Click "Manage" next to your domain
   - Go to "Advanced DNS" tab (as shown in your image)

### Step 2: Add Railway DNS Records

**IMPORTANT:** Remove any existing A or CNAME records for `@` or `www` first!

1. **Add Root Domain Record (heddiekitchen.com):**
   - Click "Add New Record"
   - **Type:** `A Record` (if Railway gave you an IP) OR `CNAME Record` (if Railway gave you a CNAME)
   - **Host:** `@` (this is for the root domain)
   - **Value:** Use the CNAME or IP address Railway provided
     - If Railway gave CNAME: `your-app-name.up.railway.app` or `cname.railway.app`
     - If Railway gave IP: Enter the IP address (e.g., `1.2.3.4`)
   - **TTL:** `Automatic` or `30 min`
   - Click the checkmark to save

2. **Add WWW Subdomain (www.heddiekitchen.com):**
   - Click "Add New Record"
   - **Type:** `CNAME Record`
   - **Host:** `www`
   - **Value:** `heddiekitchen.com` (points to root domain)
   - **TTL:** `Automatic` or `30 min`
   - Click the checkmark to save

### Step 3: Verify DNS Propagation

- DNS changes can take 5 minutes to 48 hours to propagate
- Check propagation: https://www.whatsmydns.net/#A/heddiekitchen.com
- Once it shows your Railway IP/CNAME, it's working!

---

## 📋 Part 3: Google Search Console Setup (For Google Search)

1. **Add Domain to Google Search Console:**
   - Go to: https://search.google.com/search-console
   - Click "Add Property" → Choose "Domain"
   - Enter: `heddiekitchen.com`
   - Click "Continue"

2. **Get Verification TXT Record:**
   - Google will show you a TXT record to add
   - Copy the entire verification string (e.g., `google-site-verification=AbCdEf1234567890...`)

3. **Add to Namecheap DNS:**
   - In Namecheap Advanced DNS, click "ADD NEW RECORD"
   - Type: `TXT Record`
   - Host: `@`
   - Value: Paste the Google verification string
   - TTL: `Automatic`
   - Save

4. **Verify in Google:**
   - Go back to Google Search Console
   - Click "Verify"
   - Wait a few minutes to 48 hours for DNS propagation

**Note:** This doesn't make your site appear in Google instantly - it just verifies ownership. To appear in search results:
- Google will automatically crawl your site (can take days/weeks)
- Submit your sitemap in Search Console after verification
- Follow SEO best practices

---

## 📋 Part 4: Resend Email Setup with Your Domain

### Step 1: Add Domain to Resend

1. **Go to Resend Dashboard:**
   - Open: https://resend.com/domains
   - Login to your Resend account
   - Click "Add Domain"

2. **Add Your Domain:**
   - Enter: `heddiekitchen.com`
   - Select region: `EU West (Ireland)` or `US East (Ohio)` (choose closest to your users)
   - Click "Add Domain"

3. **Resend will show you DNS records to add:**
   - DKIM record (TXT)
   - SPF record (TXT or MX)
   - DMARC record (TXT - optional)

### Step 2: Add Resend DNS Records to Namecheap

**Go back to Namecheap → Advanced DNS and add these records:**

1. **DKIM Record:**
   - Click "Add New Record"
   - **Type:** `TXT Record`
   - **Host:** `resend._domainkey` (or whatever Resend specifies)
   - **Value:** The long DKIM string Resend provides (starts with `p=MIGfMA...`)
   - **TTL:** `Automatic` or `30 min`
   - Click checkmark to save

2. **SPF Record:**
   - Click "Add New Record"
   - **Type:** `TXT Record`
   - **Host:** `@` (or `send` if Resend specifies)
   - **Value:** The SPF string Resend provides (looks like `v=spf1 include:amazonses.com ...`)
   - **TTL:** `Automatic` or `30 min`
   - Click checkmark to save

3. **MX Record (if Resend requires):**
   - Click "Add New Record"
   - **Type:** `MX Record`
   - **Host:** `send` (or `@` if Resend specifies)
   - **Value:** The MX value Resend provides (looks like `feedback-smtp.eu-west-1.amazonses.com`)
   - **Priority:** `10` (or whatever Resend specifies)
   - **TTL:** `Automatic` or `30 min`
   - Click checkmark to save

4. **DMARC Record (Optional but Recommended):**
   - Click "Add New Record"
   - **Type:** `TXT Record`
   - **Host:** `_dmarc`
   - **Value:** `v=DMARC1; p=none;` (or what Resend provides)
   - **TTL:** `Automatic` or `30 min`
   - Click checkmark to save

### Step 3: Verify Domain in Resend

1. **Wait for DNS Propagation:**
   - DNS records can take 5 minutes to 48 hours
   - Usually works within 1-2 hours

2. **Check Verification Status:**
   - Go back to Resend: https://resend.com/domains
   - Look at your `heddiekitchen.com` domain
   - Wait for green checkmarks ✅ (shows verified)

3. **Verify:**
   - Resend will automatically verify once DNS records propagate
   - You'll see "Verified" status when ready

---

## 📋 Part 4: Update Code to Use Resend with Your Domain

The code needs to be updated to use Resend API with your verified domain.

### Update Railway Environment Variables

**Remove Mailgun variables:**
```bash
MAILGUN_API_KEY=...  ❌ Remove
MAILGUN_SANDBOX_DOMAIN=...  ❌ Remove
```

**Add Resend variables:**
```bash
RESEND_API_KEY=re_your_resend_api_key_here
DEFAULT_FROM_EMAIL=noreply@heddiekitchen.com
FRONTEND_URL=https://heddiekitchen.com
```

**Also add these (for domain configuration):**
```bash
ALLOWED_HOSTS=heddiekitchen.com,www.heddiekitchen.com,heddyecommerce-production.up.railway.app,*.railway.app
```

---

## ✅ Complete Namecheap DNS Records Summary

After setup, you should have these records in Namecheap:

```
Type    Host                    Value                                    TTL
----    ----                    -----                                    ---
CNAME   @                       xl7n81sr.up.railway.app.                Automatic
CNAME   www                     heddiekitchen.com.                      Automatic
TXT     resend._domainkey       [DKIM string from Resend]                Automatic
TXT     send                    v=spf1 include:amazonses.com ~all        Automatic
TXT     _dmarc                  v=DMARC1; p=none;                        Automatic
TXT     @                       google-site-verification=AbCdEf...       Automatic

❌ REMOVED:
URL Redirect  @                 [Any URL redirect - MUST BE DELETED]
MX            send              [NOT NEEDED - Skip if "Enable Receiving" is off]
```

**Important Notes:**
- The CNAME for `@` replaces the need for an A record
- URL Redirect Record must be removed (conflicts with CNAME)
- MX record is NOT needed unless you want to receive emails
- SPF is a TXT record, not MX record

---

## ✅ Complete Railway Environment Variables

After setup, your Railway environment should have:

```bash
# Resend Email
RESEND_API_KEY=re_your_resend_api_key_here
DEFAULT_FROM_EMAIL=noreply@heddiekitchen.com
FRONTEND_URL=https://heddiekitchen.com

# Domain Configuration
ALLOWED_HOSTS=heddiekitchen.com,www.heddiekitchen.com,heddyecommerce-production.up.railway.app,*.railway.app

# Keep existing variables
SECRET_KEY=...
DEBUG=False
DATABASE_URL=...
# ... all your other existing variables
```

---

## 🔍 Verification Checklist

After completing all steps:

- [ ] Railway custom domain added (`heddiekitchen.com`)
- [ ] Railway CNAME/IP added to Namecheap DNS
- [ ] Root domain (`@`) record added in Namecheap
- [ ] WWW subdomain (`www`) record added in Namecheap
- [ ] Domain added to Resend
- [ ] DKIM record added to Namecheap
- [ ] SPF record added to Namecheap
- [ ] MX record added to Namecheap (if required)
- [ ] DMARC record added to Namecheap (optional)
- [ ] Domain verified in Resend (green checkmarks)
- [ ] Resend API key added to Railway
- [ ] DEFAULT_FROM_EMAIL updated to `noreply@heddiekitchen.com`
- [ ] ALLOWED_HOSTS updated in Railway
- [ ] DNS propagation checked (heddiekitchen.com resolves)
- [ ] Website loads at https://heddiekitchen.com
- [ ] Emails can be sent from noreply@heddiekitchen.com

---

## ⏱️ Timeline

- **DNS Changes:** 5 minutes to 48 hours (usually 1-2 hours)
- **Resend Verification:** Automatic once DNS propagates (usually 1-2 hours)
- **Total Setup Time:** 2-4 hours typically

---

## 🆘 Troubleshooting

**Domain not loading:**
- Check DNS propagation: https://www.whatsmydns.net/#A/heddiekitchen.com
- Verify Railway custom domain is added
- Check ALLOWED_HOSTS includes `heddiekitchen.com`
- Wait up to 48 hours for DNS propagation

**Resend domain not verifying:**
- Check all DNS records are added correctly
- Verify TTL is set (not 0)
- Wait for DNS propagation (can take 24-48 hours)
- Check Resend dashboard for specific error messages

**Emails not sending:**
- Verify Resend domain is verified (green checkmarks)
- Check RESEND_API_KEY is correct
- Verify DEFAULT_FROM_EMAIL uses `@heddiekitchen.com`
- Check Railway logs for error messages

---

## 📝 Next Steps After Setup

1. ✅ Test website at https://heddiekitchen.com
2. ✅ Test newsletter subscription (should receive email)
3. ✅ Test order confirmation (should receive email)
4. ✅ Verify emails come from `noreply@heddiekitchen.com`
5. ✅ Update any hardcoded URLs in your code to use `heddiekitchen.com`

---

**Last Updated:** January 2025

