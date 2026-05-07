import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const fetchAnalytics = createAsyncThunk('analytics/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const [summary, perCategory, topReviewed, discountDist, avgRating] = await Promise.all([
      api.get('/analytics/summary'),
      api.get('/analytics/products-per-category'),
      api.get('/analytics/top-reviewed'),
      api.get('/analytics/discount-distribution'),
      api.get('/analytics/category-avg-rating'),
    ]);
    return {
      summary: summary.data.data,
      productsPerCategory: perCategory.data.data,
      topReviewed: topReviewed.data.data,
      discountDistribution: discountDist.data.data,
      categoryAvgRating: avgRating.data.data,
    };
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState: {
    summary: null,
    productsPerCategory: [],
    topReviewed: [],
    discountDistribution: [],
    categoryAvgRating: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalytics.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        Object.assign(state, action.payload);
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default analyticsSlice.reducer;
