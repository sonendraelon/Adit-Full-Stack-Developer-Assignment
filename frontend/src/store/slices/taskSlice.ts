import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export interface Task {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'Low' | 'Medium' | 'High';
  dueDate?: string;
  userId: { _id: string; name: string; email: string } | string;
  createdAt: string;
}

interface TaskState {
  tasks: Task[];
  total: number;
  pages: number;
  page: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  total: 0,
  pages: 1,
  page: 1,
  isLoading: false,
  error: null,
};

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (params: { page?: number; limit?: number; search?: string; status?: string } | void, thunkAPI) => {
    try {
      const response = await api.get('/tasks', { params });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createTask = createAsyncThunk('tasks/createTask', async (taskData: { title: string; description?: string; priority?: string; dueDate?: string }, thunkAPI) => {
  try {
    const response = await api.post('/tasks', taskData);
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const updateTask = createAsyncThunk('tasks/updateTask', async (data: { id: string; title?: string; description?: string; priority?: string; dueDate?: string }, thunkAPI) => {
  try {
    const response = await api.put(`/tasks/${data.id}`, data);
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const toggleTaskComplete = createAsyncThunk('tasks/toggleTaskComplete', async (id: string, thunkAPI) => {
  try {
    const response = await api.patch(`/tasks/${id}`);
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (id: string, thunkAPI) => {
  try {
    await api.delete(`/tasks/${id}`);
    return id;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = action.payload.tasks;
        state.total = action.payload.total;
        state.pages = action.payload.pages;
        state.page = action.payload.page;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.unshift(action.payload);
        state.total += 1;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(toggleTaskComplete.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((t) => t._id !== action.payload);
        state.total -= 1;
      });
  },
});

export default taskSlice.reducer;
