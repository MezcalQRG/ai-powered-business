# Quick Start Guide - Gracie Barra AI Backend

Get your backend up and running in 15 minutes.

## Prerequisites

- Node.js 20+
- Firebase account (free tier works)
- Google AI API key (free tier available)
- Twilio account (trial works for testing)
- ElevenLabs account (optional for voice)

## Step 1: Install Dependencies (2 min)

```bash
cd backend
npm install
```

## Step 2: Set Up Firebase (5 min)

1. **Create Firebase Project**
   - Go to https://console.firebase.google.com
   - Click "Add project"
   - Name it "gracie-barra-ai" (or your choice)
   - Disable Google Analytics (optional)

2. **Enable Firestore**
   - In your project, go to "Firestore Database"
   - Click "Create database"
   - Start in "Production mode"
   - Choose location closest to you

3. **Get Project ID**
   - It's shown at the top of the Firebase console
   - Or in Project Settings → General → Project ID

## Step 3: Get API Keys (5 min)

### Google AI API Key

1. Go to https://makersuite.google.com/app/apikey
2. Click "Create API key"
3. Copy the key

### Twilio Credentials

1. Sign up at https://www.twilio.com/try-twilio
2. In Console Dashboard, copy:
   - Account SID
   - Auth Token
3. Get a phone number:
   - Go to "Phone Numbers" → "Manage" → "Buy a number"
   - Choose a number with SMS and Voice capabilities
   - Copy the phone number (format: +1234567890)

### ElevenLabs API Key (Optional)

1. Sign up at https://elevenlabs.io
2. Go to Profile Settings
3. Copy your API key

## Step 4: Configure Environment (2 min)

```bash
cp .env.example .env
```

Edit `.env`:

```bash
# Required
GOOGLE_GENAI_API_KEY=your_google_ai_key_here
FIREBASE_PROJECT_ID=gracie-barra-ai
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Optional (for voice)
ELEVENLABS_API_KEY=your_elevenlabs_key
ELEVENLABS_AGENT_ID=your_agent_id

# Development
PORT=3400
BASE_URL=http://localhost:3400
```

## Step 5: Start Development Server (1 min)

```bash
npm run dev
```

You should see:
```
🚀 Gracie Barra AI Backend running on port 3400
📞 Twilio webhooks: http://localhost:3400/webhooks/twilio/*
🤖 ElevenLabs API: http://localhost:3400/api/*
💚 Health check: http://localhost:3400/health
```

## Step 6: Test the Backend

### Test Health Check

```bash
curl http://localhost:3400/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-20T10:00:00Z",
  "service": "Gracie Barra AI Backend"
}
```

### Test Tool Execution

```bash
curl -X POST http://localhost:3400/api/tools \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "crm_identify_user",
    "parameters": {
      "phone": "+15551234567"
    }
  }'
```

### Test with Genkit UI (Recommended)

```bash
npm run genkit:start
```

This opens http://localhost:4000 where you can:
- Test all flows interactively
- Debug tool calls
- View traces
- Test prompts

## Step 7: Populate Test Data

### Add Sample User

```typescript
// In Firestore console, create collection "users"
{
  "phone": "+15551234567",
  "name": "John Doe",
  "email": "john@example.com",
  "type": "active_student",
  "paymentStatus": "current",
  "lastAttendanceDate": "2024-01-15",
  "rank": "Blue Belt",
  "enrollmentDate": "2023-06-01",
  "createdAt": "2023-06-01T10:00:00Z",
  "updatedAt": "2024-01-15T18:30:00Z"
}
```

### Add Sample Inventory

```typescript
// Create collection "inventory"
{
  "name": "Gi",
  "category": "gi",
  "price": 149,
  "sizes": ["A1", "A2", "A3", "A4"],
  "colors": ["White", "Blue", "Black"],
  "stock": [
    { "size": "A2", "color": "White", "quantity": 10 },
    { "size": "A2", "color": "Blue", "quantity": 5 },
    { "size": "A3", "color": "White", "quantity": 8 }
  ],
  "lowStockThreshold": 5
}
```

### Index Sample Knowledge Base Document

```bash
curl -X POST http://localhost:3400/api/rag/index \
  -H "Content-Type: application/json" \
  -d '{
    "documents": [
      {
        "title": "Membership Pricing",
        "content": "We offer three membership tiers: Basic ($99/month, 2 classes per week), Unlimited ($149/month, unlimited classes), and Family ($249/month, up to 3 family members). All memberships include a free uniform and no enrollment fee during promotional periods.",
        "category": "pricing"
      },
      {
        "title": "Class Schedule",
        "content": "Adult fundamentals classes are Monday/Wednesday/Friday at 6:30 PM and Saturday at 10 AM. Advanced classes are Tuesday/Thursday at 7:30 PM. Kids classes (ages 4-12) are Monday through Friday at 4:30 PM.",
        "category": "schedule"
      }
    ]
  }'
```

## Step 8: Test SMS Flow

### Set Up ngrok (for local testing)

```bash
# Install ngrok
npm install -g ngrok

# Start ngrok in another terminal
ngrok http 3400
```

Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)

### Configure Twilio Webhook

1. Go to Twilio Console → Phone Numbers → Your Number
2. Under "Messaging", set webhook to:
   - `https://abc123.ngrok.io/webhooks/twilio/sms`
   - Method: POST

### Send Test SMS

Send an SMS to your Twilio number:
```
Hello, I want to try a class
```

Check your terminal - you should see:
```
Incoming SMS: { From: '+15551234567', Body: 'Hello, I want to try a class' }
```

You'll receive an AI-generated response!

## Step 9: Test Voice (Optional)

If you have ElevenLabs configured:

1. Create an agent at https://elevenlabs.io/app/conversational-ai
2. Configure webhooks (see ELEVENLABS_INTEGRATION.md)
3. Call your Twilio number
4. Have a conversation!

## Common Issues

### "Firebase credentials not found"

Make sure `FIREBASE_PROJECT_ID` is set correctly in `.env`

### "Twilio webhook validation failed"

In development, you can disable validation. In production, use proper Twilio signature validation.

### "Tool not found"

Check that the tool name matches exactly (case-sensitive).

### "Genkit UI not loading"

Try:
```bash
npm install -g genkit
genkit start --attach http://localhost:3400 -- npm run dev
```

## Next Steps

1. **Deploy to Production** - See DEPLOYMENT.md
2. **Configure ElevenLabs** - See ELEVENLABS_INTEGRATION.md
3. **Set Up Cron Jobs** - For retention and reminders
4. **Customize Prompts** - Edit `/src/prompts/system-prompts.ts`
5. **Add More Knowledge** - Index your academy's policies and FAQs
6. **Monitor Performance** - Set up logging and alerts

## Project Structure Reference

```
backend/
├── src/
│   ├── index.ts              ← Main entry point (START HERE)
│   ├── config/               ← Configuration files
│   ├── types/                ← TypeScript types
│   ├── tools/                ← Genkit tools (AI can call these)
│   ├── flows/                ← Genkit flows (orchestration logic)
│   ├── services/             ← Business logic
│   ├── prompts/              ← AI system prompts
│   └── webhooks/             ← HTTP webhook handlers
├── package.json
├── tsconfig.json
└── .env                      ← Your secrets (never commit!)
```

## Available Commands

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm start                # Run production build
npm run genkit:start     # Start with Genkit UI (recommended for dev)
```

## Testing Checklist

- [ ] Health check returns 200
- [ ] Can create a lead via tool
- [ ] Can check calendar availability
- [ ] Can query knowledge base
- [ ] SMS webhook receives and responds
- [ ] Genkit UI loads and shows flows
- [ ] Tools execute without errors

## Resources

- **Full Documentation**: README.md
- **Deployment Guide**: DEPLOYMENT.md
- **API Reference**: API_REFERENCE.md
- **ElevenLabs Integration**: ELEVENLABS_INTEGRATION.md
- **Genkit Docs**: https://firebase.google.com/docs/genkit
- **Twilio Docs**: https://www.twilio.com/docs

## Getting Help

1. Check the logs in your terminal
2. Use Genkit UI to debug flows: `npm run genkit:start`
3. Review API_REFERENCE.md for endpoint details
4. Test tools individually before testing full flows

## Production Checklist (Before Going Live)

- [ ] All environment variables set in production
- [ ] Twilio webhooks pointing to production URL
- [ ] Firestore security rules configured
- [ ] Cron jobs scheduled for retention and reminders
- [ ] Monitoring and alerts set up
- [ ] Test numbers validated in production
- [ ] Knowledge base populated with academy info
- [ ] ElevenLabs agent configured with production tools

---

**You're ready to go!** 🚀

Your AI-powered academy management system is running. Start by testing SMS interactions, then move on to voice when ready.
