import { AnimatePresence, motion } from "framer-motion"

import { Center, Spinner, Stack } from "@chakra-ui/react"

import { useGetCategoriesQuery } from "../../../api/categories"
import useOnlyAuthenticated from "../../../hooks/useOnlyAuthenticated"
import useToastError from "../../../hooks/useToastError"
import CategoryItem from "./CategoryItem"

const CategoryList = ({}: {}) => {
	const { token } = useOnlyAuthenticated()

	const {
		data: categories,
		error: categoriesError,
		isLoading: categoriesAreLoading
	} = useGetCategoriesQuery({ token })

	useToastError(categoriesError, true)

	return (
		<AnimatePresence>
			{!categoriesAreLoading && categories ? (
				<Stack>
					{categories
						.filter(c => !categories?.find(c_ => c_.category_ids.includes(c.id)))
						.map(c => (
							<motion.div
								key={c.id}
								layout
								layoutId={c.id}>
								<CategoryItem
									category={c}
									clickable={true}
								/>
							</motion.div>
						))}
				</Stack>
			) : (
				<Center sx={{ mt: 6 }}>
					<Spinner />
				</Center>
			)}
		</AnimatePresence>
	)
}

export default CategoryList
