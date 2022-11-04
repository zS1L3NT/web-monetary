import { LIST, OBJECT, OR, STRING, UNDEFINED, validate } from "validate-any"
import ObjectValidator from "validate-any/dist/validators/ObjectValidator"

import { createSlice, PayloadAction, SerializedError } from "@reduxjs/toolkit"

import { ApiError } from "../utils/axiosBaseQuery"

const API_ERROR = <ObjectValidator<ApiError>>OBJECT({
	type: STRING(),
	message: STRING(),
	stack: OR(LIST(), UNDEFINED()),
	fields: OR(OBJECT(), UNDEFINED())
})

const slice = createSlice({
	name: "error",
	initialState: <ApiError | null>null,
	reducers: {
		setError: (state, action: PayloadAction<ApiError | SerializedError>) => {
			const result = validate(action.payload, API_ERROR)
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
