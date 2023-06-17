import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { PRIVATE_API } from "../../api/apiIndex";

const initialState = {
  data: [],
  fetchStatus: "idle",
  fetchError: "",

  searchQuery: "",
  limit: 10,
  totalCategories: 0,
  currentPage: 1,
  sortOrder: "",

  singleData: "",
  singleStatus: "idle",
  singleError: "",

  editStatus: "idle",
  editError: "",
};

export const fetchAdminCategories = createAsyncThunk(
  "adminCategories/fetchAdminCategories",
  async (params, { rejectWithValue }) => {
    try {
      const response = await PRIVATE_API.get("/category/", { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error);
    }
  }
);

export const fetchAdminSingleCategory = createAsyncThunk(
  "adminCategories/fetchAdminSingleCategory",
  async (id, { rejectWithValue }) => {
    try {
      const response = await PRIVATE_API.get(`/category/single/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error);
    }
  }
);

export const updateAdminCategories = createAsyncThunk(
  "adminCategories/updateAdminCategories",
  async (data, { rejectWithValue }) => {
    try {
      const response = await PRIVATE_API.put(
        `/category/${data.id}`,
        data.data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error);
    }
  }
);

export const deleteAdminCategories = createAsyncThunk(
  "adminCategories/deleteAdminCategories",
  async (id, { rejectWithValue }) => {
    try {
      const response = await PRIVATE_API.delete(`/category/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error);
    }
  }
);

const categoriesSlice = createSlice({
  name: "adminCategories",
  initialState,
  reducers: {
    removeAdminCategoriesError: (state) => {
      state.fetchError = "";
      state.fetchStatus = "idle";
    },
    removeAdminSingleCategory: (state) => {
      state.singleData = "";
      state.singleStatus = "idle";
      state.singleError = "";
      state.editStatus = "idle";
      state.editError = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminCategories.pending, (state) => {
        state.fetchStatus = "loading";
        state.fetchError = "";
      })
      .addCase(fetchAdminCategories.fulfilled, (state, action) => {
        state.fetchStatus = "success";
        state.fetchError = "";
        state.data = action.payload.data;
        state.searchQuery = action.payload.searchQuery;
        state.limit = action.payload.limit;
        state.currentPage = action.payload.currentPage;
        state.sortOrder = action.payload.sortOrder;
        state.totalCategories = action.payload.totalCategories;
      })
      .addCase(fetchAdminCategories.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.fetchError = action.payload.message;
      })

      .addCase(fetchAdminSingleCategory.pending, (state) => {
        state.singleStatus = "loading";
        state.singleError = "";
      })
      .addCase(fetchAdminSingleCategory.fulfilled, (state, action) => {
        state.singleStatus = "success";
        state.singleError = "";
        state.singleData = action.payload.data;
      })
      .addCase(fetchAdminSingleCategory.rejected, (state, action) => {
        state.singleStatus = "failed";
        state.singleError = action.payload.message;
      })

      .addCase(updateAdminCategories.pending, (state) => {
        state.editStatus = "loading";
        state.editError = "";
      })
      .addCase(updateAdminCategories.fulfilled, (state, action) => {
        state.editStatus = "success";
        state.editError = "";
        state.singleData = { ...state.singleData, ...action.payload.data };
        state.data = state.data.map((entry) =>
          entry._id === action.payload.id
            ? { ...entry, ...action.payload.data }
            : entry
        );
      })
      .addCase(updateAdminCategories.rejected, (state, action) => {
        state.editStatus = "failed";
        state.editError = action.payload.message;
      })

      .addCase(deleteAdminCategories.pending, (state) => {
        state.singleStatus = "loading";
        state.singleError = "";
      })
      .addCase(deleteAdminCategories.fulfilled, (state, action) => {
        state.singleStatus = "success";
        state.singleError = "";
        state.singleData = "";
        state.data = state.data.filter(
          (entry) => entry._id !== action.payload.id
        );
      })
      .addCase(deleteAdminCategories.rejected, (state, action) => {
        state.singleStatus = "failed";
        state.singleError = action.payload.message;
      });
  },
});

export const { removeAdminCategoriesError, removeAdminSingleCategory } =
  categoriesSlice.actions;

export const getAdminCategoriesData = (state) => state.adminCategories.data;
export const getAdminCategoriesFetchStatus = (state) =>
  state.adminCategories.fetchStatus;
export const getAdminCategoriesFetchError = (state) =>
  state.adminCategories.fetchError;

export const getAdminCategoriesSearchQuery = (state) =>
  state.adminCategories.searchQuery;
export const getAdminCategoriesLimit = (state) => state.adminCategories.limit;
export const getAdminCategoriesCurrentPage = (state) =>
  state.adminCategories.currentPage;
export const getAdminCategoriesSortOrder = (state) =>
  state.adminCategories.sortOrder;
export const getAdminCategoriesTotalCategories = (state) =>
  state.adminCategories.totalCategories;

export const getAdminSingleCategoryData = (state) =>
  state.adminCategories.singleData;
export const getAdminSingleCategoryFetchStatus = (state) =>
  state.adminCategories.singleStatus;
export const getAdminSingleCategoryFetchError = (state) =>
  state.adminCategories.singleError;

export const getAdminSingleCategoryEditStatus = (state) =>
  state.adminCategories.editStatus;
export const getAdminSingleCategoryEditError = (state) =>
  state.adminCategories.editError;

export default categoriesSlice.reducer;
