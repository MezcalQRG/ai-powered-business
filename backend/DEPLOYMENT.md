# Gracie Barra Backend Deployment Guide

## Production Deployment Options

### Option 1: Google Cloud Run (Recommended)

Google Cloud Run is ideal for this backend because:
- Serverless with auto-scaling
- Pay only for usage
- Integrated with Firebase
- Easy HTTPS setup
- Simple deployment

#### Steps:

1. **Install Google Cloud SDK**
```bash
curl https://sdk.cloud.google.com | bash
gcloud init
```

2. **Set your project**
```bash
gcloud config set project YOUR_FIREBASE_PROJECT_ID
```

3. **Create `.gcloudignore`**
```
node_modules/
.git/
.env
*.log
dist/
```

4. **Create `Dockerfile`** (optional - Cloud Run can build from source)
```dockerfile
FROM node:20-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 8080
CMD ["node", "dist/index.js"]
```

5. **Deploy**
```bash
gcloud run deploy gracie-barra-backend \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GOOGLE_GENAI_API_KEY=your_key \
  --set-env-vars TWILIO_ACCOUNT_SID=your_sid \
  --set-env-vars TWILIO_AUTH_TOKEN=your_token \
  --set-env-vars FIREBASE_PROJECT_ID=your_project
```

6. **Get your URL**
```bash
gcloud run services describe gracie-barra-backend --region us-central1
```

### Option 2: Firebase Cloud Functions

Deploy as Firebase Functions for tight integration.

#### Steps:

1. **Install Firebase CLI**
```bash
npm install -g firebase-tools
firebase login
```

2. **Initialize Functions**
```bash
firebase init functions
```

3. **Modify for Functions** - Create `functions/index.ts`:
```typescript
import * as functions from 'firebase-functions'
import app from './src/index'

export const api = functions.https.onRequest(app)
```

4. **Deploy**
```bash
firebase deploy --only functions
```

### Option 3: Railway / Render (Easiest)

For simple deployment without Google Cloud setup:

**Railway:**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Deploy
railway up
```

**Render:**
1. Connect your GitHub repo
2. Create new Web Service
3. Set build command: `npm install && npm run build`
4. Set start command: `npm start`
5. Add environment variables in dashboard

## Environment Variables

Set these in your production environment:

```
GOOGLE_GENAI_API_KEY=your_google_ai_key
FIREBASE_PROJECT_ID=your_firebase_project
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+1234567890
ELEVENLABS_API_KEY=your_elevenlabs_key
ELEVENLABS_AGENT_ID=your_agent_id
BASE_URL=https://your-deployed-url.com
PORT=8080
```

## Post-Deployment Configuration

### 1. Configure Twilio Webhooks

In Twilio Console, set webhooks:

**SMS Webhook:**
- URL: `https://your-url.com/webhooks/twilio/sms`
- Method: POST

**WhatsApp Webhook:**
- URL: `https://your-url.com/webhooks/twilio/whatsapp`
- Method: POST

**Voice Webhook:**
- URL: `https://your-url.com/webhooks/twilio/voice`
- Method: POST

**Status Callback:**
- URL: `https://your-url.com/webhooks/twilio/status`
- Method: POST

### 2. Configure ElevenLabs Agent

In ElevenLabs Conversational AI dashboard:

**Tool Configuration URL:**
- `https://your-url.com/api/tools`

**Available Tools:**
- Get list at: `https://your-url.com/api/tools/list`

**System Prompt:**
- Use the prompts from `/src/prompts/system-prompts.ts`

### 3. Set Up Cron Jobs

#### Google Cloud Scheduler

```bash
# Retention Sweep (Daily at 9 AM)
gcloud scheduler jobs create http retention-sweep \
  --schedule="0 9 * * *" \
  --uri="https://your-url.com/api/flows/retention-sweep" \
  --http-method=POST \
  --time-zone="America/Los_Angeles"

# Appointment Reminders (Hourly)
gcloud scheduler jobs create http appointment-reminders \
  --schedule="0 * * * *" \
  --uri="https://your-url.com/api/flows/appointment-reminders" \
  --http-method=POST \
  --time-zone="America/Los_Angeles"
```

#### Alternative: Cron-job.org

If not using Google Cloud:
1. Sign up at cron-job.org
2. Create jobs for:
   - `https://your-url.com/api/flows/retention-sweep` - Daily at 9 AM
   - `https://your-url.com/api/flows/appointment-reminders` - Every hour

## Database Setup

### Firestore Collections Structure

Create these collections in Firebase Console:

```
/users
  - User documents (students, leads, prospects)

/appointments
  - Appointment documents

/interactions
  - Communication logs

/inventory
  - Pro Shop items

/knowledge_base
  - RAG documents with embeddings

/kpis
  - Performance metrics
```

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only backend service account can write
    match /{document=**} {
      allow read, write: if false; // Deny all client access
    }
  }
}
```

## Monitoring & Logging

### Google Cloud Logging

```bash
# View logs
gcloud logging read "resource.type=cloud_run_revision" --limit 50

# Stream logs
gcloud logging tail "resource.type=cloud_run_revision"
```

### Health Check Monitoring

Set up Uptime Checks in Google Cloud:
- URL: `https://your-url.com/health`
- Frequency: Every 1 minute
- Alert on failures

### Error Alerting

Configure alerts for:
- HTTP 500 errors > 5 in 5 minutes
- Failed tool executions
- Failed message sends

## Performance Optimization

### 1. Enable Response Caching

For RAG queries:
```typescript
// Add Redis or Memcached for frequently asked questions
```

### 2. Connection Pooling

Already handled by Firebase Admin SDK

### 3. Rate Limiting

Add rate limiting for webhook endpoints:
```bash
npm install express-rate-limit
```

### 4. Optimize Cold Starts

- Keep minimum instances: 1
- Use Cloud Run's always-on CPU allocation

## Security Checklist

- [ ] Environment variables are set (never commit .env)
- [ ] Twilio webhook signature validation enabled
- [ ] HTTPS only (enforced by Cloud Run)
- [ ] Firestore security rules deny client access
- [ ] API keys rotated regularly
- [ ] Logs don't contain sensitive data
- [ ] Rate limiting on public endpoints
- [ ] CORS configured if needed

## Cost Estimation

**Google Cloud Run:**
- Free tier: 2 million requests/month
- Beyond: ~$0.40 per million requests
- Estimated: $5-20/month for small academy

**Firebase:**
- Spark (free): 50K reads, 20K writes/day
- Blaze (pay as you go): $0.06 per 100K reads
- Estimated: $5-15/month

**Google AI (Gemini):**
- Gemini 1.5 Flash: Free up to 15 requests/minute
- Beyond: $0.075 per 1M input tokens
- Estimated: $10-30/month

**Twilio:**
- SMS: $0.0079 per message
- Voice: $0.0140 per minute
- Estimated: $50-200/month (depends on volume)

**ElevenLabs:**
- Starter: $5/month (30K characters)
- Creator: $22/month (100K characters)
- Pro: $99/month (500K characters)

**Total estimated monthly cost: $75-365**

## Troubleshooting

### Twilio webhooks not working
1. Check webhook URLs in Twilio console
2. Verify signature validation
3. Check logs: `gcloud logging read`

### ElevenLabs not calling tools
1. Verify tool endpoint is accessible
2. Check tool list: `GET /api/tools/list`
3. Verify agent configuration

### Genkit flows failing
1. Check environment variables
2. Verify Firebase credentials
3. Run locally: `npm run genkit:start`

### Database connection issues
1. Verify FIREBASE_PROJECT_ID
2. Check service account permissions
3. Test with Firebase emulator

## Backup & Recovery

### Automated Firestore Backups

```bash
gcloud firestore export gs://your-backup-bucket
```

### Manual Export

```bash
# Export all collections
firebase firestore:export backup-$(date +%Y%m%d)
```

## Scaling Considerations

When you grow:

1. **Add Redis for caching**
   - Cache RAG query results
   - Cache user profiles

2. **Separate services**
   - Voice service (ElevenLabs integration)
   - Messaging service (SMS/WhatsApp)
   - Background jobs service (retention, reminders)

3. **Add queue for outbound messages**
   - Use Cloud Tasks or Pub/Sub
   - Prevents rate limit issues

4. **Dedicated vector database**
   - Pinecone or Weaviate for RAG
   - Better than Firestore for large knowledge bases

## Support

For deployment issues:
- Google Cloud: https://cloud.google.com/support
- Firebase: https://firebase.google.com/support
- Genkit: https://firebase.google.com/docs/genkit
