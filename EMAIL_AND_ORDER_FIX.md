# Email and Order Creation Fix Guide

## Issues Fixed

### 1. ✅ Order Creation Error After Canceling Paystack
**Problem:** After creating an order and canceling Paystack checkout, trying to create another order resulted in "Failed to create order" because the cart was cleared immediately.

**Solution:** 
- Cart is now only cleared **after payment is successful** (in the webhook handler)
- This allows users to retry if they cancel Paystack checkout
- Cart items remain available until payment is confirmed

### 2. ✅ Resend Domain Verification Error
**Problem:** Resend API returns 403 error because `heddiekitchen.com` domain is not fully verified (only DKIM verified, SPF pending).

**Solution:**
- Added automatic fallback to Resend's default domain (`onboarding@resend.dev`)
- If domain verification fails, emails will automatically use the fallback domain
- Emails will work immediately while you complete DNS verification

---

## What You Need to Do

### Step 1: Complete Resend Domain Verification (Recommended)

Your Resend dashboard shows:
- ✅ **DKIM:** Verified
- ⏳ **SPF:** Pending

**To complete verification:**

1. **Go to Namecheap DNS Settings:**
   - Login to Namecheap: https://www.namecheap.com/
   - Go to Domain List → Manage `heddiekitchen.com`
   - Go to **Advanced DNS** tab

2. **Add the SPF Records:**
   - Look at your Resend dashboard for the exact SPF records needed
   - You should see two records:
     - **MX Record:** `send` → `feedback-smtp.eu-west-1.amazonses.com` (Priority: 10)
     - **TXT Record:** `send` → `v=spf1 include:amazonses.com ~all`

3. **Add Records in Namecheap:**
   - Click **"Add New Record"**
   - For MX Record:
     - Type: **MX Record**
     - Host: `send`
     - Value: `feedback-smtp.eu-west-1.amazonses.com`
     - Priority: `10`
     - TTL: `Automatic`
   - For TXT Record:
     - Type: **TXT Record**
     - Host: `send`
     - Value: `v=spf1 include:amazonses.com ~all`
     - TTL: `Automatic`

4. **Wait for DNS Propagation:**
   - DNS changes can take 5 minutes to 48 hours
   - Usually takes 15-30 minutes
   - Check Resend dashboard periodically - status will change from "Pending" to "Verified"

5. **Verify in Resend:**
   - Go to Resend Dashboard → Domains → `heddiekitchen.com`
   - Check that both SPF records show "Verified"
   - Once verified, emails will automatically use `noreply@heddiekitchen.com`

---

## Step 2: Test the Fixes

### Test Order Creation:
1. Add items to cart
2. Go to checkout
3. Fill in shipping information
4. Click "Place Order"
5. **Cancel** the Paystack checkout (don't complete payment)
6. Go back to checkout
7. Try to create order again - **Should work now!** ✅

### Test Email:
1. Subscribe to newsletter - should receive welcome email
2. Create an order - should receive order confirmation email
3. Check Railway logs - should see "Email sent successfully via Resend API"

---

## How It Works Now

### Order Creation Flow:
1. User creates order → Order created with status "payment_pending"
2. Cart items are **NOT cleared** yet
3. User redirected to Paystack
4. **If user cancels:** Cart still has items, can retry order creation
5. **If payment succeeds:** Webhook receives `charge.success` event
6. Webhook handler updates order status and **clears cart**

### Email Flow:
1. System tries to send email from `noreply@heddiekitchen.com`
2. If domain not verified (403 error):
   - Automatically retries with `onboarding@resend.dev`
   - Email is sent successfully
   - Logs show "fallback domain" message
3. Once domain is verified:
   - Emails automatically use `noreply@heddiekitchen.com`
   - No fallback needed

---

## Railway and Gmail SMTP

**Question:** Will Railway block Gmail SMTP for `heddiekitchen.com`?

**Answer:** 
- Railway doesn't specifically block Gmail SMTP for custom domains
- However, Railway's network restrictions can cause Gmail SMTP to fail with:
  - "Network is unreachable" errors
  - Timeout errors
  - Connection refused errors

**Why Resend/Mailgun are Better:**
- ✅ Use REST API (HTTP/HTTPS) - not blocked by Railway
- ✅ More reliable on Railway's infrastructure
- ✅ Better deliverability
- ✅ Built-in analytics

**Recommendation:** 
- ✅ **Use Resend** (with fallback domain until verification completes)
- ✅ Complete DNS verification when possible
- ❌ **Don't use Gmail SMTP** on Railway (unreliable)

---

## Troubleshooting

### Problem: Still getting "Failed to create order"
**Solution:**
1. Check Railway logs for detailed error message
2. Verify cart has items before creating order
3. Check that shipping information is complete
4. Verify Paystack keys are configured

### Problem: Emails not sending
**Solution:**
1. Check Railway logs - should see Resend API responses
2. If you see "fallback domain" message - emails are working, just using fallback
3. Complete DNS verification to use custom domain
4. Verify `RESEND_API_KEY` is set in Railway

### Problem: SPF records still pending
**Solution:**
1. Double-check DNS records in Namecheap match exactly what Resend shows
2. Wait longer (DNS can take up to 48 hours)
3. Use online DNS checker: https://mxtoolbox.com/SuperTool.aspx
4. Verify records are added correctly (no typos)

---

## Current Status

✅ **Order Creation:** Fixed - cart only clears after payment success
✅ **Email Fallback:** Implemented - uses `onboarding@resend.dev` automatically
⏳ **Domain Verification:** In progress - complete SPF records in Namecheap

---

## Next Steps

1. ✅ Deploy the fixes (already done in code)
2. ⏳ Add SPF records to Namecheap DNS
3. ⏳ Wait for DNS propagation (15-30 minutes)
4. ✅ Test order creation with cancel/retry
5. ✅ Test email sending
6. ✅ Verify domain in Resend dashboard

---

**Note:** The email fallback will work immediately, so emails will be sent even while DNS verification is pending. Once verification completes, emails will automatically use your custom domain.
