# Gracie Barra Backend API Documentation

Complete API reference for all endpoints, tools, and flows.

## Base URL

```
Production: https://your-domain.run.app
Development: http://localhost:3400
```

## Authentication

Currently, webhooks are unauthenticated but validated via Twilio signatures. For admin endpoints, add authentication middleware as needed.

---

## Webhooks

### Twilio SMS Webhook

Receives incoming SMS messages from Twilio.

**Endpoint:** `POST /webhooks/twilio/sms`

**Request Body (Twilio format):**
```
From=+15551234567
To=+15559876543
Body=Hello, I want to learn Jiu-Jitsu
MessageSid=SM1234567890
```

**Response:** TwiML (empty response)
```xml
<?xml version="1.0" encoding="UTF-8"?>
<Response></Response>
```

**Side Effects:**
- Identifies or creates user
- Generates AI response
- Sends reply via SMS
- Logs interaction

---

### Twilio WhatsApp Webhook

Receives incoming WhatsApp messages from Twilio.

**Endpoint:** `POST /webhooks/twilio/whatsapp`

**Request Body:**
```
From=whatsapp:+15551234567
To=whatsapp:+15559876543
Body=What are your class times?
MessageSid=SM1234567890
```

**Response:** TwiML (empty response)

---

### Twilio Voice Webhook

Receives incoming phone calls from Twilio.

**Endpoint:** `POST /webhooks/twilio/voice`

**Request Body:**
```
From=+15551234567
To=+15559876543
CallSid=CA1234567890
```

**Response:** TwiML (redirect to call config)
```xml
<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>Thank you for calling Gracie Barra. Please hold while we connect you.</Say>
  <Redirect>https://your-url.com/api/call-config?from=+15551234567</Redirect>
</Response>
```

---

### Twilio Status Webhook

Receives status updates for messages and calls.

**Endpoint:** `POST /webhooks/twilio/status`

**Request Body:**
```
MessageSid=SM1234567890
MessageStatus=delivered
```

**Response:** `200 OK`

---

## AI Tools API

### Get Call Configuration

Generates dynamic configuration for voice calls based on caller context.

**Endpoint:** `GET /api/call-config`

**Query Parameters:**
- `from` (required): Caller phone number

**Response:**
```json
{
  "systemPrompt": "You are the voice assistant for Gracie Barra...",
  "context": {
    "userId": "user123",
    "userName": "John Doe",
    "userType": "active_student",
    "paymentStatus": "current",
    "lastAttendance": "2024-01-15"
  },
  "voiceConfig": {
    "voiceId": "ElevenLabs-Default",
    "stability": 0.7,
    "similarityBoost": 0.8
  }
}
```

---

### Execute Tool

Executes a specific Genkit tool.

**Endpoint:** `POST /api/tools`

**Request Body:**
```json
{
  "tool": "crm_identify_user",
  "parameters": {
    "phone": "+15551234567"
  }
}
```

**Response (varies by tool):**
```json
{
  "found": true,
  "user": {
    "id": "user123",
    "name": "John Doe",
    "type": "active_student",
    "paymentStatus": "current"
  }
}
```

---

### List Available Tools

Returns all available tools and their signatures.

**Endpoint:** `GET /api/tools/list`

**Response:**
```json
{
  "tools": [
    {
      "name": "crm_identify_user",
      "description": "Identifies a user by phone number",
      "parameters": ["phone"]
    },
    {
      "name": "calendar_check_availability",
      "description": "Checks available appointment slots",
      "parameters": ["startDate", "endDate", "appointmentType"]
    }
    // ... more tools
  ]
}
```

---

## Genkit Tools

### CRM Tools

#### crm_identify_user

Identifies a user by phone number and returns their profile.

**Parameters:**
```json
{
  "phone": "string" // Phone number to look up
}
```

**Returns:**
```json
{
  "found": boolean,
  "user": {
    "id": "string",
    "name": "string?",
    "type": "new_prospect" | "active_student" | "former_student" | "lead",
    "rank": "string?",
    "lastAttendanceDate": "string?",
    "paymentStatus": "current" | "overdue" | "suspended",
    "email": "string?"
  }
}
```

---

#### crm_create_lead

Creates a new lead record in the CRM system.

**Parameters:**
```json
{
  "name": "string?",
  "phone": "string", // Required
  "email": "string?",
  "interest": "string?", // e.g., "Jiu-Jitsu", "Kids Classes"
  "source": "phone" | "sms" | "whatsapp" | "facebook" | "instagram" | "walkin" | "website"
}
```

**Returns:**
```json
{
  "success": boolean,
  "userId": "string",
  "message": "string"
}
```

---

### Scheduling Tools

#### calendar_check_availability

Checks available time slots for appointments.

**Parameters:**
```json
{
  "startDate": "string", // YYYY-MM-DD or "today", "tomorrow", "next tuesday"
  "endDate": "string?", // Optional
  "appointmentType": "intro_class" | "private_lesson" | "regular_class" | "belt_test" | "event"
}
```

**Returns:**
```json
{
  "availableSlots": [
    {
      "start": "2024-01-20T10:00:00Z",
      "end": "2024-01-20T11:00:00Z",
      "displayTime": "Saturday, January 20 at 10:00 AM"
    }
  ],
  "message": "Found 5 available time slots"
}
```

---

#### calendar_book_appointment

Books an appointment for a user and sends confirmation.

**Parameters:**
```json
{
  "userId": "string",
  "dateTime": "string", // ISO 8601 format
  "appointmentType": "intro_class" | "private_lesson" | "regular_class" | "belt_test" | "event",
  "duration": number, // Optional, default 60 minutes
  "notes": "string?" // Optional
}
```

**Returns:**
```json
{
  "success": boolean,
  "appointmentId": "string?",
  "confirmationMessage": "string"
}
```

---

### Knowledge Tools

#### rag_query_knowledge_base

Searches the knowledge base for answers to questions.

**Parameters:**
```json
{
  "question": "string",
  "category": "policy" | "pricing" | "schedule" | "faq" | "manual" | "other",
  "topK": number // Optional, default 3
}
```

**Returns:**
```json
{
  "found": boolean,
  "results": [
    {
      "content": "string",
      "source": "string",
      "relevanceScore": number
    }
  ],
  "answer": "string"
}
```

---

### Inventory Tools

#### inventory_check_stock

Checks Pro Shop inventory stock levels.

**Parameters:**
```json
{
  "itemName": "string", // e.g., "Gi", "Belt", "Rashguard"
  "size": "string?", // Optional, e.g., "A2", "M", "Large"
  "color": "string?" // Optional, e.g., "White", "Blue", "Black"
}
```

**Returns:**
```json
{
  "available": boolean,
  "quantity": number,
  "price": number,
  "message": "string",
  "sizes": ["string"],
  "colors": ["string"]
}
```

---

### Analytics Tools

#### analytics_log_interaction

Logs an interaction to the analytics system for KPI tracking.

**Parameters:**
```json
{
  "userId": "string",
  "channel": "voice" | "sms" | "whatsapp" | "facebook" | "instagram" | "email",
  "outcome": "booked" | "question_answered" | "escalated" | "failed" | "no_answer",
  "sentiment": "positive" | "neutral" | "negative",
  "summary": "string?",
  "duration": number // Seconds, optional
}
```

**Returns:**
```json
{
  "success": boolean,
  "interactionId": "string",
  "message": "string"
}
```

---

## Genkit Flows

### Messaging Flow

#### flow_handle_incoming_message

Processes incoming SMS/WhatsApp messages and generates AI responses.

**Endpoint:** N/A (Called internally by webhooks)

**Input:**
```json
{
  "from": "string",
  "to": "string",
  "body": "string",
  "channel": "sms" | "whatsapp"
}
```

**Output:**
```json
{
  "response": "string",
  "userId": "string?",
  "action": "string?"
}
```

---

### Voice Flow

#### flow_generate_call_config

Generates dynamic configuration for voice calls based on caller.

**Endpoint:** `GET /api/call-config`

**Input:**
```json
{
  "callerId": "string",
  "callType": "inbound" | "outbound",
  "purpose": "general" | "sales" | "retention" | "collection" | "support"
}
```

**Output:**
```json
{
  "systemPrompt": "string",
  "context": { ... },
  "voiceConfig": { ... }
}
```

---

### Retention Flow

#### flow_retention_sweep

Proactive outreach to students who haven't attended recently.

**Endpoint:** `POST /api/flows/retention-sweep`

**Input:**
```json
{
  "daysSinceLastAttendance": number, // Default 14
  "channel": "sms" | "whatsapp" | "voice",
  "maxContacts": number // Optional limit
}
```

**Output:**
```json
{
  "totalStudentsFound": number,
  "contactsAttempted": number,
  "contactsSuccessful": number,
  "contactsFailed": number,
  "students": [
    {
      "id": "string",
      "name": "string",
      "phone": "string",
      "daysSinceAttendance": number,
      "contactStatus": "success" | "failed" | "skipped"
    }
  ]
}
```

**Scheduling:** Run daily at 9 AM via Cloud Scheduler

---

### Reminder Flow

#### flow_appointment_reminder

Sends reminders for upcoming appointments.

**Endpoint:** `POST /api/flows/appointment-reminders`

**Input:**
```json
{
  "hoursAhead": number, // Default 24
  "channel": "sms" | "whatsapp"
}
```

**Output:**
```json
{
  "totalAppointments": number,
  "remindersSent": number,
  "remindersFailed": number,
  "appointments": [
    {
      "id": "string",
      "userId": "string",
      "userName": "string",
      "dateTime": "string",
      "type": "string",
      "reminderStatus": "sent" | "failed"
    }
  ]
}
```

**Scheduling:** Run hourly via Cloud Scheduler

---

### RAG Flow

#### flow_index_documents

Indexes documents into the knowledge base with embeddings.

**Endpoint:** `POST /api/rag/index`

**Input:**
```json
{
  "documents": [
    {
      "title": "string",
      "content": "string",
      "category": "policy" | "pricing" | "schedule" | "faq" | "manual" | "other",
      "metadata": {}
    }
  ]
}
```

**Output:**
```json
{
  "totalDocuments": number,
  "indexed": number,
  "failed": number,
  "documentIds": ["string"]
}
```

---

## Health & Monitoring

### Health Check

**Endpoint:** `GET /health`

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-20T10:00:00Z",
  "service": "Gracie Barra AI Backend"
}
```

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "error": "string",
  "message": "string",
  "details": {} // Optional
}
```

**Common HTTP Status Codes:**
- `200 OK` - Success
- `400 Bad Request` - Invalid parameters
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## Rate Limits

Currently no rate limiting is enforced. Consider adding:
- 60 requests/minute per IP for webhooks
- 100 requests/minute for tool calls

---

## Example Usage

### Book an intro class via SMS

**User sends SMS:**
```
"I'd like to try a free class"
```

**System flow:**
1. Twilio webhook → `/webhooks/twilio/sms`
2. `flow_handle_incoming_message` runs
3. AI calls `crm_identify_user` (finds or creates lead)
4. AI responds: "Great! When works best for you?"
5. User: "Tomorrow afternoon"
6. AI calls `calendar_check_availability`
7. AI responds: "I have 4 PM or 6 PM available. Which works?"
8. User: "6 PM"
9. AI calls `calendar_book_appointment`
10. AI responds: "Perfect! You're booked for tomorrow at 6 PM. See you then!"
11. Confirmation SMS sent

### Check inventory via voice

**User calls and says:**
```
"Do you have white gis?"
```

**System flow:**
1. Twilio → `/webhooks/twilio/voice` → ElevenLabs
2. ElevenLabs calls `POST /api/tools` with `inventory_check_stock`
3. Backend queries inventory
4. Returns: "Yes, sizes A1-A4 available, $149"
5. ElevenLabs speaks: "Yes, we have white gis in sizes A1 through A4 for $149."

---

## Development Testing

### Test with curl

```bash
# Test tool execution
curl -X POST http://localhost:3400/api/tools \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "calendar_check_availability",
    "parameters": {
      "startDate": "tomorrow",
      "appointmentType": "intro_class"
    }
  }'

# Test retention sweep
curl -X POST http://localhost:3400/api/flows/retention-sweep \
  -H "Content-Type: application/json" \
  -d '{
    "daysSinceLastAttendance": 14,
    "channel": "sms",
    "maxContacts": 5
  }'
```

### Test with Genkit UI

```bash
npm run genkit:start
```

Open http://localhost:4000 and test flows interactively.

---

## Support

For API issues or questions, see:
- GitHub Issues
- Documentation: /backend/README.md
- Deployment Guide: /backend/DEPLOYMENT.md
