# Email Spam Fix Guide - Domain URL Matching

## Problem Identified

Your emails are going to spam because of **domain URL mismatches**. Resend's insights show:

1. ❌ **Mismatched URLs:** Links in emails point to `heddyecommerce-production.up.railway.app` instead of `heddiekitchen.com`
2. ❌ **Mismatched Email:** Contact email uses `heddiekitchen@gmail.com` instead of `contact@heddiekitchen.com`

**Why this causes spam:**
- Spam filters check if URLs in emails match the sending domain
- Mismatched URLs are a major spam trigger
- Gmail specifically flags emails with mismatched domains as suspicious

---

## Fixes Applied

### ✅ 1. Updated Default FRONTEND_URL
**File:** `backend/heddiekitchen/settings.py`
- **Before:** `FRONTEND_URL = 'https://heddyecommerce-production.up.railway.app'`
- **After:** `FRONTEND_URL = 'https://heddiekitchen.com'`

### ✅ 2. Updated Newsletter Email Template
**File:** `backend/heddiekitchen/core/email_utils.py`
- **Before:** `https://heddyecommerce-production.up.railway.app`
- **After:** `https://heddiekitchen.com`
- **Before:** `mailto:heddiekitchen@gmail.com`
- **After:** `mailto:contact@heddiekitchen.com`

### ✅ 3. Updated Order Confirmation Email Template
**File:** `backend/heddiekitchen/core/email_utils.py`
- **Before:** `https://heddyecommerce-production.up.railway.app/orders/{order.id}`
- **After:** `https://heddiekitchen.com/orders/{order.id}`
- **Before:** `mailto:heddiekitchen@gmail.com`
- **After:** `mailto:contact@heddiekitchen.com`

### ✅ 4. Updated DEFAULT_FROM_EMAIL
**File:** `backend/heddiekitchen/settings.py`
- **Before:** `DEFAULT_FROM_EMAIL = 'heddiekitchen@gmail.com'`
- **After:** `DEFAULT_FROM_EMAIL = 'noreply@heddiekitchen.com'`

---

## Railway Environment Variables

Make sure your Railway environment variables are set correctly:

```bash
# Email Configuration
RESEND_API_KEY=re_xxxxxxxxxxxxx
DEFAULT_FROM_EMAIL=noreply@heddiekitchen.com
FRONTEND_URL=https://heddiekitchen.com
```

**Important:** Update `FRONTEND_URL` in Railway if it's still set to the Railway domain.

---

## Additional Steps to Improve Deliverability

### 1. Set Up Contact Email (Optional but Recommended)

You can set up `contact@heddiekitchen.com` to forward to your Gmail:

1. **In Resend Dashboard:**
   - Go to Domains → `heddiekitchen.com`
   - Set up email forwarding (if Resend supports it)
   - Or use Resend's email receiving feature

2. **Or Use Email Forwarding Service:**
   - Use a service like Cloudflare Email Routing (free)
   - Forward `contact@heddiekitchen.com` → `heddiekitchen@gmail.com`

### 2. Verify All Links Match Domain

After deploying, check:
- ✅ All website links use `https://heddiekitchen.com`
- ✅ All email addresses use `@heddiekitchen.com` domain
- ✅ No Railway domain URLs in emails
- ✅ No Gmail addresses in email content

### 3. Test Email Deliverability

1. **Send test newsletter subscription**
2. **Check Resend Insights:**
   - Go to Resend Dashboard → Emails → Insights
   - Should show "Link URLs match sending domain" ✅
   - No warnings about mismatched URLs

3. **Check Gmail:**
   - Email should arrive in **Inbox** (not Spam)
   - If still in spam, mark as "Not Spam"
   - Gmail will learn over time

### 4. Monitor Email Reputation

- **Resend Dashboard:** Check email analytics
- **Gmail:** Mark legitimate emails as "Not Spam" if they go to spam
- **SPF/DKIM:** Ensure both are verified in Resend (already done ✅)

---

## Why This Fixes the Spam Issue

### Before (Causing Spam):
```
From: noreply@heddiekitchen.com
Links: https://heddyecommerce-production.up.railway.app
Email: heddiekitchen@gmail.com
```
❌ **Spam filters see:** Sending from `heddiekitchen.com` but links to different domain
❌ **Result:** Flagged as suspicious → Goes to spam

### After (Fixed):
```
From: noreply@heddiekitchen.com
Links: https://heddiekitchen.com
Email: contact@heddiekitchen.com
```
✅ **Spam filters see:** All URLs match sending domain
✅ **Result:** Passes domain matching check → Goes to inbox

---

## Testing Checklist

After deploying the fixes:

- [ ] Update `FRONTEND_URL` in Railway to `https://heddiekitchen.com`
- [ ] Deploy the code changes
- [ ] Subscribe to newsletter with test email
- [ ] Check Resend Insights - should show no URL mismatch warnings
- [ ] Check Gmail - email should arrive in Inbox
- [ ] If in spam, mark as "Not Spam" to train Gmail
- [ ] Test order confirmation email
- [ ] Verify all links in emails use `heddiekitchen.com`

---

## Long-term Email Deliverability Tips

1. **Consistent Domain Usage:**
   - Always use `heddiekitchen.com` in emails
   - Never mix Railway domain with custom domain

2. **Email Authentication:**
   - ✅ SPF: Verified
   - ✅ DKIM: Verified
   - ✅ DMARC: Consider setting up (optional but recommended)

3. **Content Best Practices:**
   - Avoid spam trigger words
   - Use proper HTML structure
   - Include unsubscribe links (for newsletters)
   - Don't use excessive capitalization

4. **Monitor Reputation:**
   - Check Resend analytics regularly
   - Monitor bounce rates
   - Track spam complaints

---

## Expected Results

After these fixes:
- ✅ **Resend Insights:** No URL mismatch warnings
- ✅ **Gmail Deliverability:** Emails arrive in Inbox
- ✅ **Domain Consistency:** All links match sending domain
- ✅ **Professional Appearance:** Using custom domain throughout

---

**Note:** If emails still go to spam initially, this is normal for new domains. Mark them as "Not Spam" and Gmail will learn. Over time, deliverability will improve as your domain reputation builds.
