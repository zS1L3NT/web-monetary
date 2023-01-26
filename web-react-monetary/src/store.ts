import { configureStore } from "@reduxjs/toolkit"

import api from "./api/api"
import ErrorSlice from "./slices/ErrorSlice"

const store = configureStore({
	reducer: {
		[api.reducerPath]: api.reducer,
		error: ErrorSlice
	},
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware({ serializableCheck: false }).concat(api.middleware)
})

window.$store = store

export default store
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
