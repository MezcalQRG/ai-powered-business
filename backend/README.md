# Gracie Barra Backend - Firebase Genkit AI Orchestration System

This is the backend orchestration system for the Gracie Barra AI Academy Management Platform. It uses Firebase Genkit to coordinate all business operations including voice conversations (via ElevenLabs + Twilio), messaging (SMS/WhatsApp), scheduling, student management, and proactive automation.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Voice/Text Interfaces                     │
│  ElevenLabs (Voice) + Twilio (Telephony + SMS/WhatsApp)     │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │ HTTP/Webhooks
                      ▼
┌─────────────────────────────────────────────────────────────┐
│              Firebase Genkit Backend (Node.js)               │
│                                                               │
│  ┌──────────────┐  ┌─────────────┐  ┌─────────────────┐    │
│  │  AI Flows    │  │  AI Tools   │  │  Integrations   │    │
│  │              │  │             │  │                 │    │
│  │ • Incoming   │  │ • CRM Ops   │  │ • Firestore DB  │    │
│  │   Messages   │  │ • Scheduling│  │ • Twilio API    │    │
│  │ • Voice      │  │ • RAG Query │  │ • Google Cal    │    │
│  │   Calls      │  │ • Inventory │  │ • ElevenLabs    │    │
│  │ • Retention  │  │ • Analytics │  │ • Vector Store  │    │
│  │   Sweeps     │  │             │  │                 │    │
│  └──────────────┘  └─────────────┘  └─────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                      │
                      ▼
              ┌──────────────┐
              │  Firestore   │
              │   Database   │
              └──────────────┘
```

## Project Structure

```
backend/
├── src/
│   ├── index.ts                    # Main entry point
│   ├── config/
│   │   ├── firebase.ts             # Firebase Admin initialization
│   │   ├── genkit.ts               # Genkit configuration
│   │   └── integrations.ts         # Third-party API clients
│   ├── types/
│   │   └── index.ts                # TypeScript type definitions
│   ├── tools/                      # Genkit Tools (callable functions)
│   │   ├── crm/
│   │   │   ├── identify-user.ts
│   │   │   └── create-lead.ts
│   │   ├── scheduling/
│   │   │   ├── check-availability.ts
│   │   │   └── book-appointment.ts
│   │   ├── knowledge/
│   │   │   └── rag-query.ts
│   │   ├── inventory/
│   │   │   └── check-stock.ts
│   │   └── analytics/
│   │       └── log-interaction.ts
│   ├── flows/                      # Genkit Flows (orchestration logic)
│   │   ├── messaging/
│   │   │   └── handle-incoming-message.ts
│   │   ├── voice/
│   │   │   └── generate-call-config.ts
│   │   ├── retention/
│   │   │   └── retention-sweep.ts
│   │   ├── reminders/
│   │   │   └── appointment-reminder.ts
│   │   └── rag/
│   │       └── index-documents.ts
│   ├── services/                   # Business logic services
│   │   ├── crm.service.ts
│   │   ├── calendar.service.ts
│   │   ├── messaging.service.ts
│   │   ├── inventory.service.ts
│   │   └── rag.service.ts
│   ├── prompts/                    # AI system prompts
│   │   ├── sales.prompt.ts
│   │   ├── retention.prompt.ts
│   │   ├── support.prompt.ts
│   │   └── collections.prompt.ts
│   └── webhooks/                   # HTTP webhook handlers
│       ├── twilio.ts
│       └── elevenlabs.ts
├── package.json
├── tsconfig.json
└── .env.example
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

### 3. Firebase Setup

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Firestore Database
3. Download your service account key JSON
4. Set `FIREBASE_PROJECT_ID` in your `.env`

### 4. Google AI API

1. Get API key from https://makersuite.google.com/app/apikey
2. Set `GOOGLE_GENAI_API_KEY` in your `.env`

### 5. Twilio Setup

1. Sign up at https://www.twilio.com
2. Get Account SID and Auth Token
3. Purchase a phone number
4. Set webhook URLs in Twilio console

### 6. ElevenLabs Setup

1. Sign up at https://elevenlabs.io
2. Create a Conversational AI agent
3. Configure agent to call your Genkit tools endpoint

## Development

### Run in Development Mode

```bash
npm run dev
```

### Run with Genkit UI (recommended)

```bash
npm run genkit:start
```

This opens the Genkit Developer UI at http://localhost:4000 where you can:
- Test flows and tools interactively
- View traces and debug
- Test prompts

## Core Components

### Tools (The "Tool Belt")

Tools are discrete functions that the AI can call to interact with your systems:

- **CRM Tools**: `crm_identify_user`, `crm_create_lead`
- **Scheduling Tools**: `calendar_check_availability`, `calendar_book_appointment`
- **Knowledge Tools**: `rag_query_knowledge_base`
- **Inventory Tools**: `inventory_check_stock`
- **Analytics Tools**: `analytics_log_interaction`

### Flows (The Logic Coordinators)

Flows orchestrate the business logic:

- **`flow_handle_incoming_message`**: Handles SMS/WhatsApp messages
- **`flow_generate_call_config`**: Configures voice calls with context
- **`flow_retention_sweep`**: Daily proactive outreach to at-risk students
- **`flow_appointment_reminder`**: Automated appointment confirmations
- **`flow_index_documents`**: RAG document ingestion

### Services

Services contain the actual business logic that tools and flows use:

- **CRM Service**: User lookup, lead creation, student management
- **Calendar Service**: Availability checking, booking, Google Calendar sync
- **Messaging Service**: Twilio SMS/WhatsApp sending
- **Inventory Service**: Stock checking, product management
- **RAG Service**: Document embedding, vector search

## API Endpoints

The backend exposes these HTTP endpoints:

### Webhooks

- `POST /webhooks/twilio/sms` - Incoming SMS messages
- `POST /webhooks/twilio/voice` - Incoming voice calls
- `POST /webhooks/twilio/status` - Message/call status updates

### ElevenLabs Tool API

- `POST /api/tools` - Tool calling endpoint for ElevenLabs agent

### Admin

- `POST /api/rag/index` - Trigger document indexing
- `GET /api/health` - Health check

## Deployment

### Deploy to Google Cloud Run

```bash
gcloud run deploy gracie-barra-backend \
  --source . \
  --region us-central1 \
  --allow-unauthenticated
```

### Deploy to Firebase Functions

```bash
firebase deploy --only functions
```

## KPIs Tracked

The system automatically tracks and reports on:

- Monthly enrollments (Target: 10+)
- Lead conversion rates (Target: <20% drop between stages)
- Absentee rate (Target: <25%)
- Delinquency rate (Target: <8%)
- Response time (Target: <24 hours)
- Retention workflow execution
- Revenue tracking

## Support

For issues or questions, refer to the main project documentation or the Genkit docs at https://firebase.google.com/docs/genkit
