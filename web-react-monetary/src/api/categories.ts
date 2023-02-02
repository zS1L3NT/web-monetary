import Category from "../models/category"
import api, { ApiResponse, RequireToken } from "./api"

const categories = api.injectEndpoints({
	endpoints: builder => ({
		getCategories: builder.query<Category[], RequireToken>({
			query: ({ token }) => ({
				url: `/categories`,
				method: "GET",
				token
			}),
			transformResponse: value => (<any>value).map(Category.fromJSON.bind(Category)),
			providesTags: ["Category"]
		}),
		createCategory: builder.mutation<
			ApiResponse & { id: string },
			typeof Category.fillable & { parent_category_id?: string } & RequireToken
		>({
			query: ({ token, ...category }) => ({
				url: `/categories`,
				method: "POST",
				body: category,
				token
			}),
			invalidatesTags: ["Category"]
		}),
		getCategory: builder.query<Category, { category_id: string } & RequireToken>({
			query: ({ token, category_id }) => ({
				url: `/categories/${category_id}`,
				method: "GET",
				token
			}),
			transformResponse: Category.fromJSON.bind(Category),
			providesTags: ["Category"]
		}),
		updateCategory: builder.mutation<
			ApiResponse,
			Partial<typeof Category.fillable> & { category_id: string } & RequireToken
		>({
			query: ({ token, category_id, ...category }) => ({
				url: `/categories/${category_id}`,
				method: "PUT",
				body: category,
				token
			}),
			invalidatesTags: ["Category"]
		}),
		deleteCategory: builder.mutation<ApiResponse, { category_id: string } & RequireToken>({
			query: ({ token, category_id }) => ({
				url: `/categories/${category_id}`,
				method: "DELETE",
				token
			}),
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
