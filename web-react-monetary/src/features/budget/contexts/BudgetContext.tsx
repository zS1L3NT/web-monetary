import { createContext, PropsWithChildren } from "react"
import { useParams } from "react-router-dom"

import { useGetBudgetQuery } from "../../../api/budgets"
import useOnlyAuthenticated from "../../../hooks/useOnlyAuthenticated"
import useToastError from "../../../hooks/useToastError"
import Budget from "../../../models/budget"

export const BudgetContext = createContext<{
	budget: Budget | undefined
}>({
	budget: undefined
})

const BudgetProvider = ({ children }: PropsWithChildren<{}>) => {
	const { token } = useOnlyAuthenticated()

	const { budget_id } = useParams()

	const { data: budget, error: budgetError } = useGetBudgetQuery({
		token,
		budget_id: budget_id!
	})

    useToastError(budgetError, true)

	return <BudgetContext.Provider value={{ budget }}>{children}</BudgetContext.Provider>
}

export default BudgetProvider
