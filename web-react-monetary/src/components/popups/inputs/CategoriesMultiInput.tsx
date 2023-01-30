import { Dispatch, Fragment, SetStateAction } from "react"

import { Box, Checkbox, CheckboxGroup, Stack, Text } from "@chakra-ui/react"

import Category from "../../../models/category"

const CategoriesMultiInput = ({
	categories,
	categoryIds,
	setCategoryIds
}: {
	categories: Category[]
	categoryIds: string[]
	setCategoryIds: Dispatch<SetStateAction<string[]>>
}) => {
	const selectCategory = (category: Category) => {
		setCategoryIds([
			...new Set<string>([
				...categoryIds,
				category.id,
				...category.getSubcategories(categories).map(c => c.id)
			])
		])
	}

	const deselectCategory = (category: Category) => {
		setCategoryIds(
			categoryIds.filter(
				i =>
					![
						category.id,
						...category.getSubcategories(categories).map(c => c.id)
					].includes(i)
			)
		)
	}

	const renderCategories = (subCategoryIds: string[], depth: number) => {
		return (
			<Stack
				sx={{
					pl: depth * 6,
					mt: 1
				}}
				spacing={1}>
				{subCategoryIds
					.map(c => categories!.find(c_ => c_.id === c)!)
					.map(c => (
						<Fragment key={c.id}>
							<Checkbox
								isChecked={categoryIds.includes(c.id)}
								onChange={e =>
									e.target.checked ? selectCategory(c) : deselectCategory(c)
								}
								data-cy={c.id + "-checkbox"}>
								{c.name}
							</Checkbox>
							{c.category_ids.length
								? renderCategories(c.category_ids, depth + 1)
								: null}
						</Fragment>
					))}
			</Stack>
		)
	}

	return (
		<Box>
			<Text>Categories</Text>
			<CheckboxGroup>
				{renderCategories(
					categories
						.filter(c => !categories?.find(c_ => c_.category_ids.includes(c.id)))
						.map(c => c.id),
					0
				)}
			</CheckboxGroup>
		</Box>
	)
}

export default CategoriesMultiInput
