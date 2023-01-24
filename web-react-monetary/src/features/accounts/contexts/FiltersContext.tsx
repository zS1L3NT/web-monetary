import { createContext, Dispatch, PropsWithChildren, SetStateAction, useState } from "react"

const FiltersContext = createContext<{
	sortBy: "name-asc" | "name-desc" | "balance-asc" | "balance-desc"
	setSortBy: Dispatch<SetStateAction<"name-asc" | "name-desc" | "balance-asc" | "balance-desc">>
}>({
	sortBy: "balance-asc",
	setSortBy: () => {}
})

export const FiltersProvider = ({ children }: PropsWithChildren<{}>) => {
	const [sortBy, setSortBy] = useState<"name-asc" | "name-desc" | "balance-asc" | "balance-desc">(
		"balance-desc"
	)

	return (
		<FiltersContext.Provider
			value={{
				sortBy,
				setSortBy
			}}>
			{children}
		</FiltersContext.Provider>
	)
}

export default FiltersContext
