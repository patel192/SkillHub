import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../../api/axiosConfig";

const applyTheme = (theme) => {
  const root = document.documentElement;
  root.classList.remove("dark");
  const currentTheme = theme === "dark" ? "emerald" : theme || "emerald";
  root.setAttribute("data-theme", currentTheme);
  localStorage.setItem("theme", currentTheme);
};

export const fetchSettings = createAsyncThunk(
  "settings/fetchSettings",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await apiClient.get(`/user/${userId}/settings`);
      const data = res.data.data;
      applyTheme(data.theme);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch settings");
    }
  }
);

export const updateSettings = createAsyncThunk(
  "settings/updateSettings",
  async ({ userId, newSettings }, { rejectWithValue }) => {
    try {
      const res = await apiClient.put(`/user/${userId}/settings`, newSettings);
      const data = res.data.data;
      if (newSettings.theme) {
        applyTheme(newSettings.theme);
      }
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to update settings");
    }
  }
);

const initialState = {
  settings: null,
  loading: true,
  error: null,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
      clearSettings: (state) => {
          state.settings = null;
          state.loading = false;
          state.error = null;
      }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload;
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateSettings.pending, (state) => {
        state.error = null;
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.settings = action.payload;
      })
      .addCase(updateSettings.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearSettings } = settingsSlice.actions;
export default settingsSlice.reducer;
