# Supabase Email Verification Setup

## Problem
Users get "Email not confirmed" error when trying to log back in after signing up.

## Root Cause
Supabase email verification is either:
1. Enabled but no email provider is configured
2. Requiring confirmation but the verification email isn't being sent

## Solution

### Option 1: Enable Email Confirmations with Your Email Provider (RECOMMENDED)

1. Go to **Supabase Dashboard** → Your Project
2. Navigate to **Authentication** → **Providers**
3. Scroll down to **Email**
4. Enable "Confirm email" toggle
5. Set up your email provider:
   - **SMTP** (recommended): Configure with your email service (Gmail, SendGrid, etc.)
   - **Resend**: Use the built-in Resend service (easiest for development)

#### Using Resend (Easiest):
1. Go to https://resend.com and sign up
2. Get your API key
3. In Supabase → Email Provider Settings:
   - Select **Resend**
   - Paste your API key
4. Users will receive verification emails automatically

#### Using SMTP (Gmail Example):
1. Create a Gmail App Password (not your regular password)
2. In Supabase Email settings:
   - Host: `smtp.gmail.com`
   - Port: `587`
   - Username: `your-email@gmail.com`
   - Password: Your App Password
3. Set "Sender Email" and "Sender Name"

### Option 2: Disable Email Confirmation (Development Only)

**⚠️ NOT RECOMMENDED FOR PRODUCTION**

1. Go to **Supabase Dashboard** → Your Project
2. Navigate to **Authentication** → **Providers**
3. Find **Email** settings
4. Toggle OFF "Confirm email"
5. This allows users to log in immediately after signup

## Testing the Fix

After configuring email:

1. **Sign up** with a test email
2. **Check email inbox** for verification link
3. **Click the link** to confirm email
4. **Log in** with your email and password
5. Should work without the "Email not confirmed" error

## Code Changes Made

Updated `Auth.tsx` to show helpful error messages:
- "Email not confirmed" → "Please confirm your email before logging in"
- "Invalid login credentials" → More helpful message
- All other errors show the Supabase error message

## Verification Email Content

When a user signs up, they'll receive an email with:
- A "Confirm Email" button/link
- Link expires after the time configured in Supabase settings
- After clicking, the account is verified and ready to log in

## Resend Configuration (Simplest)

1. Sign up at https://resend.com (free tier available)
2. Get API key from Resend dashboard
3. Paste into Supabase Email Provider settings
4. Emails start working immediately

## Support

If users still can't log in after clicking verification link:
- Check email spam folder
- Verify they're using the same email for login
- Make sure they wait a few seconds after email confirmation before logging in
- Check Supabase logs for any auth errors
