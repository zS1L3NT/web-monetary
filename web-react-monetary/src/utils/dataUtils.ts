import { iAccount } from "../api/accounts"
import { iCategory } from "../api/categories"
import { iTransaction } from "../api/transaction"

export const mapTransactionsAmount =
	(account: iAccount) =>
	(transaction: iTransaction): number => {
		if (transaction.type === "Outgoing" && transaction.from_account_id === account.id) {
			return -transaction.amount
		}

		if (transaction.type === "Incoming" && transaction.from_account_id === account.id) {
			return transaction.amount
		}

		if (transaction.type === "Transfer") {
			if (transaction.from_account_id === account.id) {
				return -transaction.amount
			}
			if (transaction.to_account_id === account.id) {
				return transaction.amount
			}
		}

		return 0
	}

export const getSubcategories = (category: iCategory, categories: iCategory[]): iCategory[] => {
	if (category.category_ids.length > 0) {
		return category.category_ids
			.map(c => categories.find(c_ => c_.id === c)!)
			.map(c => [c, ...getSubcategories(c, categories)])
			.flat()
	} else {
		return []
	}
}
