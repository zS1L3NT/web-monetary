import Account from "../models/account"
import api, { ApiResponse, RequireToken } from "./api"

const accounts = api.injectEndpoints({
	endpoints: builder => ({
		getAccounts: builder.query<Account[], RequireToken>({
			query: ({ token }) => ({
				url: `/accounts`,
				method: "GET",
				token
			}),
			transformResponse: value => (<any[]>value).map(Account.fromJSON.bind(Account)),
			providesTags: ["Account"]
		}),
		createAccount: builder.mutation<
			ApiResponse & { id: string },
			Omit<typeof Account.fillable, "balance"> & RequireToken
		>({
			query: ({ token, ...account }) => ({
				url: `/accounts`,
				method: "POST",
				body: account,
				token
			}),
			invalidatesTags: ["Account"]
		}),
		getAccount: builder.query<Account, { account_id: string } & RequireToken>({
			query: ({ token, account_id }) => ({
				url: `/accounts/${account_id}`,
				method: "GET",
				token
			}),
			transformResponse: Account.fromJSON.bind(Account),
			providesTags: ["Account"]
		}),
		updateAccount: builder.mutation<
			ApiResponse,
			Partial<Omit<typeof Account.fillable, "balance">> & {
				account_id: string
			} & RequireToken
		>({
			query: ({ token, account_id, ...account }) => ({
				url: `/accounts/${account_id}`,
				method: "PUT",
				body: account,
				token
			}),
			invalidatesTags: ["Account"]
		}),
		deleteAccount: builder.mutation<ApiResponse, { account_id: string } & RequireToken>({
			query: ({ token, account_id }) => ({
				url: `/accounts/${account_id}`,
				method: "DELETE",
				token
			}),
			invalidatesTags: ["Account"]
		})
	})
})

export const {
	useCreateAccountMutation,
	useDeleteAccountMutation,
	useGetAccountQuery,
	useGetAccountsQuery,
	useLazyGetAccountQuery,
	useLazyGetAccountsQuery,
	useUpdateAccountMutation
} = accounts
