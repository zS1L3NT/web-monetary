import { useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"

import { SerializedError } from "@reduxjs/toolkit"

import AuthContext from "../contexts/AuthContext"
import { setError } from "../slices/ErrorSlice"
import { ApiError } from "../utils/axiosBaseQuery"
import useAppDispatch from "./useAppDispatch"

const useToastError = (error: ApiError | SerializedError | undefined, redirect = false) => {
	const { token } = useContext(AuthContext)

	const navigate = useNavigate()

	const dispatch = useAppDispatch()

	useEffect(() => {
		if (error) {
			dispatch(setError(error))
			if (redirect) {
				navigate(token ? "/dashboard" : "/login")
			}
		}
	}, [error, redirect])
}

export default useToastError
