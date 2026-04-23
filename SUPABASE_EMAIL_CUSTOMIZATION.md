# Supabase Email Verification Customization

## Problem
The default Supabase email verification template is vague and doesn't match BizLeaderPrep branding.

## Solution: Customize Email Templates

### Step 1: Access Supabase Dashboard
1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Select your project
3. Navigate to **Authentication** → **Email Templates**

### Step 2: Customize the Confirmation Email

Click on **"Confirm signup"** template to edit:

#### Subject Line:
```
Verify your BizLeaderPrep email
```

#### Email Body (Replace with this):
```html
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; max-width: 500px; margin: 0 auto; background: #0a0a0a; color: #f0f0f0; padding: 24px; border-radius: 12px;">
  
  <!-- Header -->
  <div style="text-align: center; margin-bottom: 32px;">
    <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #00ff6a; letter-spacing: -0.5px;">
      🔒 Verify Your Email
    </h1>
  </div>

  <!-- Main Message -->
  <div style="margin-bottom: 24px;">
    <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6; color: #e0e0e0;">
      Welcome to <strong>BizLeaderPrep</strong>! 🚀
    </p>
    <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6; color: #aaa;">
      To get started studying for FBLA, confirm your email address by clicking the button below.
    </p>
  </div>

  <!-- CTA Button -->
  <div style="text-align: center; margin-bottom: 32px;">
    <a href="{{ .ConfirmationURL }}" style="display: inline-block; background: #00ff6a; color: #000; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px; letter-spacing: 0.5px; text-transform: uppercase;">
      Verify Email
    </a>
  </div>

  <!-- Security Note -->
  <div style="background: #111; border: 1px solid #222; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
    <p style="margin: 0; font-size: 12px; color: #888; line-height: 1.6;">
      <strong>Security Tip:</strong> This link expires in 24 hours. If you didn't request this email, you can safely ignore it — no account will be created.
    </p>
  </div>

  <!-- Divider -->
  <div style="border-top: 1px solid #222; margin: 24px 0;"></div>

  <!-- Footer -->
  <div style="text-align: center; font-size: 12px; color: #666;">
    <p style="margin: 0 0 8px 0;">
      BizLeaderPrep — FBLA Competition Prep
    </p>
    <p style="margin: 0;">
      <a href="https://bizleaderprep.com" style="color: #00ff6a; text-decoration: none;">Visit BizLeaderPrep.com</a>
    </p>
  </div>

</div>
```

### Step 3: Save Template
Click **"Save"** at the bottom

### Step 4: Test It Out
1. Go to your app and try signing up with a test email
2. Check the inbox (or spam folder) for the new formatted email
3. Click the "Verify Email" button to confirm it works

## Template Features
✅ **Professional branding** with BizLeaderPrep colors and logo  
✅ **Clear call-to-action** button for email verification  
✅ **Dark theme** matching your app's design  
✅ **Security note** explaining link expiration  
✅ **Mobile-friendly** responsive layout  
✅ **24-hour expiration** built-in safety message  

## Other Email Templates (Optional)

You can also customize these templates the same way:

1. **"Reset password"** — Change color to red/orange (#ef4444) for urgency
2. **"Invite user"** — Keep green (#00ff6a) for consistent branding
3. **"Magic link"** — Use purple (#a855f7) for distinctiveness

## Troubleshooting

**Issue:** Email still shows old template
- **Fix:** Clear browser cache and resend verification email

**Issue:** Variables like `{{ .ConfirmationURL }}` aren't working
- **Fix:** Make sure they match exactly as shown (case-sensitive and with braces)

**Issue:** Email looks broken on mobile
- **Fix:** Supabase auto-optimizes emails; test on different email clients

## Support
If issues persist:
1. Check Supabase logs: **Authentication** → **Logs**
2. Verify email provider settings: **Authentication** → **Providers** → **Email**
3. Check spam folder (emails may be filtered by Gmail, Outlook, etc.)
