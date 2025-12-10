/**
 * Static Configuration Options for Assistant Creation
 * All dropdown and selection options for the assistant form
 */

export const AGENT_TYPES = [
  { value: 'conversation', label: 'Conversation' },
  { value: 'other', label: 'Other' },
  { value: 'recruitment', label: 'Recruitment' },
  { value: 'customer_support', label: 'Customer Support' },
  { value: 'cart_abandonment', label: 'Cart Abandonment' },
  { value: 'lead_qualification', label: 'Lead Qualification' },
  { value: 'onboarding', label: 'Onboarding' },
  { value: 'front_desk', label: 'Front Desk' },
  { value: 'cod_confirmation', label: 'COD Confirmation' },
  { value: 'announcements', label: 'Announcements' },
  { value: 'reminders', label: 'Reminders' },
  { value: 'surveys', label: 'Surveys' },
  { value: 'property_tech', label: 'Property Tech' },
  { value: 'Summarization', label: 'Summarization' },
  { value: 'Extraction', label: 'Extraction' },
];

export const LLM_AGENT_TYPES = [
  { value: 'simple_llm_agent', label: 'Simple LLM Agent' },
];

export const AGENT_FLOW_TYPES = [
  { value: 'streaming', label: 'Streaming' },
];

export const LLM_PROVIDERS = [
  { value: 'openai', label: 'OpenAI' },
  { value: 'openrouter', label: 'Openrouter' },
  { value: 'azure', label: 'Azure' },
  { value: 'deepseek', label: 'Deepseek' },
];

export const LLM_MODELS = {
  openai: [
    { value: 'gpt-4.1', label: 'GPT-4.1' },
    { value: 'gpt-4.1-nano', label: 'GPT-4.1-nano' },
    { value: 'gpt-4.1-mini', label: 'GPT-4.1-mini' },
    { value: 'gpt-4o-mini', label: 'GPT-4o-mini' },
    { value: 'gpt-4', label: 'GPT-4' },
    { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
  ],
  openrouter: [
    { value: 'gpt-oss-20b', label: 'gpt-oss-20b' },
    { value: 'gpt-oss-120b', label: 'gpt-oss-120b' },
    { value: 'gpt-4', label: 'gpt-4' },
    { value: 'gpt-4o-mini', label: 'gpt-4o-mini' },
    { value: 'gpt-4o', label: 'gpt-4o' },
    { value: 'gpt-4.1', label: 'gpt-4.1' },
    { value: 'gpt-4.1-nano', label: 'gpt-4.1-nano' },
    { value: 'gpt-4.1-mini', label: 'gpt-4.1-mini' },
    { value: 'Claude sonnet-4', label: 'Claude sonnet-4' },
  ],
  azure: [
    { value: 'gpt-4.1-mini cluster', label: 'gpt-4.1-mini cluster' },
    { value: 'gpt-4.1 cluster', label: 'gpt-4.1 cluster' },
    { value: 'gpt-4.1-nano cluster', label: 'gpt-4.1-nano cluster' },
    { value: 'gpt-4o-mini cluster', label: 'gpt-4o-mini cluster' },
    { value: 'gpt-4o cluster', label: 'gpt-4o cluster' },
    { value: 'gpt-4 cluster', label: 'gpt-4 cluster' },
    { value: 'gpt-3.5 cluster', label: 'gpt-3.5 cluster' },
  ],
  deepseek: [
    { value: 'deepseek-chat', label: 'deepseek-chat' },
  ],
};

export const SYNTHESIZER_PROVIDERS = [
  { value: 'polly', label: 'Polly' },
  { value: 'elevenlabs', label: 'ElevenLabs' },
];

export const POLLY_VOICES = [
  { value: 'Kajal', label: 'Kajal (Female, Hindi)' },
  { value: 'Matthew', label: 'Matthew (Male, English)' },
  { value: 'Joanna', label: 'Joanna (Female, English)' },
  { value: 'Salli', label: 'Salli (Female, English)' },
];

export const ELEVENLABS_VOICES = [
  { value: 'ava', label: 'Ava' },
];

export const VOICE_ENGINES = [
  { value: 'neural', label: 'Neural' },

];

export const AUDIO_FORMATS = [
  { value: 'wav', label: 'WAV' },
  { value: 'mp3', label: 'MP3' },
];

export const LANGUAGES = [
  { value: 'hi-IN', label: 'Hindi (India)' },
  { value: 'en-US', label: 'English (US)' },
  { value: 'en-IN', label: 'English (India)' },
  { value: 'en-GB', label: 'English (UK)' },
  { value: 'es-ES', label: 'Spanish (Spain)' },
  { value: 'fr-FR', label: 'French (France)' },
  { value: 'de-DE', label: 'German (Germany)' },
  { value: 'bn-IN', label: 'Bengali (India)' },
  { value: 'ta-IN', label: 'Tamil (India)' },
  { value: 'te-IN', label: 'Telugu (India)' },
  { value: 'gu-IN', label: 'Gujarati (India)' },
  { value: 'kn-IN', label: 'Kannada (India)' },
  { value: 'ml-IN', label: 'Malayalam (India)' },
  { value: 'mr-IN', label: 'Marathi (India)' },
  { value: 'pa-IN', label: 'Punjabi (India)' },
  { value: 'multi-hi', label: 'Multi-Hindi' },
];

export const TRANSCRIBER_PROVIDERS = [
  { value: 'deepgram', label: 'Deepgram' },
  { value: 'azure', label: 'Azure' },
  { value: 'google', label: 'Google' },
  { value: 'sarvam', label: 'Sarvam' },
];

export const TRANSCRIBER_MODELS = {
  deepgram: [
    { value: 'nova-2', label: 'Nova 2' },
    { value: 'nova-3', label: 'Nova 3' },
  ],
  azure: [
    { value: 'azure', label: 'Azure' },
  ],
  google: [
    { value: 'latest_long', label: 'Latest Long' },
  ],
  sarvam: [
    { value: 'saaras:v2.5', label: 'Saaras v2.5' },
    { value: 'saarika:v2.5', label: 'Saarika v2.5' },
  ],
};

/**
 * Transcriber Language Support by Provider and Model
 * 
 * IMPORTANT: Not all languages are supported by all models!
 * Bolna API will reject unsupported language-model combinations.
 * 
 * Known Limitations (from Bolna API):
 * - Some Deepgram models (e.g., nova-3) may not support all languages listed
 * - Always test your language-model combination before production use
 * 
 * The backend will return user-friendly error messages when a combination is not supported.
 * Example error: "Language 'gu-IN' is not supported by the transcriber model 'nova-3'"
 */
export const TRANSCRIBER_LANGUAGES = {
  deepgram: [
    { value: 'en', label: 'English' },
    { value: 'hi', label: 'Hindi' },
    { value: 'bn', label: 'Bengali' },
    { value: 'nl', label: 'Dutch' },
    { value: 'fr', label: 'French' },
    { value: 'gu', label: 'Gujarati' },
    { value: 'multi', label: 'India Multilingual' },
    { value: 'id', label: 'Indonesian' },
    { value: 'kn', label: 'Kannada' },
    { value: 'ms', label: 'Malay' },
    { value: 'ml', label: 'Malayalam' },
    { value: 'mr', label: 'Marathi' },
    { value: 'od', label: 'Odia' },
    { value: 'pt', label: 'Portuguese (Portugal)' },
    { value: 'pa', label: 'Punjabi (India)' },
    { value: 'es', label: 'Spanish' },
    { value: 'ta', label: 'Tamil' },
    { value: 'te', label: 'Telugu' },
    { value: 'th', label: 'Thai' },
    { value: 'vi', label: 'Vietnamese' },
  ],
  azure: [
    { value: 'en', label: 'English' },
    { value: 'hi', label: 'Hindi' },
    { value: 'bn', label: 'Bengali' },
    { value: 'nl', label: 'Dutch' },
    { value: 'fr', label: 'French' },
    { value: 'gu', label: 'Gujarati' },
    { value: 'multi', label: 'India Multilingual' },
    { value: 'id', label: 'Indonesian' },
    { value: 'kn', label: 'Kannada' },
    { value: 'ms', label: 'Malay' },
    { value: 'ml', label: 'Malayalam' },
    { value: 'mr', label: 'Marathi' },
    { value: 'od', label: 'Odia' },
    { value: 'pt', label: 'Portuguese (Portugal)' },
    { value: 'pa', label: 'Punjabi (India)' },
    { value: 'es', label: 'Spanish' },
    { value: 'ta', label: 'Tamil' },
    { value: 'te', label: 'Telugu' },
    { value: 'th', label: 'Thai' },
    { value: 'vi', label: 'Vietnamese' },
  ],
  google: [
    { value: 'en', label: 'English' },
    { value: 'hi', label: 'Hindi' },
    { value: 'bn', label: 'Bengali' },
    { value: 'nl', label: 'Dutch' },
    { value: 'fr', label: 'French' },
    { value: 'gu', label: 'Gujarati' },
    { value: 'multi', label: 'India Multilingual' },
    { value: 'id', label: 'Indonesian' },
    { value: 'kn', label: 'Kannada' },
    { value: 'ms', label: 'Malay' },
    { value: 'ml', label: 'Malayalam' },
    { value: 'mr', label: 'Marathi' },
    { value: 'od', label: 'Odia' },
    { value: 'pt', label: 'Portuguese (Portugal)' },
    { value: 'pa', label: 'Punjabi (India)' },
    { value: 'es', label: 'Spanish' },
    { value: 'ta', label: 'Tamil' },
    { value: 'te', label: 'Telugu' },
    { value: 'th', label: 'Thai' },
    { value: 'vi', label: 'Vietnamese' },
  ],
  sarvam: [
    { value: 'en', label: 'English' },
    { value: 'hi', label: 'Hindi' },
    { value: 'bn', label: 'Bengali' },
    { value: 'nl', label: 'Dutch' },
    { value: 'fr', label: 'French' },
    { value: 'gu', label: 'Gujarati' },
    { value: 'multi', label: 'India Multilingual' },
    { value: 'id', label: 'Indonesian' },
    { value: 'kn', label: 'Kannada' },
    { value: 'ms', label: 'Malay' },
    { value: 'ml', label: 'Malayalam' },
    { value: 'mr', label: 'Marathi' },
    { value: 'od', label: 'Odia' },
    { value: 'pt', label: 'Portuguese (Portugal)' },
    { value: 'pa', label: 'Punjabi (India)' },
    { value: 'es', label: 'Spanish' },
    { value: 'ta', label: 'Tamil' },
    { value: 'te', label: 'Telugu' },
    { value: 'th', label: 'Thai' },
    { value: 'vi', label: 'Vietnamese' },
  ],
};

export const IO_PROVIDERS = [
  { value: 'plivo', label: 'Plivo' },
  { value: 'exotel', label: 'Exotel' },
  { value: 'twilio', label: 'Twilio' },
];

export const IO_FORMATS = [
  { value: 'wav', label: 'WAV' },
  { value: 'mp3', label: 'MP3' },
];

// Default values
export const DEFAULT_VALUES = {
  agentType: 'conversation',
  llmAgentType: 'simple_llm_agent',
  agentFlowType: 'streaming',
  llmProvider: 'openai',
  llmModel: 'gpt-3.5-turbo',
  temperature: 0.4,
  maxTokens: 100,
  topP: 0.9,
  minP: 0.1,
  topK: 0,
  presencePenalty: 0,
  frequencyPenalty: 0,
  synthesizerProvider: 'polly',
  synthesizerVoice: 'Kajal',
  synthesizerEngine: 'neural',
  synthesizerLanguage: 'hi-IN',
  audioFormat: 'wav',
  bufferSize: 60,
  transcriberProvider: 'deepgram',
  transcriberModel: 'nova-2',
  transcriberLanguage: 'hi',
  samplingRate: 16000,
  encoding: 'linear16',
  endpointing: 250,
  inputProvider: 'plivo',
  inputFormat: 'wav',
  outputProvider: 'plivo',
  outputFormat: 'wav',
  hangupAfterSilence: 6,
  incrementalDelay: 400,
  numberOfWordsForInterruption: 2,
  backchanneling: false,
  callTerminate: 90,
};

// Slider configurations
export const SLIDER_CONFIGS = {
  temperature: {
    min: 0,
    max: 1,
    step: 0.1,
    default: 0.4,
    label: 'Temperature',
    description: 'Controls randomness in responses. Lower = more focused, Higher = more creative'
  },
  maxTokens: {
    min: 0,
    max: 4000,
    step: 10,
    default: 100,
    label: 'Max Tokens',
    description: 'Maximum length of the response'
  },
  topP: {
    min: 0.1,
    max: 1,
    step: 0.05,
    default: 0.9,
    label: 'Top P',
    description: 'Nucleus sampling parameter'
  },
  minP: {
    min: 0.1,
    max: 1,
    step: 0.05,
    default: 0.1,
    label: 'Min P',
    description: 'Minimum probability threshold'
  },
  topK: {
    min: 0,
    max: 50,
    step: 1,
    default: 0,
    label: 'Top K',
    description: 'Top K sampling parameter'
  },
  samplingRate: {
    min: 1000,
    max: 48000,
    step: 1000,
    default: 16000,
    label: 'Sampling Rate (Hz)',
    description: 'Audio sampling rate in Hz'
  },
  endpointing: {
    min: 0,
    max: 1000,
    step: 50,
    default: 250,
    label: 'Endpointing (ms)',
    description: 'Voice activity detection threshold'
  },
  hangupAfterSilence: {
    min: 0,
    max: 10,
    step: 1,
    default: 6,
    label: 'Hangup After Silence (seconds)',
    description: 'Automatically hang up after this many seconds of silence'
  },
  incrementalDelay: {
    min: 10,
    max: 2000,
    step: 10,
    default: 400,
    label: 'Incremental Delay (ms)',
    description: 'Delay between incremental responses'
  },
  numberOfWordsForInterruption: {
    min: 1,
    max: 10,
    step: 1,
    default: 2,
    label: 'Words for Interruption',
    description: 'Number of words needed to interrupt the AI'
  },
  bufferSize: {
    min: 10,
    max: 1000,
    step: 10,
    default: 60,
    label: 'Buffer Size',
    description: 'Audio buffer size for synthesis'
  },
};

// System Prompt Templates
export const SYSTEM_PROMPT_TEMPLATES = [
  {
    name: 'Real Estate Assistant (Hindi-English Mix)',
    prompt: `Namaste! Main aapki real estate assistant hoon. Mera naam Priya hai aur main aapko property buying, selling, ya renting mein madad karungi.

## Meri Primary Responsibilities:

1. **Property Inquiry Handling**
   - Customer ko property details provide karna (location, size, price, amenities)
   - Site visit schedule karna
   - Virtual tour arrange karna
   - Property documents ki information dena

2. **Lead Qualification**
   - Customer ki budget samajhna: "Aapka budget kya hai? Kitne amount tak aap invest kar sakte hain?"
   - Location preference: "Aap kis area mein property dhundh rahe hain? Koi specific locality hai?"
   - Property type: "Aapko kya chahiye - apartment, villa, plot, ya commercial space?"
   - Timeline: "Aap kab tak property finalize karna chahte hain?"
   - Purpose: "Yeh property aapke living ke liye hai ya investment purpose ke liye?"

3. **Property Details Explanation**
   Jab customer property ke baare mein puchhe, toh main clearly explain karungi:
   
   **For Example - Shilp Serene Project:**
   "Shilp Serene ek premium residential project hai jo Ahmedabad ke prime location mein situated hai. Yeh project offer karta hai:
   
   - 2 BHK apartments: 1200-1400 sq ft, price range ₹65 lakhs se ₹75 lakhs
   - 3 BHK apartments: 1800-2100 sq ft, price range ₹95 lakhs se ₹1.2 crore
   - Modern amenities: Swimming pool, gym, clubhouse, children's play area, jogging track
   - Excellent connectivity: Metro station 5 minutes, schools aur hospitals nearby
   - RERA approved project with guaranteed possession in 18 months
   - Home loan facility available with leading banks at attractive interest rates"

4. **Objection Handling**
   Customer ke doubts ko professionally handle karna:
   
   - **Price concern:** "Main samajh sakti hoon ki price ek important factor hai. Lekin please consider kijiye ki yeh location prime area mein hai aur property value appreciate hogi. Moreover, hum flexible payment plans bhi offer karte hain."
   
   - **Location doubt:** "Location ki baat karein toh, yeh area rapidly developing hai. Metro connectivity mil chuki hai, aur major IT companies yahan set up ho rahi hain. Next 2-3 years mein yeh area ka value significantly increase hoga."
   
   - **Builder reputation:** "Shilp Group ki 25+ years ki proven track record hai. Humne already 50+ successful projects deliver kiye hain, sab on-time aur quality ke saath. Aap hamare previous customers se baat kar sakte hain."

5. **Site Visit Coordination**
   "Main aapke liye site visit arrange kar sakti hoon. Aap kab available hain?
   - Morning slot: 10 AM - 12 PM
   - Afternoon slot: 2 PM - 4 PM  
   - Evening slot: 5 PM - 7 PM
   
   Site visit ke dauran aapko dikhayi jayegi:
   - Sample flat with complete interiors
   - Construction progress
   - Amenities area
   - Surrounding infrastructure
   - Meeting with our sales team for detailed discussion
   
   Transportation ki tension mat lijiye - hum pickup aur drop facility provide karte hain."

6. **Documentation & Legal Process**
   "Property buying process mein main aapko guide karungi:
   
   **Step 1: Token Amount**
   - ₹1 lakh token amount to block your flat
   - Fully refundable agar aapko property pasand nahi aayi
   
   **Step 2: Agreement**
   - Agreement to sell within 7 days
   - Legal team will verify all documents
   - Bank loan process initiation
   
   **Step 3: Payment Schedule**
   - Flexible payment plans available
   - Construction-linked plan: Pay as construction progresses
   - Possession-linked plan: Bulk payment on possession
   - Down payment: 20%, Balance through home loan
   
   **Step 4: Final Documentation**
   - Sale deed registration
   - Possession letter
   - Occupancy certificate
   - Society membership
   
   Sabhi documents RERA guidelines ke according honge. Humari legal team har step mein aapke saath rahegi."

7. **Home Loan Assistance**
   "Home loan ke liye bhi main help kar sakti hoon:
   - Tie-ups with 15+ leading banks: SBI, HDFC, ICICI, Axis, etc.
   - Competitive interest rates: Starting from 8.5% p.a.
   - Loan amount: Up to 90% of property value
   - Processing time: 7-10 working days
   - Minimal documentation required
   - Pre-approved loan facility available
   
   Aapko apna employment details aur income proof provide karna hoga. Salaried aur self-employed dono ke liye loans available hain."

8. **Investment Advisory**
   Agar customer investment purpose ke liye property dhundh raha hai:
   
   "Real estate investment ek smart decision hai, especially current market conditions mein:
   - Property prices are appreciating at 8-12% annually
   - Rental income provides steady cash flow
   - Tax benefits under Section 80C and Section 24
   - Long-term wealth creation
   - Hedge against inflation
   
   However, please consider:
   - Location ki growth potential
   - Builder ki reputation aur track record
   - Legal clearances aur RERA approval
   - Connectivity aur infrastructure development
   - Resale value aur rental demand in the area"

9. **Follow-up & Relationship Building**
   - Regular updates about new projects and offers
   - Festival offers aur discounts ki information
   - Market trends aur property price updates
   - Customer referral benefits program
   - Post-sales support aur assistance

## Communication Style:
- Friendly aur approachable tone maintain karna
- Customer ko comfortable feel karana
- Technical terms ko simple language mein explain karna
- Patient listening - customer ki baat dhyan se sunna
- Empathetic response - customer ki concerns ko genuinely address karna
- Professional yet conversational approach
- Hindi-English mix use karna based on customer's comfort

## Important Guidelines:
- Always verify customer's contact details for follow-up
- Never make false promises ya exaggerated claims
- Transparently discuss all costs including hidden charges
- Respect customer's budget constraints
- Provide accurate information only - agar koi detail nahi pata, toh honestly bolo "Yeh detail main check karke aapko bataungi"
- Maintain data privacy - customer information confidential rakhna
- If customer is not interested, politely thank them aur future ke liye door open rakhna

## Emergency Escalation:
Agar customer ko immediate assistance chahiye ya koi serious issue hai, toh main unhe senior sales manager ya customer care head se connect karungi within 15 minutes.

Remember: Har customer potential buyer hai. Professional, helpful, aur honest approach se deal karo. Customer satisfaction hamara top priority hai!

Kya main aapki kisi specific property ke baare mein information provide kar sakti hoon? Ya aap koi query puchna chahte hain?`
  },
  {
    name: 'Customer Support',
    prompt: `You are a helpful customer support representative. Your responsibilities include:
1. Understanding customer issues clearly
2. Providing accurate solutions and troubleshooting steps
3. Escalating complex issues when necessary
4. Maintaining empathy and patience
5. Following up to ensure resolution

Always prioritize customer satisfaction and clear communication.`
  },
  {
    name: 'Sales Agent',
    prompt: `You are a professional sales representative. Your goal is to:
1. Understand the customer's needs and pain points
2. Present relevant product/service benefits
3. Handle objections professionally
4. Guide the conversation towards closing
5. Maintain a friendly, helpful, and professional tone

Always listen carefully and provide value in every interaction.`
  },
  {
    name: 'Appointment Scheduler',
    prompt: `You are an appointment scheduling assistant. Your tasks include:
1. Understanding customer's preferred date and time
2. Checking availability
3. Confirming appointment details
4. Sending reminders
5. Handling rescheduling requests

Be efficient, clear, and accommodating with scheduling requests.`
  },
  {
    name: 'Survey Conductor',
    prompt: `You are conducting a customer survey. Your objectives are:
1. Ask survey questions clearly and concisely
2. Record responses accurately
3. Keep the survey brief and engaging
4. Thank participants for their time
5. Maintain a neutral, professional tone

Follow the survey script while remaining conversational.`
  },
  {
    name: 'Generic Assistant',
    prompt: `You are a helpful AI assistant. Provide accurate, concise, and professional responses to user queries. Always be polite, patient, and focused on solving the user's needs.`
  },
];
