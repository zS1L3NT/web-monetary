import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react"

import { iAccount } from "../../../api/accounts"
import { iCategory } from "../../../api/categories"
import AccountsContext from "./AccountsContext"
import CategoriesContext from "./CategoriesContext"

const FiltersContext = createContext<{
	selectedAccounts: iAccount[] | undefined
	selectAccount: (account: iAccount) => void
	deselectAccount: (account: iAccount) => void
	selectedCategories: iCategory[] | undefined
	selectCategory: (category: iCategory) => void
	deselectCategory: (category: iCategory) => void
}>({
	selectedAccounts: [],
	selectAccount: () => {},
	deselectAccount: () => {},
	selectedCategories: [],
	selectCategory: () => {},
	deselectCategory: () => {}
})

export const FiltersProvider = ({ children }: PropsWithChildren<{}>) => {
	const { accounts } = useContext(AccountsContext)
	const { categories } = useContext(CategoriesContext)

	const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>()
	const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>()

	useEffect(() => {
		if (accounts && selectedAccountIds === undefined) {
			setSelectedAccountIds(accounts.map(a => a.id))
		}
	}, [accounts, selectedAccountIds])

	useEffect(() => {
		if (categories && selectedCategoryIds === undefined) {
			setSelectedCategoryIds(categories.map(c => c.id))
		}
	}, [categories, selectedCategoryIds])

	return (
		<FiltersContext.Provider
			value={{
				selectedAccounts: accounts?.filter(a => selectedAccountIds?.includes(a.id)),
				selectAccount: account => {
					setSelectedAccountIds([...(selectedAccountIds ?? []), account.id])
				},
				deselectAccount: account => {
					setSelectedAccountIds(
						(selectedAccountIds ?? []).filter(id => id !== account.id)
					)
				},
				selectedCategories: categories?.filter(c => selectedCategoryIds?.includes(c.id)),
				selectCategory: category => {
					setSelectedCategoryIds([...(selectedCategoryIds ?? []), category.id])
				},
				deselectCategory: category => {
					setSelectedCategoryIds(
						(selectedCategoryIds ?? []).filter(id => id !== category.id)
					)
				}
			}}>
			{children}
		</FiltersContext.Provider>
	)
}

export default FiltersContext
