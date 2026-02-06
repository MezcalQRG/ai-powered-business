# Firebase Genkit Backend Integration Guide

This document explains how to implement the backend AI orchestration system using Firebase Genkit to power the Gracie Barra Academy Management Platform.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (This Spark App)                │
│  - React Dashboard                                          │
│  - Student Management UI                                     │
│  - KPI Visualizations                                       │
│  - Campaign Management                                      │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTPS/WebSocket
                     │
┌────────────────────▼────────────────────────────────────────┐
│              FIREBASE GENKIT BACKEND                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Flows (Workflows)                                   │  │
│  │  - Lead Capture Flow                                 │  │
│  │  - Enrollment Flow                                   │  │
│  │  - Retention Flow                                    │  │
│  │  - Absentee Recovery Flow                           │  │
│  │  - Delinquent Account Flow                          │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Tools (Integrations)                                │  │
│  │  - checkSchedule()                                   │  │
│  │  - scheduleIntroLesson()                            │  │
│  │  - checkInventory()                                 │  │
│  │  - getStudentInfo()                                 │  │
│  │  - updateBillingStatus()                            │  │
│  │  - sendNotification()                               │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  AI Model Integration (LLM)                          │  │
│  │  - OpenAI GPT-4o / GPT-4o-mini                      │  │
│  │  - Google Gemini Pro                                │  │
│  │  - Anthropic Claude                                 │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
┌───────▼────────┐      ┌────────▼────────┐
│  ElevenLabs    │      │   Twilio        │
│  Conversational│      │   - SMS         │
│  AI            │      │   - WhatsApp    │
│  (Voice Agent) │      │   - Voice       │
└────────────────┘      └─────────────────┘
```

## Implementation Steps

### 1. Project Setup

```bash
# Initialize a new Node.js project
mkdir gracie-barra-backend
cd gracie-barra-backend
npm init -y

# Install Firebase Genkit and dependencies
npm install genkit @genkit-ai/core @genkit-ai/firebase
npm install @genkit-ai/googleai  # For Gemini
npm install gpt-3-encoder         # For OpenAI
npm install firebase-admin
npm install express
npm install typescript ts-node @types/node @types/express

# Install Twilio and ElevenLabs SDKs
npm install twilio
npm install elevenlabs
```

### 2. Genkit Configuration

Create `src/genkit.config.ts`:

```typescript
import { configureGenkit } from '@genkit-ai/core';
import { firebase } from '@genkit-ai/firebase';
import { googleAI } from '@genkit-ai/googleai';

export const ai = configureGenkit({
  plugins: [
    firebase(),
    googleAI({ apiKey: process.env.GOOGLE_AI_API_KEY })
  ],
  enableTracingAndMetrics: true,
  logLevel: 'info',
});
```

### 3. Define Tools (Database/API Integrations)

Create `src/tools/academy-tools.ts`:

```typescript
import { defineTool } from '@genkit-ai/core';
import { z } from 'zod';

// Tool: Check class schedule availability
export const checkScheduleTool = defineTool(
  {
    name: 'checkSchedule',
    description: 'Check class schedule availability for a specific date and program',
    inputSchema: z.object({
      date: z.string().describe('Date in YYYY-MM-DD format'),
      program: z.string().describe('Program name (e.g., Kids BJJ, Adult BJJ, Muay Thai)'),
    }),
    outputSchema: z.object({
      available: z.boolean(),
      classes: z.array(z.object({
        time: z.string(),
        instructor: z.string(),
        capacity: z.number(),
        currentEnrollment: z.number(),
      })),
    }),
  },
  async (input) => {
    // Query your Firestore database or club management system
    // For example:
    // const classes = await firestore.collection('schedule')
    //   .where('date', '==', input.date)
    //   .where('program', '==', input.program)
    //   .get();
    
    // Mock implementation:
    return {
      available: true,
      classes: [
        {
          time: '18:00',
          instructor: 'Professor Silva',
          capacity: 30,
          currentEnrollment: 22,
        },
      ],
    };
  }
);

// Tool: Schedule intro lesson
export const scheduleIntroLessonTool = defineTool(
  {
    name: 'scheduleIntroLesson',
    description: 'Schedule an introductory lesson for a prospect',
    inputSchema: z.object({
      leadId: z.string(),
      name: z.string(),
      phone: z.string(),
      email: z.string().optional(),
      date: z.string(),
      time: z.string(),
      program: z.string(),
    }),
    outputSchema: z.object({
      success: z.boolean(),
      confirmationCode: z.string().optional(),
      message: z.string(),
    }),
  },
  async (input) => {
    // 1. Create lesson record in database
    // 2. Send confirmation SMS/Email via Twilio
    // 3. Update lead status
    
    const confirmationCode = `GB-${Date.now()}`;
    
    // Mock implementation
    return {
      success: true,
      confirmationCode,
      message: `Lesson scheduled for ${input.name} on ${input.date} at ${input.time}`,
    };
  }
);

// Tool: Check inventory
export const checkInventoryTool = defineTool(
  {
    name: 'checkInventory',
    description: 'Check inventory availability for a specific item',
    inputSchema: z.object({
      itemName: z.string(),
      size: z.string().optional(),
      color: z.string().optional(),
    }),
    outputSchema: z.object({
      available: z.boolean(),
      quantity: z.number(),
      price: z.number(),
      sku: z.string(),
    }),
  },
  async (input) => {
    // Query inventory database
    return {
      available: true,
      quantity: 5,
      price: 120.00,
      sku: 'GI-A2-WHITE',
    };
  }
);

// Tool: Get student information
export const getStudentInfoTool = defineTool(
  {
    name: 'getStudentInfo',
    description: 'Retrieve student information by phone number or ID',
    inputSchema: z.object({
      phone: z.string().optional(),
      studentId: z.string().optional(),
    }),
    outputSchema: z.object({
      found: z.boolean(),
      student: z.object({
        id: z.string(),
        name: z.string(),
        program: z.string(),
        belt: z.string(),
        billingStatus: z.string(),
        lastAttendance: z.string().optional(),
        absenceCount: z.number(),
      }).optional(),
    }),
  },
  async (input) => {
    // Query student database
    return {
      found: true,
      student: {
        id: '12345',
        name: 'João Silva',
        program: 'Adult BJJ',
        belt: 'Blue',
        billingStatus: 'current',
        lastAttendance: '2024-01-15',
        absenceCount: 0,
      },
    };
  }
);
```

### 4. Define Flows (Workflows)

Create `src/flows/lead-management-flow.ts`:

```typescript
import { defineFlow } from '@genkit-ai/core';
import { z } from 'zod';
import { checkScheduleTool, scheduleIntroLessonTool } from '../tools/academy-tools';

export const leadCaptureFlow = defineFlow(
  {
    name: 'leadCaptureFlow',
    inputSchema: z.object({
      name: z.string(),
      phone: z.string(),
      email: z.string().optional(),
      source: z.string(),
      interestedProgram: z.string(),
      conversationHistory: z.array(z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string(),
      })).optional(),
    }),
    outputSchema: z.object({
      leadId: z.string(),
      nextAction: z.string(),
      aiResponse: z.string(),
      lessonScheduled: z.boolean(),
      scheduledLesson: z.object({
        date: z.string(),
        time: z.string(),
      }).optional(),
    }),
  },
  async (input) => {
    // 1. Create lead in database
    const leadId = `LEAD-${Date.now()}`;
    
    // 2. Use AI to determine best course of action and generate response
    const prompt = `You are a friendly Gracie Barra academy assistant. A prospect named ${input.name} is interested in ${input.interestedProgram}.
    
Their conversation so far:
${input.conversationHistory?.map(m => `${m.role}: ${m.content}`).join('\n') || 'No previous conversation'}

Based on this, determine:
1. Should we schedule an intro lesson now? (if they seem ready)
2. What should our next response be?

Respond in a warm, professional tone consistent with Gracie Barra's values.`;

    // Use the AI model through Genkit
    const response = await ai.generate({
      model: 'googleai/gemini-pro',
      prompt,
      tools: [checkScheduleTool, scheduleIntroLessonTool],
    });

    return {
      leadId,
      nextAction: 'follow_up',
      aiResponse: response.text,
      lessonScheduled: false,
    };
  }
);
```

Create `src/flows/retention-flow.ts`:

```typescript
import { defineFlow } from '@genkit-ai/core';
import { z } from 'zod';
import { getStudentInfoTool } from '../tools/academy-tools';

export const absenteeRecoveryFlow = defineFlow(
  {
    name: 'absenteeRecoveryFlow',
    inputSchema: z.object({
      studentId: z.string(),
      absenceCount: z.number(),
      lastAttendance: z.string(),
    }),
    outputSchema: z.object({
      actionTaken: z.string(),
      outreachMethod: z.string(),
      message: z.string(),
      callScheduled: z.boolean(),
    }),
  },
  async (input) => {
    // Get student details
    const studentInfo = await getStudentInfoTool({ studentId: input.studentId });
    
    if (!studentInfo.found || !studentInfo.student) {
      throw new Error('Student not found');
    }

    // Generate personalized outreach message using AI
    const prompt = `You are a caring Gracie Barra instructor reaching out to a student who has been absent.
    
Student: ${studentInfo.student.name}
Belt: ${studentInfo.student.belt}
Program: ${studentInfo.student.program}
Absences: ${input.absenceCount}
Last Attendance: ${input.lastAttendance}

Write a warm, concerned message to check on them and encourage them to return. Keep it personal and motivating, referencing their belt level and progress.`;

    const response = await ai.generate({
      model: 'googleai/gemini-pro',
      prompt,
    });

    // Determine outreach method based on absence count
    const outreachMethod = input.absenceCount >= 5 ? 'phone_call' : 'sms';

    return {
      actionTaken: 'outreach_initiated',
      outreachMethod,
      message: response.text,
      callScheduled: outreachMethod === 'phone_call',
    };
  }
);
```

### 5. ElevenLabs Integration (Voice Conversations)

Create `src/voice/elevenlabs-integration.ts`:

```typescript
import { ElevenLabsClient } from 'elevenlabs';
import { leadCaptureFlow } from '../flows/lead-management-flow';

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

export async function setupConversationalAgent() {
  // ElevenLabs Conversational AI configuration
  const agentConfig = {
    agentId: process.env.ELEVENLABS_AGENT_ID,
    
    // Define client tools that ElevenLabs can call
    clientTools: {
      // This tool will be called by ElevenLabs when it needs schedule info
      checkSchedule: {
        description: 'Check class schedule availability',
        parameters: {
          type: 'object',
          properties: {
            date: { type: 'string', description: 'Date in YYYY-MM-DD format' },
            program: { type: 'string', description: 'Program name' },
          },
          required: ['date', 'program'],
        },
        handler: async (params: { date: string; program: string }) => {
          // Call your Genkit tool/flow
          const result = await checkScheduleTool(params);
          return result;
        },
      },
      
      scheduleLesson: {
        description: 'Schedule an introductory lesson',
        parameters: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            phone: { type: 'string' },
            date: { type: 'string' },
            time: { type: 'string' },
            program: { type: 'string' },
          },
          required: ['name', 'phone', 'date', 'time', 'program'],
        },
        handler: async (params: any) => {
          const result = await leadCaptureFlow({
            ...params,
            source: 'phone',
            interestedProgram: params.program,
          });
          return result;
        },
      },
    },
  };

  return agentConfig;
}
```

### 6. Twilio Integration (SMS/WhatsApp/Voice)

Create `src/messaging/twilio-integration.ts`:

```typescript
import twilio from 'twilio';
import { leadCaptureFlow } from '../flows/lead-management-flow';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function handleIncomingSMS(from: string, body: string) {
  // Process the message through Genkit
  const result = await leadCaptureFlow({
    name: 'Unknown', // We'll extract this from conversation
    phone: from,
    source: 'sms',
    interestedProgram: 'General Inquiry',
    conversationHistory: [
      { role: 'user', content: body },
    ],
  });

  // Send AI response back via SMS
  await client.messages.create({
    body: result.aiResponse,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: from,
  });

  return result;
}

export async function sendProactiveOutreach(
  to: string,
  message: string,
  method: 'sms' | 'whatsapp' | 'call'
) {
  if (method === 'sms') {
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });
  } else if (method === 'whatsapp') {
    await client.messages.create({
      body: message,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${to}`,
    });
  } else if (method === 'call') {
    // Trigger ElevenLabs conversational agent via Twilio
    await client.calls.create({
      url: `${process.env.BASE_URL}/voice/elevenlabs-stream`,
      to,
      from: process.env.TWILIO_PHONE_NUMBER,
    });
  }
}
```

### 7. Scheduled Tasks (Proactive Operations)

Create `src/scheduled/daily-tasks.ts`:

```typescript
import { absenteeRecoveryFlow } from '../flows/retention-flow';
import { sendProactiveOutreach } from '../messaging/twilio-integration';

// This would run daily via Cloud Scheduler or Cron
export async function runDailyAbsenteeCheck() {
  // 1. Query database for students absent 3+ times
  const absentStudents = await getAbsentStudents();

  // 2. For each student, run the recovery flow
  for (const student of absentStudents) {
    const recovery = await absenteeRecoveryFlow({
      studentId: student.id,
      absenceCount: student.absenceCount,
      lastAttendance: student.lastAttendance,
    });

    // 3. Execute the outreach
    await sendProactiveOutreach(
      student.phone,
      recovery.message,
      recovery.outreachMethod as 'sms' | 'call'
    );
  }
}

async function getAbsentStudents() {
  // Query your database
  // This is a mock implementation
  return [
    {
      id: '12345',
      name: 'João Silva',
      phone: '+5511999999999',
      absenceCount: 3,
      lastAttendance: '2024-01-01',
    },
  ];
}
```

### 8. Express Server Setup

Create `src/server.ts`:

```typescript
import express from 'express';
import { handleIncomingSMS } from './messaging/twilio-integration';
import { setupConversationalAgent } from './voice/elevenlabs-integration';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Twilio webhook for incoming SMS
app.post('/sms/incoming', async (req, res) => {
  const { From, Body } = req.body;
  
  try {
    await handleIncomingSMS(From, Body);
    res.status(200).send();
  } catch (error) {
    console.error('Error handling SMS:', error);
    res.status(500).send();
  }
});

// ElevenLabs voice stream endpoint
app.post('/voice/elevenlabs-stream', async (req, res) => {
  const twiml = `
    <Response>
      <Connect>
        <Stream url="wss://your-elevenlabs-websocket-url" />
      </Connect>
    </Response>
  `;
  res.type('text/xml').send(twiml);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Genkit backend running on port ${PORT}`);
});
```

## Environment Variables

Create `.env`:

```bash
# Google AI
GOOGLE_AI_API_KEY=your_google_ai_key

# Firebase
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_API_KEY=your_firebase_key

# Twilio
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+1234567890
TWILIO_WHATSAPP_NUMBER=+1234567890

# ElevenLabs
ELEVENLABS_API_KEY=your_elevenlabs_key
ELEVENLABS_AGENT_ID=your_agent_id

# Server
BASE_URL=https://your-backend-url.com
PORT=3000
```

## Deployment

### Option 1: Firebase Functions

```bash
# Initialize Firebase
firebase init functions

# Deploy
firebase deploy --only functions
```

### Option 2: Google Cloud Run

```bash
# Build Docker image
docker build -t gcr.io/YOUR_PROJECT/gracie-barra-backend .

# Push to Google Container Registry
docker push gcr.io/YOUR_PROJECT/gracie-barra-backend

# Deploy to Cloud Run
gcloud run deploy gracie-barra-backend \
  --image gcr.io/YOUR_PROJECT/gracie-barra-backend \
  --platform managed \
  --region us-central1
```

## KPI Monitoring & Dashboards

To feed data back to the frontend dashboard:

1. **Real-time Updates**: Use Firestore listeners
2. **Scheduled Reports**: Cloud Scheduler runs aggregation functions daily
3. **Webhook Integration**: Genkit flows update KPI documents after each operation

Example KPI update in a flow:

```typescript
async function updateKPIs(metric: string, value: number) {
  await firestore.collection('kpis').doc('current-month').update({
    [metric]: admin.firestore.FieldValue.increment(value),
    lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
  });
}

// In your enrollment flow:
await updateKPIs('enrollments.actual', 1);
await updateKPIs('enrollments.newThisMonth', 1);
```

## Next Steps

1. **Set up Firebase project** and enable Firestore
2. **Create database schema** for students, leads, inventory, etc.
3. **Configure Twilio webhooks** to point to your backend
4. **Set up ElevenLabs Conversational AI agent** with your system prompt
5. **Deploy Genkit backend** to Cloud Functions or Cloud Run
6. **Configure Cloud Scheduler** for daily automated tasks
7. **Connect frontend** to Firestore for real-time data sync

## Testing

Test individual flows using Genkit Dev UI:

```bash
genkit start -- npm run dev
```

This will open the Genkit developer UI where you can test flows, inspect traces, and debug issues.
