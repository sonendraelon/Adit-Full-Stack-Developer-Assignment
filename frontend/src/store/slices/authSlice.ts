import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
import api from '../../services/api';

interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  token: string;
}

interface AuthCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials extends AuthCredentials {
  name: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token'),
  isLoading: false,
  error: null,
};

export const login = createAsyncThunk('auth/login', async (credentials: AuthCredentials, thunkAPI) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError<{ message?: string }>(error)) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
    return thunkAPI.rejectWithValue('Something went wrong. Please try again.');
  }
});

export const register = createAsyncThunk('auth/register', async (credentials: RegisterCredentials, thunkAPI) => {
  try {
    const response = await api.post('/auth/register', credentials);
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError<{ message?: string }>(error)) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
    return thunkAPI.rejectWithValue('Something went wrong. Please try again.');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      api.post('/auth/logout');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.token = action.payload.token;
        localStorage.setItem('user', JSON.stringify(action.payload));
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.token = action.payload.token;
        localStorage.setItem('user', JSON.stringify(action.payload));
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
