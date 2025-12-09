# Voice Selection Feature Implementation

## Overview
This feature adds dual voice selection options for assistant creation:
1. **Manual Selection** - Choose from all available voices in the voice library
2. **Dynamic Selection** - Select from voices specifically assigned to the selected user

## Implementation Details

### Frontend Changes

#### 1. API Types (src/api/assistants/index.ts)
- Added `voiceId?: string` and `voiceName?: string` to `CreateAssistantData` interface
- Added the same fields to `Assistant` interface for database storage

#### 2. Custom Hook (src/hooks/useVoiceAssignments.ts)
- Created `useUserVoiceAssignments()` hook to fetch voice assignments by user ID
- Uses existing API endpoint `/assign-user-voice/user/:userId`
- Returns active voice assignments for the selected user

#### 3. Step3VoiceSynthesizer Component
**New Props:**
- `selectedUserIds: string[]` - Array of selected user IDs

**New Features:**
- Radio button toggle between "Manual Selection" and "User Assigned Voices"
- Dynamic voice grid showing user's assigned voices with voice details
- Voice selection summary showing selected voice information
- Automatic provider switching to ElevenLabs for user-assigned voices

**UI States:**
- Loading state while fetching user voices
- Empty state when no user is selected
- Empty state when user has no assigned voices
- Voice selection cards with accent, model, and project information

#### 4. Form Data Updates
- Added `voiceId` and `voiceName` fields to form initialization in both:
  - `AssistantCreate.tsx`
  - `AssistantEdit.tsx`

### Backend Changes

#### Assistant Model (src/models/Assistant.js)
Added new fields to the assistant schema:
```javascript
// Voice Assignment Fields (for user-assigned voices)
voiceId: {
  type: String,
  trim: true,
  comment: 'Voice ID from user voice assignments (ElevenLabs voice ID)'
},
voiceName: {
  type: String,
  trim: true,
  comment: 'Voice name from user voice assignments'
}
```

## Feature Flow

### Manual Selection Mode
1. User selects "Manual Selection" radio button
2. Standard voice configuration form appears with provider and voice dropdowns
3. User can choose any voice from the voice library
4. Voice selection is stored in `synthesizerConfig.provider_config.voice`

### Dynamic Selection Mode
1. User selects "User Assigned Voices" radio button
2. System fetches voice assignments for the selected user
3. Grid of assigned voices displays with:
   - Voice name
   - Voice accent and model
   - Project name
   - Voice ID for identification
4. User selects a voice from the grid
5. Voice selection is stored in both:
   - `voiceId` and `voiceName` fields (for reference)
   - `synthesizerConfig.provider_config.voice` (for Bolna AI)

### Data Storage
When using dynamic selection:
- `voiceId` stores the ElevenLabs voice ID from the assignment
- `voiceName` stores the human-readable voice name
- `synthesizerConfig.provider` automatically set to 'elevenlabs'
- `synthesizerConfig.provider_config.voice` set to the voice ID

## API Integration

### Existing Endpoints Used
- `GET /admin/assign-user-voice/user/:userId` - Fetch user's voice assignments
- `POST /admin/assistants` - Create assistant with voice fields
- `PUT/PATCH /admin/assistants/:id` - Update assistant with voice fields

### Query Parameters
The user voice assignments are fetched with:
- `status=active` - Only active assignments
- User ID from the selected user in step 1

## User Experience

### Voice Selection Mode Toggle
- Clear visual distinction between manual and dynamic modes
- Radio buttons with descriptive text
- Smooth transitions between modes

### Dynamic Voice Display
- Card-based layout for easy selection
- Voice details (accent, model, project) for informed selection
- Visual feedback for selected voice
- Selection summary showing chosen voice details

### Error Handling
- Loading states during voice fetch
- Empty states with helpful messaging
- Fallback to manual mode if user has no assigned voices

## Technical Notes

### Voice ID Mapping
- User-assigned voices use ElevenLabs voice IDs directly
- No additional mapping required between assignment and synthesizer config
- Voice assignments store the actual ElevenLabs voice ID that can be used directly

### Backwards Compatibility
- Existing assistants continue to work normally
- `voiceId` and `voiceName` are optional fields
- Manual selection mode remains the default behavior

### Performance Considerations
- Voice assignments are only fetched when dynamic mode is selected
- 30-second cache for voice assignment data
- Conditional API calls based on user selection and mode

## Future Enhancements

### Potential Improvements
1. **Voice Preview** - Add voice sample playback for assigned voices
2. **Voice Search** - Add search/filter functionality for large voice lists
3. **Bulk Assignment** - Select voice assignments for multiple users
4. **Voice Recommendations** - Suggest voices based on assistant type
5. **Voice History** - Show previously used voices for quick selection

### Integration Opportunities
1. **Project-Based Filtering** - Filter voices by project when creating assistants
2. **Voice Analytics** - Track which assigned voices are most used
3. **Auto-Assignment** - Automatically assign popular voices to new users
4. **Voice Validation** - Verify voice assignments are still valid before selection

## Testing Checklist

### Manual Selection Mode
- [ ] Can switch to manual mode
- [ ] All voice providers and voices are available
- [ ] Voice selection works as before
- [ ] Form validation works correctly

### Dynamic Selection Mode
- [ ] Can switch to dynamic mode
- [ ] User voice assignments load correctly
- [ ] Voice selection from grid works
- [ ] Selected voice details display correctly
- [ ] Voice ID and name are stored properly

### Edge Cases
- [ ] No user selected - shows appropriate message
- [ ] User with no voice assignments - shows empty state
- [ ] Loading states display correctly
- [ ] Error handling for failed API calls
- [ ] Switching between modes clears previous selections

### Data Persistence
- [ ] Voice selections save correctly in create flow
- [ ] Voice data loads correctly in edit flow
- [ ] Database stores voice fields properly
- [ ] API responses include voice fields