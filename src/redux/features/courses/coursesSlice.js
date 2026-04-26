import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../../api/axiosConfig";

export const fetchAllCourses = createAsyncThunk(
  "courses/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiClient.get("/courses");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch courses");
    }
  }
);

export const fetchMyCourses = createAsyncThunk(
  "courses/fetchMyCourses",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await apiClient.get(`/enrollment/${userId}`);
      return res.data.data.map((e) => ({
        ...e.courseId,
        progress: e.progress || 0,
        enrolledAt: e.enrolledAt,
      }));
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch my courses");
    }
  }
);

export const fetchCourseById = createAsyncThunk(
  "courses/fetchCourseById",
  async (courseId, { rejectWithValue }) => {
    try {
      const res = await apiClient.get(`/courses/${courseId}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch course details");
    }
  }
);

export const deleteCourse = createAsyncThunk(
  "courses/deleteCourse",
  async (courseId, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/courses/${courseId}`);
      return courseId;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to delete course");
    }
  }
);

export const toggleCoursePublish = createAsyncThunk(
  "courses/togglePublish",
  async ({ id, isPublished }, { rejectWithValue }) => {
    try {
      await apiClient.patch(`/courses/${id}`, { isPublished: !isPublished });
      return { id, isPublished: !isPublished };
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to toggle course status");
    }
  }
);


export const enrollInCourse = createAsyncThunk(
  "courses/enrollInCourse",
  async ({ userId, courseId }, { rejectWithValue }) => {
    try {
      const res = await apiClient.post("/enrollment", {
        userId,
        courseId,
        status: "Registered",
        progress: 0,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to enroll");
    }
  }
);

const initialState = {
  allCourses: [],
  myCourses: [],
  currentCourse: null,
  loading: false,
  myCoursesLoading: false,
  error: null,
};

const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    clearCurrentCourse: (state) => {
      state.currentCourse = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchAllCourses
      .addCase(fetchAllCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.allCourses = action.payload || [];
      })
      .addCase(fetchAllCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchMyCourses
      .addCase(fetchMyCourses.pending, (state) => {
        state.myCoursesLoading = true;
        state.error = null;
      })
      .addCase(fetchMyCourses.fulfilled, (state, action) => {
        state.myCoursesLoading = false;
        state.myCourses = action.payload || [];
      })
      .addCase(fetchMyCourses.rejected, (state, action) => {
        state.myCoursesLoading = false;
        state.error = action.payload;
      })
      // fetchCourseById
      .addCase(fetchCourseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCourse = action.payload;
      })
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // deleteCourse
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.allCourses = state.allCourses.filter((c) => c._id !== action.payload);
      })
      
       // enrollInCourse
       .addCase(enrollInCourse.fulfilled, (state) => {
         // Optimistically add to myCourses if needed or just re-fetch
       })

      // toggleCoursePublish
      .addCase(toggleCoursePublish.fulfilled, (state, action) => {
        const course = state.allCourses.find((c) => c._id === action.payload.id);
        if (course) {
          course.isPublished = action.payload.isPublished;
        }
      });
  },
});

export const { clearCurrentCourse } = coursesSlice.actions;
export default coursesSlice.reducer;
