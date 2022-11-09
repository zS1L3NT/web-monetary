import { ThunkAction } from "@reduxjs/toolkit"
import { PatchCollection } from "@reduxjs/toolkit/dist/query/core/buildThunks"
import { MutationLifecycleApi } from "@reduxjs/toolkit/dist/query/endpointDefinitions"
import { createApi } from "@reduxjs/toolkit/query/react"

import axiosBaseQuery from "../utils/axiosBaseQuery"

export type WithTimestamps<WT extends boolean> = WT extends true
	? { created_at: string; updated_at: string }
	: {}

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

export const optimistic = async (
	{ dispatch, queryFulfilled }: MutationLifecycleApi<any, any, any, any>,
	...actions: ThunkAction<PatchCollection, any, any, any>[]
) => {
	const patches = actions.map(action => dispatch(action))
	queryFulfilled.catch(() => patches.map(patch => patch.undo()))
}

export default api
