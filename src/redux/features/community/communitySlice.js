import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../../api/axiosConfig";

export const fetchAllCommunities = createAsyncThunk(
  "community/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiClient.get("/communities");
      return res.data.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch communities");
    }
  }
);

export const fetchCommunityDetails = createAsyncThunk(
  "community/fetchDetails",
  async (communityId, { rejectWithValue }) => {
    try {
      const res = await apiClient.get(`/communities/${communityId}`);
      return res.data.data || res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch community details");
    }
  }
);

export const fetchCommunityPosts = createAsyncThunk(
  "community/fetchPosts",
  async (communityId, { rejectWithValue }) => {
    try {
      const res = await apiClient.get(`/communities/${communityId}/posts?sort=new&limit=50`);
      let posts = res.data?.data?.posts || res.data?.posts || res.data?.data || res.data || [];
      if (!Array.isArray(posts)) posts = [];
      return posts;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch community posts");
    }
  }
);

export const joinCommunity = createAsyncThunk(
  "community/join",
  async ({ communityId, userId }, { rejectWithValue }) => {
    try {
      await apiClient.patch(`/communities/${communityId}/join`, { userId });
      return { communityId, userId };
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to join community");
    }
  }
);

export const leaveCommunity = createAsyncThunk(
  "community/leave",
  async ({ communityId, userId }, { rejectWithValue }) => {
    try {
      await apiClient.patch(`/communities/${communityId}/leave`, { userId });
      return { communityId, userId };
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to leave community");
    }
  }
);

const initialState = {
  communities: [],
  currentCommunity: null,
  currentPosts: [],
  loading: false,
  detailsLoading: false,
  postsLoading: false,
  error: null,
};

const communitySlice = createSlice({
  name: "community",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchAllCommunities
      .addCase(fetchAllCommunities.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllCommunities.fulfilled, (state, action) => {
        state.loading = false;
        state.communities = action.payload;
      })
      .addCase(fetchAllCommunities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchCommunityDetails
      .addCase(fetchCommunityDetails.pending, (state) => {
        state.detailsLoading = true;
      })
      .addCase(fetchCommunityDetails.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.currentCommunity = action.payload;
      })
      .addCase(fetchCommunityDetails.rejected, (state, action) => {
        state.detailsLoading = false;
        state.error = action.payload;
      })
      // fetchCommunityPosts
      .addCase(fetchCommunityPosts.pending, (state) => {
        state.postsLoading = true;
      })
      .addCase(fetchCommunityPosts.fulfilled, (state, action) => {
        state.postsLoading = false;
        state.currentPosts = action.payload;
      })
      .addCase(fetchCommunityPosts.rejected, (state, action) => {
        state.postsLoading = false;
        state.error = action.payload;
      });
  },
});

export default communitySlice.reducer;
