import axios, { AxiosError, AxiosRequestConfig } from "axios"
import { BaseQueryFn } from "@reduxjs/toolkit/dist/query"
import { z } from "zod"

export type ApiError = z.infer<typeof ApiError>
export const ApiError = z.object({
	type: z.string(),
	message: z.string(),
	stack: z.union([z.array(z.any()), z.undefined()]),
	fields: z.union([z.record(z.array(z.string())), z.undefined()])
})

export default <
	BaseQueryFn<
		{
			url: string
			method: AxiosRequestConfig["method"]
			body?: any
			params?: AxiosRequestConfig["params"]
			token?: string | null | undefined
		},
		unknown,
		ApiError
	>
>(async ({ url, method, body, params, token }) => {
	try {
		const result = await axios({
			url: "/api" + url,
			headers: token ? { Authorization: `Bearer ${token}` } : undefined,
			method,
			params,
			data: body
		})
		return { data: result.data }
	} catch (e) {
		const error = <AxiosError>e
		console.error(error)

		const result = ApiError.safeParse(error.response?.data)
		const apiError = {
			type: result.success ? result.data.type : error.name,
			message: result.success ? result.data.message : error.message,
			stack: result.success ? result.data.stack : undefined,
			fields: result.success ? result.data.fields : undefined
		}

		return {
			error: apiError
		}
	}
})
