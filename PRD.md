# Planning Guide

A comprehensive AI-powered academy management and automation platform for Gracie Barra that orchestrates all business operations: student enrollment, retention, communications, scheduling, billing, and inventory management. The system uses Firebase Genkit as the intelligent backend orchestrator with ElevenLabs + Twilio providing natural voice interactions, enabling the academy to operate autonomously while maintaining the human touch. The platform is branded to match Gracie Barra's visual identity and feels like an integrated part of their service ecosystem.

**Experience Qualities**:
1. **Bold** - Strong, confident design that embodies the martial arts spirit with high contrast and powerful visuals
2. **Intelligent** - Proactive AI system that anticipates needs, identifies issues, and takes action autonomously
3. **Unified** - Seamlessly integrated with Gracie Barra's brand identity, feeling like a native service rather than a third-party tool

**Complexity Level**: Complex Application (advanced functionality, likely with multiple views)
This is an enterprise-grade academy management platform with AI orchestration across 7 operational domains: Communications & Engagement, Lead Management & Enrollment, Student Retention & Account Management, Scheduling & Events, Data Integrity & Reporting, Inventory & Pro Shop, and Performance Metrics & KPIs. The system requires sophisticated state management, multi-channel integrations (voice, SMS, WhatsApp, Messenger), real-time monitoring, automated workflows, and comprehensive dashboards with actionable insights.

## Essential Features

### 1. Communications & Student Engagement System
- **Functionality**: Omnichannel communication management across phone, email, SMS, WhatsApp, Facebook, Instagram with AI-powered responses
- **Purpose**: Ensure all inquiries are answered within 24 hours with consistent, professional responses while maintaining student engagement
- **Trigger**: Incoming message/call from any channel, walk-in prospect notification, or scheduled outreach
- **Progression**: Incoming communication → Channel detection → AI context loading → Response generation → Human review queue (if needed) → Reply sent → Conversation logged
- **Success criteria**: <24hr response time, consistent tone across channels, prospect capture rate >90%, scheduled intro lessons >80% of qualified leads

### 2. Lead Management & Enrollment Operations
- **Functionality**: Complete lead lifecycle management from first contact through enrollment, including intro lesson scheduling, follow-ups, and enrollment workflow execution
- **Purpose**: Maximize enrollment conversions (10+ new members/month) with <20% drop between conversion stages
- **Trigger**: New prospect identified via any channel
- **Progression**: Lead capture → Qualification → Program presentation → Intro lesson scheduling → Reminder & confirmation → No-show recovery → Enrollment workflow → Payment setup → Student activation
- **Success criteria**: 10+ monthly enrollments, <20% stage drop rate, automated follow-up on no-shows, enrollment funnel visibility

### 3. Student Retention & Account Management
- **Functionality**: Proactive attendance monitoring, absentee recovery workflows, delinquent account detection and resolution, freeze/cancellation management with resell strategies
- **Purpose**: Minimize cancellations, protect recurring revenue, maintain <25% absentee rate and <8% delinquency rate
- **Trigger**: Daily attendance scan (automated), payment failure notification, freeze/cancellation request
- **Progression**: Issue detection → Classification (absentee/delinquent/at-risk) → Strategy selection → Outreach execution (voice/SMS/email) → Follow-up sequence → Resolution or escalation → Log outcome
- **Success criteria**: Absentee rate <25%, delinquency <8%, documented retention workflows, reduced churn rate

### 4. Scheduling, Events & Internal Coordination
- **Functionality**: Class schedule maintenance, seasonal event planning and communication, instructor and staff coordination
- **Purpose**: Keep all stakeholders informed about academy operations, schedule changes, and upcoming events
- **Trigger**: Schedule update, new event creation, or operational change
- **Progression**: Schedule/event update → Stakeholder identification → Multi-channel notification → Confirmation tracking → Reminder sequence → Post-event follow-up
- **Success criteria**: Real-time schedule accuracy, event attendance tracking, staff notification confirmation

### 5. Data Integrity, Reporting & Systems Accuracy
- **Functionality**: Automated data validation, student/billing record maintenance, attendance tracking, report generation for academy leadership
- **Purpose**: Ensure accurate, up-to-date operational data for decision-making and compliance
- **Trigger**: Data entry/modification, scheduled report generation, or data audit request
- **Progression**: Data input → Validation → CRM/billing system update → Conflict resolution → Audit log → Report generation → Leadership delivery
- **Success criteria**: Zero billing errors, daily attendance accuracy, automated weekly/monthly reports, data audit trail

### 6. Inventory & Pro Shop Operations
- **Functionality**: Product inventory monitoring, sales support for new and existing students, restocking alerts, product performance analytics
- **Purpose**: Maximize Pro Shop revenue, prevent stockouts, and support student equipment needs
- **Trigger**: Inventory level change, sales transaction, or restocking threshold reached
- **Progression**: Inventory scan → Low-stock detection → Reorder alert → Sales opportunity identification → Product recommendation → Transaction logging → Performance reporting
- **Success criteria**: No stockouts on core items, automated reorder alerts, sales tracking by product, upsell opportunities identified

### 7. Performance Metrics & KPI Dashboard
- **Functionality**: Real-time tracking and visualization of all academy KPIs with trend analysis and predictive insights
- **Purpose**: Monitor academy health, identify issues early, and measure AI system performance against targets
- **Trigger**: Continuous data aggregation from all system modules
- **Progression**: Data collection → Metric calculation → Trend analysis → Alert generation (if thresholds breached) → Dashboard update → Insight generation
- **Success criteria**: Real-time KPI visibility, automated alerts on threshold breaches, monthly target tracking (revenue, enrollments, retention, attendance, delinquency)

## Edge Case Handling

- **API Failures & Service Outages**: Graceful degradation with fallback to manual queues, retry mechanisms with exponential backoff, and clear status indicators when services are unavailable
- **Multi-Channel Message Conflicts**: Deduplication logic when same prospect contacts via multiple channels simultaneously
- **Payment Processing Errors**: Automated retry sequences, alternative payment method prompts, and manual resolution workflows with full audit trails
- **No-Show Recovery**: Escalating contact strategies (SMS → Email → Voice call) with AI-personalized messaging based on student history
- **Absentee False Positives**: Vacation/injury flag system to prevent inappropriate outreach to students on authorized absence
- **Staff Override Requirements**: Clear escalation paths when AI cannot resolve situations, with human approval workflows for policy exceptions
- **Data Synchronization Conflicts**: Timestamp-based conflict resolution with change history and rollback capabilities
- **Voice Call Interruptions**: Graceful handling of mid-call disconnects with callback offers and transcript preservation
- **Multi-Language Support**: Automatic language detection with multilingual AI responses (Spanish/Portuguese for Gracie Barra)
- **Inventory Synchronization**: Real-time stock updates across multiple sales channels to prevent overselling
- **KPI Threshold Breaches**: Automated alert escalation to academy leadership with recommended action plans
- **Incomplete Onboarding**: Progressive disclosure allowing partial system use while guiding toward full configuration

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
