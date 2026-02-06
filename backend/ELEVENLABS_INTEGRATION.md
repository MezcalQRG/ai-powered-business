# Integrating ElevenLabs Conversational AI with Genkit Backend

This guide explains how to connect your ElevenLabs Conversational AI agent to your Genkit backend so it can call tools (check availability, book appointments, query knowledge base, etc.) during voice conversations.

## Overview

```
Phone Call → Twilio → ElevenLabs Agent → Your Genkit Tools → Response
```

The flow:
1. User calls your Twilio number
2. Twilio forwards to ElevenLabs Conversational AI
3. ElevenLabs handles speech-to-text, LLM reasoning, and text-to-speech
4. When ElevenLabs needs data (availability, prices, etc.), it calls your Genkit tools
5. Your backend returns the data
6. ElevenLabs incorporates it into the conversation

## Step 1: Deploy Your Backend

First, deploy your Genkit backend (see DEPLOYMENT.md) and get your public URL.

Example: `https://gracie-barra-backend-abc123.run.app`

## Step 2: Create ElevenLabs Conversational AI Agent

1. **Go to ElevenLabs Dashboard**
   - Navigate to: https://elevenlabs.io/app/conversational-ai

2. **Create New Agent**
   - Click "Create Agent"
   - Name: "Gracie Barra Assistant"

3. **Configure Agent Settings**

**System Prompt:** Use one from `/src/prompts/system-prompts.ts`

Example for sales:
```
You are the voice of Gracie Barra, the world's largest Brazilian Jiu-Jitsu academy network...
[Copy the full SALES_PROMPT from system-prompts.ts]
```

**Voice Settings:**
- Voice: Choose a warm, professional voice (e.g., "Rachel" or "Fin")
- Stability: 0.7
- Similarity Boost: 0.8
- Style: 0.3

**Conversation Settings:**
- First Message: "Hello! Thanks for calling Gracie Barra. How can I help you today?"
- Max Duration: 600 seconds (10 minutes)
- Timeout: 10 seconds of silence
- Enable interruptions: Yes

## Step 3: Configure Client Tools (The Key Part!)

This is where you connect ElevenLabs to your Genkit backend.

### Get Your Tool Definitions

First, get the list of available tools from your backend:

```bash
curl https://your-backend-url.com/api/tools/list
```

This returns:
```json
{
  "tools": [
    {
      "name": "crm_identify_user",
      "description": "Identifies a user by phone number",
      "parameters": ["phone"]
    },
    // ... more tools
  ]
}
```

### Add Each Tool to ElevenLabs

In the ElevenLabs agent configuration:

1. Click "Add Client Tool"
2. For each tool, configure:

**Tool 1: crm_identify_user**
```json
{
  "name": "crm_identify_user",
  "description": "Identifies a user by phone number and returns their profile",
  "url": "https://your-backend-url.com/api/tools",
  "method": "POST",
  "body": {
    "tool": "crm_identify_user",
    "parameters": {
      "phone": "{{phone}}"
    }
  },
  "parameters": {
    "phone": {
      "type": "string",
      "description": "Phone number to look up",
      "required": true
    }
  }
}
```

**Tool 2: calendar_check_availability**
```json
{
  "name": "calendar_check_availability",
  "description": "Checks available appointment slots",
  "url": "https://your-backend-url.com/api/tools",
  "method": "POST",
  "body": {
    "tool": "calendar_check_availability",
    "parameters": {
      "startDate": "{{startDate}}",
      "endDate": "{{endDate}}",
      "appointmentType": "{{appointmentType}}"
    }
  },
  "parameters": {
    "startDate": {
      "type": "string",
      "description": "Start date (YYYY-MM-DD or 'today', 'tomorrow', 'next tuesday')",
      "required": true
    },
    "endDate": {
      "type": "string",
      "description": "End date (optional)",
      "required": false
    },
    "appointmentType": {
      "type": "string",
      "enum": ["intro_class", "private_lesson"],
      "default": "intro_class"
    }
  }
}
```

**Tool 3: calendar_book_appointment**
```json
{
  "name": "calendar_book_appointment",
  "description": "Books an appointment for a user",
  "url": "https://your-backend-url.com/api/tools",
  "method": "POST",
  "body": {
    "tool": "calendar_book_appointment",
    "parameters": {
      "userId": "{{userId}}",
      "dateTime": "{{dateTime}}",
      "appointmentType": "{{appointmentType}}",
      "duration": "{{duration}}",
      "notes": "{{notes}}"
    }
  },
  "parameters": {
    "userId": {
      "type": "string",
      "required": true
    },
    "dateTime": {
      "type": "string",
      "description": "ISO datetime",
      "required": true
    },
    "appointmentType": {
      "type": "string",
      "enum": ["intro_class", "private_lesson"],
      "required": true
    },
    "duration": {
      "type": "number",
      "default": 60
    },
    "notes": {
      "type": "string",
      "required": false
    }
  }
}
```

**Tool 4: rag_query_knowledge_base**
```json
{
  "name": "rag_query_knowledge_base",
  "description": "Searches knowledge base for policies, prices, and schedules",
  "url": "https://your-backend-url.com/api/tools",
  "method": "POST",
  "body": {
    "tool": "rag_query_knowledge_base",
    "parameters": {
      "question": "{{question}}",
      "category": "{{category}}",
      "topK": "{{topK}}"
    }
  },
  "parameters": {
    "question": {
      "type": "string",
      "required": true
    },
    "category": {
      "type": "string",
      "enum": ["policy", "pricing", "schedule", "faq"],
      "required": false
    },
    "topK": {
      "type": "number",
      "default": 3
    }
  }
}
```

**Tool 5: inventory_check_stock**
```json
{
  "name": "inventory_check_stock",
  "description": "Checks Pro Shop inventory and prices",
  "url": "https://your-backend-url.com/api/tools",
  "method": "POST",
  "body": {
    "tool": "inventory_check_stock",
    "parameters": {
      "itemName": "{{itemName}}",
      "size": "{{size}}",
      "color": "{{color}}"
    }
  },
  "parameters": {
    "itemName": {
      "type": "string",
      "required": true
    },
    "size": {
      "type": "string",
      "required": false
    },
    "color": {
      "type": "string",
      "required": false
    }
  }
}
```

## Step 4: Connect Twilio to ElevenLabs

### Option A: Direct Integration (Recommended)

1. In Twilio Console, go to your phone number
2. Under "Voice & Fax", set:
   - A CALL COMES IN: Webhook
   - URL: [Your ElevenLabs agent webhook URL]
   - Method: POST

ElevenLabs provides the webhook URL in the agent settings.

### Option B: Via Your Backend (For Dynamic Context)

Use this if you want to load user context before the call starts.

1. In Twilio, set webhook to: `https://your-backend-url.com/webhooks/twilio/voice`

2. Your backend generates call config and redirects to ElevenLabs:

```typescript
// This is already in your code at /src/webhooks/twilio.ts
router.post('/voice', async (req, res) => {
  const { From } = req.body
  
  // Get user context
  const config = await generateCallConfigFlow({
    callerId: From,
    callType: 'inbound',
  })
  
  // Redirect to ElevenLabs with context
  res.type('text/xml')
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Dial>
    <Sip>sip:elevenlabs@endpoint?context=${encodeURIComponent(JSON.stringify(config))}</Sip>
  </Dial>
</Response>`)
})
```

## Step 5: Test the Integration

### Test Tool Calls Directly

```bash
# Test identify user
curl -X POST https://your-backend-url.com/api/tools \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "crm_identify_user",
    "parameters": {
      "phone": "+15551234567"
    }
  }'

# Test check availability
curl -X POST https://your-backend-url.com/api/tools \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "calendar_check_availability",
    "parameters": {
      "startDate": "tomorrow",
      "appointmentType": "intro_class"
    }
  }'
```

### Test ElevenLabs Agent

1. In ElevenLabs dashboard, use the "Test" button
2. Try these prompts:
   - "What time do you have classes tomorrow?"
   - "Do you have white gis in stock?"
   - "How much does membership cost?"
   - "I'd like to schedule an intro class"

3. Watch the ElevenLabs logs to see tool calls

### Test Full Flow (Call Your Number)

1. Call your Twilio number
2. Have a conversation
3. Ask questions that require tools
4. Check your backend logs:

```bash
# Google Cloud Run
gcloud logging tail "resource.type=cloud_run_revision"

# Or local
npm run dev
```

## Troubleshooting

### "Tool not working"

Check:
1. Backend URL is accessible (try curl from external)
2. Tool endpoint returns 200: `curl https://your-url.com/api/tools/list`
3. ElevenLabs tool configuration matches your API exactly

### "Agent doesn't call tools"

Check:
1. System prompt encourages tool use
2. Tool descriptions are clear
3. Enable "Debug Mode" in ElevenLabs to see reasoning

### "Tools timeout"

Check:
1. Backend response time (should be < 3 seconds)
2. Database queries optimized
3. Increase timeout in ElevenLabs settings

### "Wrong data returned"

Check:
1. Parameter names match exactly
2. Response format is JSON
3. Backend logs for errors

## Advanced Configuration

### Dynamic System Prompts

Load different prompts based on caller:

```typescript
const config = await generateCallConfigFlow({
  callerId: From,
  purpose: detectPurpose(From), // 'sales', 'retention', 'collection'
})
```

### Conversation Context Persistence

Store conversation state in Firestore:

```typescript
await db.collection('conversations').doc(callSid).set({
  userId,
  context: { ... },
  history: [ ... ],
})
```

### Multilingual Support

Detect language and switch prompts:

```typescript
const language = detectLanguage(From) // Based on user profile
const prompt = language === 'es' ? SALES_PROMPT_ES : SALES_PROMPT_EN
```

## Monitoring

### Key Metrics to Track

1. **Tool Call Success Rate**
   - Target: > 95%

2. **Average Response Time**
   - Target: < 2 seconds

3. **Conversation Completion Rate**
   - Target: > 80% of calls reach goal

4. **Booking Conversion Rate**
   - Target: > 30% of intro interest → booked

### Logging

All tool calls are automatically logged to Firestore `/interactions` collection.

Query recent tool usage:
```bash
firebase firestore:query interactions \
  --where "channel == 'voice'" \
  --orderBy "timestamp" \
  --limit 100
```

## Next Steps

1. **Populate Knowledge Base**: Use the RAG indexing flow to add your academy policies, prices, and FAQs
2. **Test Scenarios**: Create test scripts for common conversations
3. **Train Staff**: Show them the dashboard and how to monitor AI performance
4. **Iterate on Prompts**: Refine based on real conversation data
5. **Add More Tools**: Create custom tools for your specific needs

## Resources

- ElevenLabs Conversational AI Docs: https://elevenlabs.io/docs/conversational-ai
- Twilio Voice Docs: https://www.twilio.com/docs/voice
- Genkit Docs: https://firebase.google.com/docs/genkit
