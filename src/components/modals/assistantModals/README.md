# Assistant Modals

This folder contains reusable modal components specifically for assistant-related operations.

## Available Modals

### 1. AssistantCreateSuccessModal
- **Purpose**: Success modal after creating a new assistant
- **Features**: 
  - Assistant name display
  - Voice configuration summary (provider, voice name, voice ID)
  - Next steps guidance
  - Navigation to assistants list
- **Props**:
  - `isOpen: boolean` - Controls modal visibility
  - `onClose: () => void` - Close handler
  - `assistantName: string` - Created assistant name
  - `formData: CreateAssistantData` - Assistant configuration data

**Usage:**
```tsx
import { AssistantCreateSuccessModal } from '../../components/modals/assistantModals';

<AssistantCreateSuccessModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  assistantName="My Assistant"
  formData={assistantFormData}
/>
```

### 2. AssistantUpdateSuccessModal
- **Purpose**: Success modal after updating an existing assistant
- **Features**: 
  - Assistant name display
  - Optional configuration summary
  - Update confirmation
  - Navigation to assistants list
- **Props**:
  - `isOpen: boolean` - Controls modal visibility
  - `onClose: () => void` - Close handler
  - `assistantName: string` - Updated assistant name
  - `formData?: CreateAssistantData` - Optional updated configuration data

**Usage:**
```tsx
import { AssistantUpdateSuccessModal } from '../../components/modals/assistantModals';

<AssistantUpdateSuccessModal
  isOpen={showUpdateModal}
  onClose={() => setShowUpdateModal(false)}
  assistantName="Updated Assistant"
  formData={updatedFormData} // optional
/>
```

### 3. AssistantDeleteModal
- **Purpose**: Confirmation modal before deleting an assistant
- **Features**: 
  - Warning message with assistant name
  - Destructive action confirmation
  - Loading state during deletion
  - Cannot be undone warning
- **Props**:
  - `isOpen: boolean` - Controls modal visibility
  - `assistant: Assistant | null` - Assistant to be deleted
  - `onClose: () => void` - Close/cancel handler
  - `onConfirm: () => void` - Delete confirmation handler
  - `isDeleting?: boolean` - Loading state

**Usage:**
```tsx
import { AssistantDeleteModal } from '../../components/modals/assistantModals';

<AssistantDeleteModal
  isOpen={deleteModal.open}
  assistant={deleteModal.assistant}
  onClose={closeDeleteModal}
  onConfirm={handleDelete}
  isDeleting={deleteAssistantHook.isPending}
/>
```

## Design Features

### Color Schemes
- **Create Modal**: Green gradient (`#5DD149` to `#306B25`) 
- **Update Modal**: Blue gradient (`#3B82F6` to `#1E40AF`)
- **Delete Modal**: Red gradient (`#EF4444` to `#DC2626`)

### Common Features
- Framer Motion animations
- Professional gradients and styling
- Responsive design (mobile/desktop)
- Voice configuration display
- Call-to-action buttons with hover effects
- Auto-focus and accessibility considerations
- Loading states with spinners
- Warning messages for destructive actions

## Usage in Components

### AssistantCreate.tsx
- Uses `AssistantCreateSuccessModal` after successful creation
- Shows voice configuration summary and next steps

### AssistantEdit.tsx  
- Uses `AssistantUpdateSuccessModal` after successful update
- Shows updated configuration and confirmation

### AssistantTable.tsx
- Uses `AssistantDeleteModal` for delete confirmation
- Shows warning and handles deletion with loading state

## Adding New Modals

1. Create new modal component in this folder
2. Follow the naming convention: `Assistant[Action]Modal.tsx`
3. Export from `index.ts`
4. Update this README with documentation

## Dependencies

- `framer-motion` - Animations
- `react-router` - Navigation
- Tailwind CSS - Styling
- Custom API types from `../../../api`
- Lucide React - Icons