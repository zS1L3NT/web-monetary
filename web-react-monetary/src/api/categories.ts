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
			ApiResponse & { category: iCategory<true> },
			Omit<iCategory, "id" | "user_id"> & RequireToken
		>({
			query: ({ token, ...category }) => ({
				url: `/categories`,
				method: "POST",
				body: category,
				token
			}),
			invalidatesTags: ["Category"]
		}),
		getCategory: builder.query<iCategory<true>, { category_id: string } & RequireToken>({
			query: ({ token, category_id }) => ({
				url: `/categories/${category_id}`,
				method: "GET",
				token
			}),
			providesTags: ["Category"]
		}),
		updateCategory: builder.mutation<
			ApiResponse & { category: iCategory<true> },
			Partial<Omit<iCategory, "id" | "user_id">> & { category_id: string } & RequireToken
		>({
			query: ({ token, category_id, ...category }) => ({
				url: `/categories/${category_id}`,
				method: "PUT",
				body: category,
				token
			}),
			onQueryStarted: async ({ token, category_id, ...category }, mutators) => {
				await optimistic(
					mutators,
					categories.util.updateQueryData("getCategories", { token }, _categories => {
						const index = _categories.findIndex(a => a.id === category_id)
						if (index === -1) return

						_categories[index] = {
							..._categories[index]!,
							...category
						}
					}),
					categories.util.updateQueryData(
						"getCategory",
						{ token, category_id },
						_category => ({
							..._category,
							...category
						})
					)
				)
			},
			invalidatesTags: ["Category"]
		}),
		deleteCategory: builder.mutation<ApiResponse, { category_id: string } & RequireToken>({
			query: ({ token, category_id }) => ({
				url: `/categories/${category_id}`,
				method: "DELETE",
				token
			}),
			onQueryStarted: async ({ token, category_id }, mutators) => {
				await optimistic(
					mutators,
					categories.util.updateQueryData("getCategories", { token }, _categories => {
						const category = _categories.find(a => a.id === category_id)
						if (!category) return

						_categories.splice(_categories.indexOf(category), 1)
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
