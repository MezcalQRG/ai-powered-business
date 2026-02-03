# Planning Guide

An all-in-one AI-powered commercial automation platform that enables businesses to automate their marketing, customer service, and payments through a unified interface powered by their own API credentials and AI models.

**Experience Qualities**:
1. **Professional** - Enterprise-grade interface that instills confidence and trust for business operations
2. **Intelligent** - AI-driven workflows that feel effortless and contextually aware of business needs
3. **Empowering** - Gives users complete control over their automation without technical complexity

**Complexity Level**: Complex Application (advanced functionality, likely with multiple views)
This is a full-featured business automation platform with multiple interconnected systems (advertising, messaging, voice AI, payments, landing pages), requiring sophisticated state management, API integrations, multi-step workflows, and a comprehensive dashboard interface.

## Essential Features

### Authentication & Onboarding
- **Functionality**: Complete user registration, login, and business profile creation
- **Purpose**: Secure access control and business context gathering for AI personalization
- **Trigger**: New user arrives at landing page or returning user accesses login
- **Progression**: Landing page → Sign up form → Business setup wizard → Dashboard
- **Success criteria**: User can create account, complete business profile with AI prompt, and access dashboard

### Business Configuration Hub
- **Functionality**: Central configuration for business prompt and third-party API credentials
- **Purpose**: Establishes the AI knowledge base and connects external services
- **Trigger**: First login or accessing settings from dashboard
- **Progression**: Setup wizard → Business description form → API credentials input → Validation → Save confirmation
- **Success criteria**: Business prompt saved, API keys securely stored, connection status displayed

### Meta Ads Automation
- **Functionality**: AI-powered ad creation for Facebook/Instagram with image and copy generation
- **Purpose**: Automate marketing campaign creation without design or copywriting expertise
- **Trigger**: User clicks "Create Campaign" from dashboard
- **Progression**: Campaign setup → Select ad account → AI generates images + copy → Configure targeting → Review → Create in Meta API → Campaign created (paused) → User can activate when ready
- **Success criteria**: Complete campaign with ad sets and creatives created via Meta Marketing API, viewable in platform dashboard and Meta Ads Manager, AI-generated copy and images, real-time sync with Meta

### Multi-Channel AI Assistant
- **Functionality**: Automated conversational AI across Messenger, WhatsApp, SMS
- **Purpose**: Handle customer inquiries 24/7 with business-contextual responses
- **Trigger**: Customer sends message on any connected channel
- **Progression**: Message received → AI analyzes intent → Generates contextual response → Sends reply → Logs conversation
- **Success criteria**: Messages answered within seconds, conversation history tracked, escalation options available

### Voice AI Agent
- **Functionality**: Intelligent phone call handling with ElevenLabs voice synthesis
- **Purpose**: Automate inbound call responses with natural voice interactions
- **Trigger**: Incoming call to Twilio number
- **Progression**: Call received → Voice AI greets → Processes speech → Generates response → Speaks via ElevenLabs → Logs interaction
- **Success criteria**: Calls answered automatically, natural conversation flow, transcripts saved

### Landing Page Builder
- **Functionality**: Customizable payment-enabled landing pages from templates
- **Purpose**: Provide conversion-optimized pages for products/services with integrated checkout
- **Trigger**: User selects "Create Landing Page" from dashboard
- **Progression**: Choose template → Customize branding/content → Configure payment → Publish → Generate shareable link
- **Success criteria**: Live landing page with working payment integration, analytics tracking

## Edge Case Handling

- **API Failures**: Graceful error handling with clear messaging, retry mechanisms, and fallback options when third-party services are unavailable
- **Missing Credentials**: Guided prompts to add required API keys when attempting actions that need them, with setup tutorials
- **AI Rate Limits**: Queue system for AI requests with user notification about processing delays
- **Invalid Business Prompt**: Validation and suggestions to improve business description for better AI performance
- **Payment Processing Errors**: Clear error messages with troubleshooting steps, transaction logs for debugging
- **Multi-Language Messages**: Language detection and appropriate AI response generation based on customer language
- **Incomplete Onboarding**: Save partial progress and allow users to resume configuration later

## Design Direction

The design should evoke confidence, sophistication, and technological innovation - feeling like a premium enterprise SaaS platform while remaining approachable. The interface should feel like a command center where users orchestrate their entire business automation, with clear data visualization, real-time status indicators, and intuitive workflows that make complex operations feel simple.

## Color Selection

A modern tech-forward palette with rich purples and electric accents to convey innovation and premium quality.

- **Primary Color**: Deep vibrant purple `oklch(0.48 0.18 285)` - Represents innovation, premium service, and AI technology
- **Secondary Colors**: 
  - Rich violet `oklch(0.35 0.15 290)` for depth and hierarchy
  - Soft lavender `oklch(0.85 0.08 295)` for backgrounds and subtle elements
- **Accent Color**: Electric cyan `oklch(0.75 0.15 195)` - High-energy highlight for CTAs, success states, and interactive elements
- **Foreground/Background Pairings**: 
  - Primary Purple: White text `oklch(0.99 0 0)` - Ratio 8.2:1 ✓
  - Accent Cyan: Deep violet text `oklch(0.25 0.1 290)` - Ratio 7.5:1 ✓
  - Background `oklch(0.98 0.01 285)`: Foreground `oklch(0.20 0.05 290)` - Ratio 13.8:1 ✓
  - Card `oklch(1 0 0)`: Card foreground `oklch(0.22 0.05 290)` - Ratio 15.2:1 ✓

## Font Selection

Typography should convey modern professionalism with excellent readability for data-heavy interfaces while maintaining personality through distinctive headline treatments.

- **Primary Font**: Space Grotesk - A geometric sans with tech-forward character for headings and key UI elements
- **Secondary Font**: Inter - Clean, highly legible for body text, forms, and data tables

- **Typographic Hierarchy**: 
  - H1 (Dashboard Title): Space Grotesk Bold/32px/tight letter-spacing/-0.02em
  - H2 (Section Headers): Space Grotesk SemiBold/24px/tight letter-spacing/-0.01em
  - H3 (Card Titles): Space Grotesk Medium/18px/normal letter-spacing
  - Body (Content): Inter Regular/15px/relaxed line-height/1.6
  - Small (Meta Info): Inter Regular/13px/normal line-height/1.5
  - Button Text: Inter SemiBold/14px/normal letter-spacing/0.01em

## Animations

Animations should emphasize state transitions, data updates, and successful actions, creating a sense of intelligent responsiveness. Use subtle micro-interactions for button states and form inputs, smooth page transitions between dashboard views, and celebratory animations for successful campaign launches or payment completions. Real-time updates (new messages, call notifications) should slide in gracefully. Loading states should use skeleton screens rather than spinners to maintain spatial consistency.

## Component Selection

- **Components**: 
  - Dashboard layout with `Sidebar` for navigation between modules (Campaigns, Messages, Calls, Landing Pages, Settings)
  - `Card` components for metric displays and feature modules with hover elevation effects
  - `Tabs` for switching between channel types (WhatsApp, Messenger, SMS) in messaging view
  - `Dialog` for credential input, campaign creation wizards, and confirmation modals
  - `Form` with `Input`, `Textarea`, `Select` for business setup and configuration
  - `Table` for campaign performance, conversation logs, and call history
  - `Badge` for status indicators (connected, pending, error) on API integrations
  - `Button` with variants for primary actions (Create Campaign, Send Message) and secondary (Cancel, Edit)
  - `Avatar` for user profile and customer conversation threads
  - `Progress` indicators for multi-step wizards and AI processing status
  - `Alert` for system notifications and integration warnings
  - `Skeleton` for loading states across dashboard widgets
  - `Switch` for toggling automation features on/off

- **Customizations**: 
  - Custom dashboard grid layout with drag-and-drop widget repositioning
  - Real-time message thread component with typing indicators
  - AI prompt editor with syntax highlighting and suggestions
  - Campaign preview component showing ad mockups
  - Voice call visualizer showing live transcription during calls
  - Analytics charts using recharts for performance metrics

- **States**: 
  - Buttons: Default has subtle shadow, hover lifts with increased shadow, active presses down, disabled shows muted with reduced opacity
  - Inputs: Default with subtle border, focus shows primary ring with elevated appearance, error state with destructive border and shake animation, success with accent border and checkmark
  - Cards: Resting state with soft shadow, hover increases elevation and shows interactive border glow for clickable cards
  - Status badges: Animated pulse for "processing" states, solid for completed, alert icon for errors

- **Icon Selection**: 
  - Phosphor icons throughout for consistency
  - `Lightning` for AI features
  - `ChartLine` for analytics
  - `MegaphoneSimple` for campaigns
  - `ChatCircle` for messaging
  - `Phone` for calls
  - `CreditCard` for payments
  - `GearSix` for settings
  - `Link` for landing pages
  - `CheckCircle` for success states
  - `Warning` for alerts

- **Spacing**: 
  - Consistent 4px base unit (Tailwind's default)
  - Dashboard cards: p-6 with gap-6 between cards
  - Form fields: gap-4 for vertical stacking
  - Section spacing: my-8 for major sections
  - Sidebar: py-4 px-3 for nav items
  - Mobile padding: p-4 for screens, p-3 for cards

- **Mobile**: 
  - Sidebar collapses to bottom navigation bar on mobile
  - Dashboard cards stack vertically on small screens
  - Tables convert to card-based views with key metrics highlighted
  - Multi-step wizards show progress indicator at top with one step per screen
  - Floating action button for primary actions (Create Campaign) on mobile
  - Bottom sheets for forms and detail views instead of dialogs
  - Swipe gestures for navigating between conversation threads
