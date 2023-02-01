import User from "../models/user"
import api, { ApiResponse, RequireToken } from "./api"

const authentication = api.injectEndpoints({
	endpoints: builder => ({
		login: builder.mutation<
			ApiResponse & { token: string },
			{ email: string; password: string }
		>({
			query: user => ({
				url: `/login`,
				method: "POST",
				body: user
			}),
			invalidatesTags: ["User"]
		}),
		register: builder.mutation<
			ApiResponse & { token: string },
			Partial<typeof User.fillable & { password: string }>
		>({
			query: user => ({
				url: "/register",
				method: "POST",
				body: user
			}),
			invalidatesTags: ["User"]
		}),
		logout: builder.mutation<ApiResponse, RequireToken>({
			query: ({ token }) => ({
				url: "/logout",
				method: "POST",
				token
			}),
			invalidatesTags: ["User"]
		}),
		getUser: builder.query<User, RequireToken>({
			query: ({ token }) => ({
				url: "/user",
				method: "GET",
				token
			}),
			transformResponse: User.fromJSON.bind(User),
			providesTags: ["User"]
		}),
		updateUser: builder.mutation<ApiResponse, Partial<typeof User.fillable> & RequireToken>({
			query: ({ token, ...user }) => ({
				url: "/user",
				method: "PUT",
				body: user,
				token
			}),
			invalidatesTags: ["User"]
		}),
		updateUserPassword: builder.mutation<
			ApiResponse,
			{ old_password: string; new_password: string } & RequireToken
		>({
			query: ({ token, old_password, new_password }) => ({
				url: `/user/password`,
				method: "PUT",
				body: {
					old_password,
					new_password
				},
				token
			}),
			invalidatesTags: ["User"]
		}),
		deleteUser: builder.mutation<ApiResponse, RequireToken>({
			query: ({ token }) => ({
				url: `/user`,
				method: "DELETE",
				token
			}),
			invalidatesTags: ["User"]
		})
	})
})

export const {
	useDeleteUserMutation,
	useGetUserQuery,
	useLazyGetUserQuery,
	useLoginMutation,
	useLogoutMutation,
	useRegisterMutation,
	useUpdateUserMutation,
	useUpdateUserPasswordMutation
} = authentication
