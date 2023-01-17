import { createContext, PropsWithChildren, useContext } from "react"

import { useGetCategoryQuery } from "../../../api/categories"
import useOnlyAuthenticated from "../../../hooks/useOnlyAuthenticated"
import useToastError from "../../../hooks/useToastError"
import Category from "../../../models/category"
import RecurrenceContext from "./RecurrenceContext"

const CategoryContext = createContext<{
	category: Category | undefined
}>({
	category: undefined
})

export const CategoryProvider = ({ children }: PropsWithChildren<{}>) => {
	const { token } = useOnlyAuthenticated()
	const { recurrence } = useContext(RecurrenceContext)

	const { data: category, error: categoryError } = useGetCategoryQuery(
		{
			token,
			category_id: recurrence?.category_id ?? ""
		},
		{ skip: !recurrence }
	)

	useToastError(categoryError, true)

	return (
		<CategoryContext.Provider value={{ category: category }}>
			{children}
		</CategoryContext.Provider>
	)
}

export default CategoryContext
