import { createContext, PropsWithChildren, useContext } from "react"

import { useGetCategoriesQuery } from "../../../api/categories"
import useOnlyAuthenticated from "../../../hooks/useOnlyAuthenticated"
import useToastError from "../../../hooks/useToastError"
import Category from "../../../models/category"
import { BudgetContext } from "./BudgetContext"

export const CategoriesContext = createContext<{
	categories: Category[] | undefined
}>({
	categories: undefined
})

const CategoriesProvider = ({ children }: PropsWithChildren<{}>) => {
	const { token } = useOnlyAuthenticated()
	const { budget } = useContext(BudgetContext)

	const { data: categories, error: categoriesError } = useGetCategoriesQuery({ token })

	useToastError(categoriesError, true)

	return (
		<CategoriesContext.Provider
			value={{
				categories: categories?.filter(c => budget?.category_ids.includes(c.id))
			}}>
			{children}
		</CategoriesContext.Provider>
	)
}

export default CategoriesProvider
