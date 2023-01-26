import { createContext, Dispatch, PropsWithChildren, SetStateAction, useState } from "react"

const FiltersContext = createContext<{
	sortBy: "name-asc" | "name-desc" | "due-date-asc" | "due-date-desc"
	setSortBy: Dispatch<SetStateAction<"name-asc" | "name-desc" | "due-date-asc" | "due-date-desc">>
}>({
	sortBy: "due-date-asc",
	setSortBy: () => {}
})

export const FiltersProvider = ({ children }: PropsWithChildren<{}>) => {
	const [sortBy, setSortBy] = useState<
		"name-asc" | "name-desc" | "due-date-asc" | "due-date-desc"
	>("due-date-asc")

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
