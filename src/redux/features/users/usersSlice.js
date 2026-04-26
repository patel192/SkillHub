import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../../api/axiosConfig";

export const fetchAllUsers = createAsyncThunk(
  "users/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiClient.get("/users");
      return res.data.users || [];
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch users");
    }
  }
);

export const fetchUserById = createAsyncThunk(
  "users/fetchById",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await apiClient.get(`/user/${userId}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch user");
    }
  }
);

export const toggleUserStatus = createAsyncThunk(
  "users/toggleStatus",
  async ({ id, isActive }, { rejectWithValue }) => {
    try {
      await apiClient.patch(`/user/${id}`, { isActive });
      return { id, isActive };
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to toggle status");
    }
  }
);

export const toggleUserRole = createAsyncThunk(
  "users/toggleRole",
  async ({ id, role }, { rejectWithValue }) => {
    try {
      await apiClient.patch(`/user/${id}`, { role });
      return { id, role };
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to toggle role");
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  "users/fetchProfile",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await apiClient.get(`/user/${userId}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch profile");
    }
  }
);

const initialState = {
  allUsers: [],
  currentUser: null,
  profile: null,
  loading: false,
  profileLoading: false,
  error: null,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
    clearProfile: (state) => {
      state.profile = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchAllUsers
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.allUsers = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchUserById
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchUserProfile
      .addCase(fetchUserProfile.pending, (state) => {
        state.profileLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.error = action.payload;
      })
      // toggleUserStatus
      .addCase(toggleUserStatus.fulfilled, (state, action) => {
        const user = state.allUsers.find(u => u._id === action.payload.id);
        if (user) {
          user.isActive = action.payload.isActive;
        }
        if (state.currentUser && state.currentUser._id === action.payload.id) {
          state.currentUser.isActive = action.payload.isActive;
        }
      })
      // toggleUserRole
      .addCase(toggleUserRole.fulfilled, (state, action) => {
        const user = state.allUsers.find(u => u._id === action.payload.id);
        if (user) {
          user.role = action.payload.role;
        }
        if (state.currentUser && state.currentUser._id === action.payload.id) {
          state.currentUser.role = action.payload.role;
        }
      });
  },
});

export const { clearCurrentUser, clearProfile } = usersSlice.actions;
export default usersSlice.reducer;
