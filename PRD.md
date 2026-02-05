# Planning Guide

An AI-powered commercial automation platform for Gracie Barra that enables them to automate their marketing, customer service, and payments through a unified interface powered by their own API credentials and AI models. The platform is branded to match Gracie Barra's visual identity and feels like an integrated part of their service ecosystem.

**Experience Qualities**:
1. **Bold** - Strong, confident design that embodies the martial arts spirit with high contrast and powerful visuals
2. **Professional** - Enterprise-grade reliability that instills trust for business operations
3. **Unified** - Seamlessly integrated with Gracie Barra's brand identity, feeling like a native service rather than a third-party tool

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

The design should evoke strength, discipline, and martial arts excellence while maintaining professional sophistication. Drawing directly from Gracie Barra's brand identity, the interface uses bold reds, strong black-and-white contrast, and athletic typography to create a command center that feels powerful and authoritative. The design language is clean, direct, and unapologetic - reflecting the confidence and precision of Brazilian Jiu-Jitsu. Every element should feel intentional and grounded, with geometric clarity and strong visual hierarchy.

## Color Selection

A bold, high-contrast palette inspired by Gracie Barra's martial arts heritage, emphasizing power and professionalism.

- **Primary Color**: Gracie Barra Red `oklch(0.48 0.23 25)` - Bold, energetic red representing passion, power, and the GB brand
- **Secondary Colors**: 
  - Deep black `oklch(0.20 0 0)` for authority and strength
  - Pure white `oklch(0.98 0 0)` for clarity and space
- **Accent Color**: Gracie Barra Red `oklch(0.48 0.23 25)` - Used consistently for CTAs, active states, and brand moments
- **Foreground/Background Pairings**: 
  - Primary Red: White text `oklch(0.99 0 0)` - Ratio 7.8:1 ✓
  - Secondary Black: White text `oklch(0.99 0 0)` - Ratio 16.5:1 ✓
  - Background `oklch(0.98 0 0)`: Foreground `oklch(0.15 0 0)` - Ratio 18.2:1 ✓
  - Card `oklch(1 0 0)`: Card foreground `oklch(0.15 0 0)` - Ratio 19.1:1 ✓

## Font Selection

Typography that conveys athletic strength and modern professionalism, reflecting Gracie Barra's martial arts discipline.

- **Primary Font**: Oswald - A bold, condensed sans-serif with athletic character for headings (used uppercase)
- **Secondary Font**: Roboto - Clean, highly legible for body text and forms
- **Accent Font**: Roboto Condensed - For brand elements and special headings

- **Typographic Hierarchy**: 
  - H1 (Dashboard Title): Oswald Black/48px/uppercase/tight letter-spacing/0.02em
  - H2 (Section Headers): Oswald Bold/32px/uppercase/tight letter-spacing/0.02em
  - H3 (Card Titles): Oswald SemiBold/18px/uppercase/normal letter-spacing
  - Body (Content): Roboto Regular/15px/normal line-height/1.6
  - Small (Meta Info): Roboto Regular/12px/uppercase/wide letter-spacing/0.05em
  - Button Text: Roboto Bold/14px/uppercase/wide letter-spacing/0.05em
  - Brand Text: Roboto Condensed Bold/varies/uppercase/tight letter-spacing/0.02em

## Animations

Animations should be direct and purposeful, emphasizing power and precision rather than playfulness. State transitions are quick and decisive (100-200ms), reflecting martial arts discipline. Use strong, geometric movements - elements slide in with authority, buttons respond with tactile feedback through shadow shifts, and success states are bold and immediate. Avoid bouncy or elastic easing; instead use sharp, confident linear or ease-out transitions. Box shadows shift to create a "pressed" effect on interactions, giving physical weight to digital actions.

## Component Selection

- **Components**: 
  - Dashboard layout with dark `Sidebar` featuring Gracie Barra shield logo for navigation
  - `Card` components with thick borders (4px) and hard shadow effects for depth
  - `Tabs` for switching between channel types with bold, uppercase labels
  - `Dialog` for credential input and campaign wizards
  - `Form` with thick-bordered `Input`, `Textarea`, `Select` 
  - `Table` with strong grid lines for campaign performance
  - `Badge` with solid backgrounds for status indicators
  - `Button` with thick borders and offset shadow effects (brutalist style)
  - `Avatar` with square shapes instead of circles to match geometric theme
  - `Progress` bars with thick, solid fills
  - `Alert` with strong borders and high-contrast backgrounds
  - Custom Gracie Barra shield icon component for branding moments

- **Customizations**: 
  - All cards and buttons use thick (4px) borders with offset black shadows (brutalist/neo-brutalist style)
  - Hover states shift shadows from 4px to 2px offset, creating "press" effect
  - All text in headings and buttons is uppercase for strength
  - Logo uses GB shield icon instead of generic symbols
  - Red accent color used consistently for active states and CTAs
  - Minimal border-radius (0.25rem) for sharper, more athletic appearance

- **States**: 
  - Buttons: Thick border with offset shadow (4px 4px), hover reduces shadow (2px 2px) and shifts position, active has no shadow
  - Inputs: 2px border, focus shows red ring, no rounded corners
  - Cards: 4px border with 4px offset shadow, hover adds red shadow or changes border color
  - Status badges: Solid backgrounds with uppercase text, no subtle variants

- **Icon Selection**: 
  - Phosphor icons with "fill" weight for boldness
  - `ShieldCheck` for Gracie Barra/security features
  - `ChartLine` for analytics
  - `MegaphoneSimple` for campaigns
  - `ChatCircle` for messaging
  - `Phone` for calls
  - `CreditCard` for payments
  - `GearSix` for settings
  - `Link` for landing pages

- **Spacing**: 
  - Larger gaps (6-8px) for breathing room between bold elements
  - Dashboard cards: p-6 with gap-6
  - Form fields: gap-4 with prominent labels
  - Section spacing: my-8
  - Consistent 4px base for borders and shadows

- **Mobile**: 
  - Sidebar becomes bottom nav with shield icon centered
  - Cards stack with full-width on mobile
  - Tables convert to card views
  - Touch targets minimum 44px with thick borders maintained
  - Bottom sheets for forms instead of dialogs
