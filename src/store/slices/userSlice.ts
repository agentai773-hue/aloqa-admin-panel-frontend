import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../../api';

interface UserState {
  selectedUser: User | null;
  modalMode: 'create' | 'edit' | 'view' | null;
}

const initialState: UserState = {
  selectedUser: null,
  modalMode: null,
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setSelectedUser: (state, action: PayloadAction<User | null>) => {
      state.selectedUser = action.payload;
    },
    setModalMode: (state, action: PayloadAction<'create' | 'edit' | 'view' | null>) => {
      state.modalMode = action.payload;
    },
    openCreateModal: (state) => {
      state.modalMode = 'create';
      state.selectedUser = null;
    },
    openEditModal: (state, action: PayloadAction<User>) => {
      state.modalMode = 'edit';
      state.selectedUser = action.payload;
    },
    openViewModal: (state, action: PayloadAction<User>) => {
      state.modalMode = 'view';
      state.selectedUser = action.payload;
    },
    closeModal: (state) => {
      state.modalMode = null;
      state.selectedUser = null;
    },
  },
});

export const {
  setSelectedUser,
  setModalMode,
  openCreateModal,
  openEditModal,
  openViewModal,
  closeModal,
} = userSlice.actions;

export default userSlice.reducer;
