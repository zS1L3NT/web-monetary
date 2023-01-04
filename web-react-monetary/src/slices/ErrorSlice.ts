import { createSlice, PayloadAction, SerializedError } from "@reduxjs/toolkit"

import { ApiError } from "../utils/axiosBaseQuery"

const slice = createSlice({
	name: "error",
	initialState: <ApiError | null>null,
	reducers: {
		setError: (state, action: PayloadAction<ApiError | SerializedError>) => {
			const result = ApiError.safeParse(action.payload)
			if (result.success) {
				return result.data
			} else {
				console.error("SerializedError:", action.payload)

				const error = <SerializedError>action.payload
				return {
					type: error.name ?? "UnknownError",
					message: error.message ?? "Unknown cause to error"
				}
			}
		}
	}
})

export default slice.reducer
export const { setError } = slice.actions
