import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import PublicApi from "../../api/PublicApi.js";

export const fetchHealthStatus = createAsyncThunk("healthCheck/fetchHealthStatus", async () => {
    const res = await PublicApi.healthCheck();
    return res;
});

const healthCheckSlice = createSlice({
    name: "healthCheck",
    initialState: {
        status: "idle", // idle | loading | succeeded | failed
        healthStatus: null,
        error: null,
    },
    reducers: {
        resetHealthStatus: (state) => {
            state.status = "idle";
            state.healthStatus = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchHealthStatus.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchHealthStatus.fulfilled, (state, action) => {
                if (action.payload === 200) {
                    state.status = "succeeded";
                    state.healthStatus = action.payload;
                }
            })
            .addCase(fetchHealthStatus.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
            .addDefaultCase((state) => {
                state.status = "idle";
                state.healthStatus = null;
                state.error = null;
            });
    },
});

export const { resetHealthStatus } = healthCheckSlice.actions;
export default healthCheckSlice.reducer;
