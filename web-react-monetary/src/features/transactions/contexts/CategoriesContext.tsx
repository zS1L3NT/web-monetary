import { createContext, PropsWithChildren } from "react"

import { iCategory, useGetCategoriesQuery } from "../../../api/categories"
import useOnlyAuthenticated from "../../../hooks/useOnlyAuthenticated"
import useToastError from "../../../hooks/useToastError"

const CategoriesContext = createContext<{
	categories: iCategory[] | undefined
}>({
	categories: undefined
})

export const CategoriesProvider = ({ children }: PropsWithChildren<{}>) => {
	const { token } = useOnlyAuthenticated()

	const { data: categories, error: categoriesError } = useGetCategoriesQuery({ token })

	useToastError(categoriesError, true)

	return <CategoriesContext.Provider value={{ categories }}>{children}</CategoriesContext.Provider>
}

export default CategoriesContext