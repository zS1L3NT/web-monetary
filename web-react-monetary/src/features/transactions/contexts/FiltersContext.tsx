import {
	createContext, Dispatch, PropsWithChildren, SetStateAction, useContext, useEffect, useState
} from "react"

import { iAccount } from "../../../api/accounts"
import { iCategory } from "../../../api/categories"
import { TransactionType } from "../../../api/transaction"
import { getSubcategories } from "../../../utils/dataUtils"
import AccountsContext from "./AccountsContext"
import CategoriesContext from "./CategoriesContext"
import TransactionsContext from "./TransactionsContext"

const FiltersContext = createContext<{
	selectedAccounts: iAccount[] | undefined
	selectAccount: (account: iAccount) => void
	deselectAccount: (account: iAccount) => void
	selectedCategories: iCategory[] | undefined
	selectCategory: (category: iCategory) => void
	deselectCategory: (category: iCategory) => void
	transactionTypes: TransactionType[]
	selectTransactionType: (type: TransactionType) => void
	deselectTransactionType: (type: TransactionType) => void
	minAmount: number
	setMinAmount: Dispatch<SetStateAction<number>>
	maxAmount: number | undefined
	setMaxAmount: Dispatch<SetStateAction<number | undefined>>
}>({
	selectedAccounts: [],
	selectAccount: () => {},
	deselectAccount: () => {},
	selectedCategories: [],
	selectCategory: () => {},
	deselectCategory: () => {},
	transactionTypes: [],
	selectTransactionType: () => {},
	deselectTransactionType: () => {},
	minAmount: 0,
	setMinAmount: () => {},
	maxAmount: undefined,
	setMaxAmount: () => {}
})

export const FiltersProvider = ({ children }: PropsWithChildren<{}>) => {
	const { accounts } = useContext(AccountsContext)
	const { transactions } = useContext(TransactionsContext)
	const { categories } = useContext(CategoriesContext)

	const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>()
	const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>()
	const [transactionTypes, setTransactionTypes] = useState<TransactionType[]>([
		"Outgoing",
		"Incoming",
		"Transfer"
	])
	const [minAmount, setMinAmount] = useState(0)
	const [maxAmount, setMaxAmount] = useState<number>()

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

	useEffect(() => {
		if (transactions && maxAmount === undefined) {
			setMaxAmount([...transactions].sort((a, b) => b.amount - a.amount)[0]?.amount ?? 100)
		}
	}, [transactions, maxAmount])

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
					setSelectedCategoryIds([
						...new Set<string>([
							...(selectedCategoryIds ?? []),
							category.id,
							...getSubcategories(category, categories ?? []).map(c => c.id)
						])
					])
				},
				deselectCategory: category => {
					setSelectedCategoryIds(
						(selectedCategoryIds ?? []).filter(
							c =>
								![
									category.id,
									...getSubcategories(category, categories ?? []).map(c => c.id)
								].includes(c)
						)
					)
				},
				transactionTypes,
				selectTransactionType: type => {
					setTransactionTypes([...transactionTypes, type])
				},
				deselectTransactionType: type => {
					setTransactionTypes(transactionTypes.filter(t => t !== type))
				},
				minAmount,
				setMinAmount,
				maxAmount,
				setMaxAmount
			}}>
			{children}
		</FiltersContext.Provider>
	)
}

export default FiltersContext
