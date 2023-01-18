import { useParams } from "react-router-dom"

import { Center, Container, Heading, Spinner, Stack } from "@chakra-ui/react"

import { useGetCategoriesQuery } from "../../../api/categories"
import useOnlyAuthenticated from "../../../hooks/useOnlyAuthenticated"
import useToastError from "../../../hooks/useToastError"
import CategoryItem from "../components/CategoryItem"

const Category = ({}: {}) => {
	const { token } = useOnlyAuthenticated()
	const { category_id } = useParams()

	const {
		data: categories,
		error: categoriesError,
		isLoading: categoriesAreLoading
	} = useGetCategoriesQuery({ token })

	useToastError(categoriesError, true)

	const category = categories?.find(c => c.id === category_id)

	return (
		<Container variant="page">
			<Stack
				sx={{
					mt: 6,
					gap: 2
				}}>
				<Heading size="md">Category</Heading>
				{!categoriesAreLoading ? (
					<CategoryItem
						category={category}
						clickable={false}
					/>
				) : (
					<Center>
						<Spinner />
					</Center>
				)}
				{category?.category_ids.length ? <Heading size="md">Subcategories</Heading> : null}
				{!categoriesAreLoading ? (
					<Stack>
						{categories!
							.filter(c => category?.category_ids.includes(c.id))
							.map(c => (
								<CategoryItem
									key={c.id}
									category={c}
									clickable={true}
								/>
							))}
					</Stack>
				) : (
					<Center>
						<Spinner />
					</Center>
				)}
			</Stack>
		</Container>
	)
}

export default Category
