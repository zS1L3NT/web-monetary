import { createApi } from "@reduxjs/toolkit/query/react"

import axiosBaseQuery from "../utils/axiosBaseQuery"

export type ApiResponse = {
	message: string
}

export type RequireToken = {
	token: string
}

const api = createApi({
	reducerPath: "api",
	tagTypes: ["Account", "User", "Budget", "Category", "Debt", "Recurrence", "Transaction"],
	baseQuery: axiosBaseQuery,
	endpoints: () => ({})
})

export default api
