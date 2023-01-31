import { Dispatch, SetStateAction, useState } from "react"
import Select, { components } from "react-select"

import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons"
import { Box, Flex, Text, useColorModeValue } from "@chakra-ui/react"

import Category from "../../../models/category"

const CategoryInput = ({
	categories,
	categoryId,
	setCategoryId
}: {
	categories: Category[]
	categoryId: string | null
	setCategoryId: Dispatch<SetStateAction<string | null>>
}) => {
	const [parentCategoryId, setParentCategoryId] = useState<string | null>(null)

	return (
		<Box>
			<Text>Category</Text>
			<Select
				value={
					categoryId
						? {
								value: categoryId,
								label: categories.find(c => c.id === categoryId)?.name ?? ""
						  }
						: null
				}
				options={[
					parentCategoryId !== null
						? { value: "back", label: "Back" }
						: { value: "", label: "" },
					...categories
						.filter(c =>
							parentCategoryId === null
								? !categories?.find(c_ => c_.category_ids.includes(c.id))
								: categories
										.find(c => c.id === parentCategoryId)!
										.category_ids.includes(c.id)
						)
						.map(c => ({ value: c.id, label: c.name }))
				].filter(c => c.value !== "")}
				onChange={category => {
					if (category?.value && category.value !== "back") {
						setCategoryId(category?.value ?? null)
						if (
							categories.find(c => c.id === category.value)!.category_ids.length > 0
						) {
							setParentCategoryId(category.value)
						}
					} else {
						setParentCategoryId(
							categories.find(c => c.category_ids.includes(parentCategoryId!))?.id ??
								null
						)
					}
				}}
				isMulti={false}
				closeMenuOnSelect={false}
				isSearchable={false}
				placeholder="Select a category"
				components={{
					Control: props => (
						<div data-cy="category-select">
							<components.Control {...props}>{props.children}</components.Control>
						</div>
					),
					Option: props => (
						<div data-cy="category-select-option">
							<components.Option {...props}>
								{props.data.value === "back" ? (
									<Flex sx={{ alignItems: "center" }}>
										<ChevronLeftIcon mr={2} />
										{props.data.label}
									</Flex>
								) : (categories.find(c => c.id === props.data.value)?.category_ids
										.length ?? 0) > 0 ? (
									<Flex
										sx={{
											justifyContent: "space-between",
											alignItems: "center"
										}}>
										{props.data.label}
										<ChevronRightIcon />
									</Flex>
								) : (
									props.data.label
								)}
							</components.Option>
						</div>
					)
				}}
				styles={{
					indicatorSeparator: provided => ({
						...provided,
						display: "none"
					}),
					control: provided => ({
						...provided,
						cursor: "pointer",
						background: "var(--chakra-colors-gray-700)",
						borderWidth: "1px",
						borderColor:
							provided["borderColor"] === "hsl(0, 0%, 80%)"
								? "var(--chakra-colors-chakra-border-color)"
								: "var(--chakra-colors-primary-300)",
						boxShadow:
							provided["boxShadow"] === undefined
								? "none"
								: "0 0 0 1px var(--chakra-colors-primary-300)",
						transition: "border-color 0.3s ease, border-width 0.3s ease",
						":hover": {
							borderColor:
								((provided as any)["&:hover"]["borderColor"] as string) ===
								"hsl(0, 0%, 70%)"
									? "var(--chakra-colors-whiteAlpha-400)"
									: "var(--chakra-colors-primary-300)"
						}
					}),
					menu: provided => ({
						...provided,
						background: "var(--chakra-colors-gray-600)"
					}),
					option: (provided, state) => ({
						...provided,
						cursor: "pointer",
						color: "var(--chakra-colors-chakra-body-text)",
						background: "var(--chakra-colors-gray-600)",
						filter: state.isSelected
							? useColorModeValue("brightness(0.9)", "brightness(1.2)")
							: "none",
						":hover": {
							filter: useColorModeValue("brightness(0.9)", "brightness(1.2)"),
							background: "var(--chakra-colors-gray-600)"
						}
					}),
					singleValue: provided => ({
						...provided,
						color: "var(--chakra-colors-chakra-body-text)"
					})
				}}
			/>
		</Box>
	)
}

export default CategoryInput
