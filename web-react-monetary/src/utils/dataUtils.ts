import { iAccount } from "../api/accounts"
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
