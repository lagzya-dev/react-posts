import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const response = await axios.get("/posts");

  return response.data;
});
export const fetchTags = createAsyncThunk("posts/fetchTags", async () => {
  const response = await axios.get("/tags");

  return response.data;
});

export const fetchRemovePost = createAsyncThunk(
  "posts/fetchRemovePost",
  async (id) => {
    await axios.delete(`/posts/${id}`);
  }
);
const initialState = {
  posts: {
    items: [],
    status: "loading",
  },
  tags: {
    items: [],
    status: "loading",
  },
};

const postsSlice = createSlice({
  initialState,
  name: "posts",
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.posts.items = action.payload;
        state.posts.status = "loaded";
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.posts.status = "failed";
      })
      .addCase(fetchPosts.pending, (state, action) => {
        state.posts.status = "loading";
      });

    builder
      .addCase(fetchTags.fulfilled, (state, action) => {
        state.tags.items = action.payload;
        state.tags.status = "loaded";
      })
      .addCase(fetchTags.rejected, (state, action) => {
        state.tags.status = "failed";
      })
      .addCase(fetchTags.pending, (state, action) => {
        state.tags.status = "loading";
      });
    builder
      .addCase(fetchRemovePost.fulfilled, (state, action) => {
        state.tags.status = "loaded";
      })
      .addCase(fetchRemovePost.rejected, (state, action) => {
        state.tags.status = "failed";
      })
      .addCase(fetchRemovePost.pending, (state, action) => {
        state.posts.items = state.posts.items.filter(
          (p) => p._id !== action.meta.arg
        );
        state.tags.status = "loading";
      });
  },
});

export const postReducer = postsSlice.reducer;
export const { addPost, deletePost, addTag } = postsSlice.actions;
