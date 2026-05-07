import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const uploadFile = createAsyncThunk('import/uploadFile', async (file, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post('/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const importSlice = createSlice({
  name: 'import',
  initialState: {
    loading: false,
    result: null,
    error: null,
  },
  reducers: {
    clearImportState(state) {
      state.result = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadFile.pending, (state) => { state.loading = true; state.result = null; state.error = null; })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.loading = false;
        state.result = action.payload;
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearImportState } = importSlice.actions;
export default importSlice.reducer;
