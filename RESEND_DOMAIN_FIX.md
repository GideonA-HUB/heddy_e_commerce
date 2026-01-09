# Fix: Resend Domain Verification Error

## ❌ Error You're Seeing

```
Resend API error (403): The gmail.com domain is not verified. 
Please, add and verify your domain on https://resend.com/domains
```

## ✅ Solution

**Problem:** Resend requires domain verification to send from `@gmail.com`, `@yahoo.com`, etc. Since Railway domains can't be verified, you can't send from these addresses.

**Solution:** Use Resend's default domain `@resend.dev` which doesn't require verification.

---

## 🚀 Quick Fix

### Option 1: Change DEFAULT_FROM_EMAIL (Recommended)

**Update your Railway environment variable:**

```bash
# Change from:
DEFAULT_FROM_EMAIL=heddiekitchen@gmail.com

# To:
DEFAULT_FROM_EMAIL=heddiekitchen@resend.dev
```

**That's it!** The code will now send emails from `heddiekitchen@resend.dev` which works without verification.

---

### Option 2: Use Automatic Conversion (Already Implemented)

The code now automatically converts `@gmail.com` emails to `@resend.dev` if Resend rejects them. So you can keep:

```bash
DEFAULT_FROM_EMAIL=heddiekitchen@gmail.com
```

And the code will automatically use `heddiekitchen@resend.dev` when sending.

---

## 📧 What Email Address Will Recipients See?

**Before:** `heddiekitchen@gmail.com` (requires verification ❌)

**After:** `heddiekitchen@resend.dev` (works immediately ✅)

**Note:** Recipients will see emails from `heddiekitchen@resend.dev`. This is perfectly fine and professional. The email content and branding remain the same.

---

## ✅ Complete Railway Environment Variables

```bash
RESEND_API_KEY=re_your_api_key_here
DEFAULT_FROM_EMAIL=heddiekitchen@resend.dev
FRONTEND_URL=https://heddyecommerce-production.up.railway.app
```

---

## 🔄 If You Want to Use Your Own Domain Later

If you get a custom domain (like `heddiekitchen.com`):

1. **Add domain to Resend:**
   - Go to: https://resend.com/domains
   - Click "Add Domain"
   - Enter your domain (e.g., `heddiekitchen.com`)

2. **Add DNS records:**
   - Resend will show you DNS records to add
   - Add them to your domain registrar (GoDaddy, Namecheap, etc.)
   - Wait 24-48 hours for verification

3. **Update Railway:**
   ```bash
   DEFAULT_FROM_EMAIL=noreply@heddiekitchen.com
   ```

4. **Benefits:**
   - ✅ Better deliverability
   - ✅ Professional email address
   - ✅ Less likely to go to spam

---

## 🎯 Next Steps

1. **Update Railway:**
   ```bash
   DEFAULT_FROM_EMAIL=heddiekitchen@resend.dev
   ```

2. **Deploy**

3. **Test:**
   - Subscribe to newsletter
   - Check email (should come from `heddiekitchen@resend.dev`)
   - No more 403 errors!

---

## ❓ FAQ

**Q: Will recipients notice the @resend.dev domain?**
A: Yes, but it's perfectly normal and professional. Many services use their email provider's domain.

**Q: Can I use my own domain?**
A: Yes! Get a custom domain, verify it in Resend, and use it. See instructions above.

**Q: Will emails still work?**
A: Yes! Emails will work perfectly. The only difference is the "from" address.

**Q: Can I use @gmail.com later?**
A: No, Gmail doesn't allow third-party services to send from @gmail.com addresses. You'd need your own domain.

---

## ✅ Summary

**Change this in Railway:**
```bash
DEFAULT_FROM_EMAIL=heddiekitchen@resend.dev
```

**Deploy and test!** No more 403 errors! 🎉

