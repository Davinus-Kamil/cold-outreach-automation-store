\# Cold Outreach Automation Store



Production storefront for the \*\*Cold Outreach Automation System\*\*, built and maintained by AI-Phen.



\## Product



A digital cold outreach automation package containing three connected n8n workflows:



1\. New Lead Outreach

2\. 3-Day Follow-Up

3\. Reply Watcher



The package also includes installation documentation, setup resources, customization resources, and a lead sheet template.



\## Tech Stack



\- Next.js 15

\- React

\- TypeScript

\- Tailwind CSS

\- Razorpay

\- Supabase

\- Vercel



\## Purchase \& Delivery Flow



Customer → Checkout → Razorpay Payment → Server Verification → Purchase Record → Secure Download



Returning buyers can use \*\*My Purchase\*\* to verify their checkout email and regain access to their purchase.



\## Security



\- Razorpay signatures are verified server-side.

\- Purchases are recorded in Supabase.

\- Product files are stored in a private Supabase Storage bucket.

\- Downloads use temporary signed URLs.

\- Buyer recovery uses email OTP verification.

\- Secrets are stored in environment variables and are not committed to Git.



\## Environment Variables



Create `.env.local` using `.env.example` as the reference.



Required variables:



\- `NEXT\_PUBLIC\_RAZORPAY\_KEY\_ID`

\- `RAZORPAY\_KEY\_SECRET`

\- `SUPABASE\_URL`

\- `SUPABASE\_SECRET\_KEY`



Never commit `.env.local` or production credentials.



\## Local Development



Install dependencies:



```bash

npm install

