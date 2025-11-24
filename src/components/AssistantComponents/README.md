# Assistant Components

This folder contains all sub-components for the Assistant page, organized for better maintainability and reusability.

## Component Structure

### Main Components

#### `StepIndicator.tsx`
- Visual step indicator showing progress (1-4)
- Displays current step, completed steps, and remaining steps
- Color-coded: Green (completed), Blue (current), Gray (pending)

#### `ModalHeader.tsx`
- Modal header with title and close button
- Shows selected user information
- Handles modal close action

#### `AssistantTable.tsx`
- Displays list of all assistants in a table format
- Shows agent name, user, type, creation date
- Includes delete action button
- Handles loading and empty states

### Step Components

#### `Step1UserBasicInfo.tsx`
- User selection dropdown (approved users with bearer token)
- Basic information fields:
  - Agent Name
  - Agent Type (Conversation/Webhook/Other)
  - Webhook URL
  - Welcome Message
  - System Prompt

#### `Step2LLMVoiceConfig.tsx`
- **LLM Configuration:**
  - Provider (OpenAI, Anthropic, Groq)
  - Model, Temperature, Max Tokens
  - Top P, Min P settings
  
- **Voice Synthesizer Configuration:**
  - Provider (Polly, ElevenLabs, Deepgram)
  - Voice, Engine, Language
  - Audio Format, Buffer Size

#### `Step3TranscriberIO.tsx`
- **Speech-to-Text Configuration:**
  - Provider (Deepgram, Whisper, AssemblyAI)
  - Model, Language, Encoding
  - Sampling Rate, Endpointing
  
- **Input/Output Configuration:**
  - Input Provider & Format
  - Output Provider & Format
  - Support for Plivo, Twilio, Exotel

#### `Step4TaskConfig.tsx`
- **Conversation Behavior Settings:**
  - Hangup After Silence
  - Incremental Delay
  - Words for Interruption
  - Call Terminate Duration
  - Backchanneling Toggle
  
- **Configuration Summary:**
  - Complete overview of all settings
  - User, Agent, LLM, Voice, Transcriber, I/O details

### Navigation Component

#### `NavigationButtons.tsx`
- Previous button (shows from step 2 onwards)
- Next button (steps 1-3)
- Create Assistant button (step 4 with loading state)
- Cancel button (all steps)
- Handles validation and step transitions

## Usage

All components are exported through `index.ts`:

```typescript
import {
  StepIndicator,
  Step1UserBasicInfo,
  Step2LLMVoiceConfig,
  Step3TranscriberIO,
  Step4TaskConfig,
  NavigationButtons,
  ModalHeader,
  AssistantTable
} from '../components/AssistantComponents';
```

## Props Flow

Components receive necessary data and handlers from the parent `Assistant.tsx` component:
- `formData` and `setFormData` for form state management
- `selectedUser` and user selection handlers
- Navigation handlers (`onNext`, `onPrevious`, `onCancel`)
- API states (`isLoading`, `isPending`)

## Styling

All components use:
- Tailwind CSS for styling
- Consistent color schemes per section
- Responsive design (mobile-first approach)
- Lucide React icons
- Smooth transitions and hover effects
