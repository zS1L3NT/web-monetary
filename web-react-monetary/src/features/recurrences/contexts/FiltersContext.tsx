import { createContext, Dispatch, PropsWithChildren, SetStateAction, useState } from "react"

const FiltersContext = createContext<{
	sortBy: "date-desc" | "date-asc"
	setSortBy: Dispatch<SetStateAction<"date-desc" | "date-asc">>
}>({
	sortBy: "date-desc",
	setSortBy: () => {}
})

export const FiltersProvider = ({ children }: PropsWithChildren<{}>) => {
	const [sortBy, setSortBy] = useState<"date-desc" | "date-asc">("date-desc")

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
