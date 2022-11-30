import api, { ApiResponse, optimistic, RequireToken, WithTimestamps } from "./api"

export type iCategory<WT extends boolean = false> = {
	id: string
	user_id: string
	name: string
	color: string
	category_ids: string[]
} & WithTimestamps<WT>

const categories = api.injectEndpoints({
	endpoints: builder => ({
		getCategories: builder.query<iCategory<true>[], RequireToken>({
			query: ({ token }) => ({
				url: `/categories`,
				method: "GET",
				token
			}),
			providesTags: ["Category"]
		}),
		createCategory: builder.mutation<
			ApiResponse & { account: iCategory<true> },
			Omit<iCategory, "id" | "user_id"> & RequireToken
		>({
			query: ({ token, ...account }) => ({
				url: `/categories`,
				method: "POST",
				body: account,
				token
			}),
			invalidatesTags: ["Category"]
		}),
		getCategory: builder.query<iCategory<true>, { account_id: string } & RequireToken>({
			query: ({ token, account_id }) => ({
				url: `/categories/${account_id}`,
				method: "GET",
				token
			}),
			providesTags: ["Category"]
		}),
		updateCategory: builder.mutation<
			ApiResponse & { account: iCategory<true> },
			Partial<Omit<iCategory, "id" | "user_id">> & { account_id: string } & RequireToken
		>({
			query: ({ token, account_id, ...account }) => ({
				url: `/categories/${account_id}`,
				method: "PUT",
				body: account,
				token
			}),
			onQueryStarted: async ({ token, account_id, ...account }, mutators) => {
				await optimistic(
					mutators,
					categories.util.updateQueryData("getCategories", { token }, _categories => {
						const index = _categories.findIndex(a => a.id === account_id)
						if (index === -1) return

						_categories[index] = {
							..._categories[index]!,
							...account
						}
					}),
					categories.util.updateQueryData(
						"getCategory",
						{ token, account_id },
						_account => ({
							..._account,
							...account
						})
					)
				)
			},
			invalidatesTags: ["Category"]
		}),
		deleteCategory: builder.mutation<ApiResponse, { account_id: string } & RequireToken>({
			query: ({ token, account_id }) => ({
				url: `/categories/${account_id}`,
				method: "DELETE",
				token
			}),
			onQueryStarted: async ({ token, account_id }, mutators) => {
				await optimistic(
					mutators,
					categories.util.updateQueryData("getCategories", { token }, _categories => {
						const account = _categories.find(a => a.id === account_id)
						if (!account) return

						_categories.splice(_categories.indexOf(account), 1)
					})
				)
			},
			invalidatesTags: ["Category"]
		})
	})
})

export const {
	useCreateCategoryMutation,
	useDeleteCategoryMutation,
	useGetCategoryQuery,
	useGetCategoriesQuery,
	useLazyGetCategoryQuery,
	useLazyGetCategoriesQuery,
	useUpdateCategoryMutation
} = categories
