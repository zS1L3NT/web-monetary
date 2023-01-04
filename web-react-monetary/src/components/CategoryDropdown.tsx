import { useState } from "react"
import Select, { components, OptionProps } from "react-select"

import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons"
import { Flex, useColorModeValue } from "@chakra-ui/react"

import { iCategory } from "../api/categories"

const CategoryDropdown = ({
	categories,
	selectedCategoryId,
	setSelectedCategoryId,
	isDisabled
}: {
	categories: iCategory[]
	selectedCategoryId: string | null
	setSelectedCategoryId: (choice: string | null) => void
	isDisabled?: boolean
}) => {
	const [parentCategoryId, setParentCategoryId] = useState<string | null>(null)

	return (
		<Select
			value={
				selectedCategoryId
					? {
							value: selectedCategoryId,
							label: categories.find(c => c.id === selectedCategoryId)?.name ?? ""
					  }
					: null
			}
			options={[
				parentCategoryId !== null
					? { value: "back", label: "Back" }
					: { value: "", label: "" },
				...categories
					.filter(c =>
						categories.every(c => c.category_ids.length === 0)
							? true
							: parentCategoryId === null
							? c.category_ids.length > 0
							: categories
									.find(c => c.id === parentCategoryId)!
									.category_ids.includes(c.id)
					)
					.map(c => ({ value: c.id, label: c.name }))
			].filter(c => c.value !== "")}
			onChange={category => {
				if (category?.value && category.value !== "back") {
					setSelectedCategoryId(category?.value ?? null)
					if (categories.find(c => c.id === category.value)!.category_ids.length > 0) {
						setParentCategoryId(category.value)
					}
				} else {
					setParentCategoryId(
						categories.find(c => c.category_ids.includes(parentCategoryId!))?.id ?? null
					)
				}
			}}
			isMulti={false}
			closeMenuOnSelect={false}
			isSearchable={false}
			isDisabled={isDisabled}
			placeholder="Select a category"
			components={{
				Option: (props: OptionProps<{ value: string; label: string }>) => {
					return (
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
					)
				}
			}}
			styles={{
				indicatorSeparator: provided => ({
					...provided,
					display: "none"
				}),
				control: provided => ({
					...provided,
					cursor: "pointer",
					background: "var(--chakra-colors-card)",
					borderWidth: "1px",
					borderColor:
						provided["borderColor"] === "hsl(0, 0%, 80%)"
							? "var(--chakra-colors-chakra-border-color)"
							: "#63b3ed",
					boxShadow:
						provided["boxShadow"] === undefined
							? "none"
							: "0 0 0 1px #63b3ed",
					transition: "border-color 0.3s ease, border-width 0.3s ease",
					":hover": {
						borderColor:
							((provided as any)["&:hover"]["borderColor"] as string) ===
							"hsl(0, 0%, 70%)"
								? "var(--chakra-colors-whiteAlpha-400)"
								: "#63b3ed"
					}
				}),
				menu: provided => ({
					...provided,
					background: "var(--chakra-colors-card)"
				}),
				option: (provided, state) => ({
					...provided,
					cursor: "pointer",
					color: "var(--chakra-colors-chakra-body-text)",
					background: "var(--chakra-colors-card)",
					filter: state.isSelected
						? useColorModeValue("brightness(0.9)", "brightness(1.2)")
						: "none",
					":hover": {
						filter: useColorModeValue("brightness(0.9)", "brightness(1.2)"),
						background: "var(--chakra-colors-card)"
					}
				}),
				singleValue: provided => ({
					...provided,
					color: "var(--chakra-colors-chakra-body-text)"
				})
			}}
		/>
	)
}

export default CategoryDropdown
