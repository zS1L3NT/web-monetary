import api, { ApiResponse, RequireToken, WithTimestamps } from "./api"

export type iUser<WT extends boolean = false> = {
	id: string
	username: string
	email: string
} & WithTimestamps<WT>

const authentication = api.injectEndpoints({
	endpoints: builder => ({
		login: builder.mutation<
			ApiResponse & { token: string; user: iUser<true> },
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
			ApiResponse & { token: string; user: iUser<true> },
			Partial<Omit<iUser, "id"> & { password: string }>
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
		getUser: builder.query<ApiResponse & { user: iUser<true> }, RequireToken>({
			query: ({ token }) => ({
				url: "/user",
				method: "GET",
				token
			}),
			providesTags: ["User"]
		}),
		updateUser: builder.mutation<
			ApiResponse & { user: iUser<true> },
			Partial<Omit<iUser, "id">> & RequireToken
		>({
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
