import api, { ApiResponse, optimistic, RequireToken, WithTimestamps } from "./api"

export type iAccount<WT extends boolean = false> = {
	id: string
	user_id: string
	name: string
	initial_balance: number
	color: string
} & WithTimestamps<WT>

const accounts = api.injectEndpoints({
	endpoints: builder => ({
		getAccounts: builder.query<iAccount<true>[], RequireToken>({
			query: ({ token }) => ({
				url: `/accounts`,
				method: "GET",
				token
			}),
			providesTags: ["Account"]
		}),
		createAccount: builder.mutation<
			ApiResponse & { account: iAccount<true> },
			Omit<iAccount, "id" | "user_id"> & RequireToken
		>({
			query: ({ token, ...account }) => ({
				url: `/accounts`,
				method: "POST",
				body: account,
				token
			}),
			invalidatesTags: ["Account"]
		}),
		getAccount: builder.query<iAccount<true>, { account_id: string } & RequireToken>({
			query: ({ token, account_id }) => ({
				url: `/accounts/${account_id}`,
				method: "GET",
				token
			}),
			providesTags: ["Account"]
		}),
		updateAccount: builder.mutation<
			ApiResponse & { account: iAccount<true> },
			Partial<Omit<iAccount, "id" | "user_id">> & { account_id: string } & RequireToken
		>({
			query: ({ token, account_id, ...account }) => ({
				url: `/accounts/${account_id}`,
				method: "PUT",
				body: account,
				token
			}),
			onQueryStarted: async ({ token, account_id, ...account }, mutators) => {
				await optimistic(
					mutators,
					accounts.util.updateQueryData("getAccounts", { token }, _accounts => {
						const index = _accounts.findIndex(a => a.id === account_id)
						if (index === -1) return

						_accounts[index] = {
							..._accounts[index]!,
							...account
						}
					}),
					accounts.util.updateQueryData(
						"getAccount",
						{ token, account_id },
						_account => ({
							..._account,
							...account
						})
					)
				)
			},
			invalidatesTags: ["Account"]
		}),
		deleteAccount: builder.mutation<ApiResponse, { account_id: string } & RequireToken>({
			query: ({ token, account_id }) => ({
				url: `/accounts/${account_id}`,
				method: "DELETE",
				token
			}),
			onQueryStarted: async ({ token, account_id }, mutators) => {
				await optimistic(
					mutators,
					accounts.util.updateQueryData("getAccounts", { token }, _accounts => {
						const account = _accounts.find(a => a.id === account_id)
						if (!account) return

						_accounts.splice(_accounts.indexOf(account), 1)
					})
				)
			},
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
