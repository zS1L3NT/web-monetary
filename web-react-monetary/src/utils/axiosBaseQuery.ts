import axios, { AxiosError, AxiosRequestConfig } from "axios"
import { LIST, OBJECT, OR, STRING, UNDEFINED, validate } from "validate-any"
import ObjectValidator from "validate-any/dist/validators/ObjectValidator"

import { BaseQueryFn } from "@reduxjs/toolkit/dist/query"

export type ApiError = {
	type: string
	message: string
	stack?: any[]
	fields?: Record<string, string[]>
}

const API_ERROR: ObjectValidator<ApiError> = OBJECT({
	type: STRING(),
	message: STRING(),
	stack: OR(LIST(), UNDEFINED()),
	fields: OR(OBJECT(), UNDEFINED())
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

		const result = validate(error.response?.data, API_ERROR)
		const apiError = {
			type: result.data?.type ?? error.name,
			message: result.data?.message ?? error.message,
			stack: result.data?.stack,
			fields: result.data?.fields
		}

		return {
			error: apiError
		}
	}
})
