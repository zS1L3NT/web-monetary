import { useParams } from "react-router-dom"

import { AddIcon } from "@chakra-ui/icons"
import {
	Center, Container, Flex, Heading, IconButton, Spinner, Stack, useDisclosure
} from "@chakra-ui/react"

import { useGetCategoriesQuery } from "../../../api/categories"
import AddCategoryModal from "../../../components/popups/AddCategoryModal"
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

	const {
		isOpen: isAddCategoryModalOpen,
		onOpen: onAddCategoryModalOpen,
		onClose: onAddCategoryModalClose
	} = useDisclosure()

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
				<Flex sx={{ alignItems: "center" }}>
					<Heading
						sx={{ flex: 1 }}
						size="md">
						Subcategories
					</Heading>
					<IconButton
						aria-label="Add subcategory"
						variant="outline"
						icon={<AddIcon />}
						size="sm"
						onClick={onAddCategoryModalOpen}
						data-cy="add-subcategory-button"
					/>
				</Flex>
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
			<AddCategoryModal
				parentCategory={category}
				isOpen={isAddCategoryModalOpen}
				onClose={onAddCategoryModalClose}
			/>
		</Container>
	)
}

export default Category
