import Select from "react-select"

import { useColorModeValue } from "@chakra-ui/react"

const Dropdown = ({
	choices,
	selectedChoiceId,
	setSelectedChoiceId,
	isDisabled
}: {
	choices: { id: string; text: string }[]
	selectedChoiceId: string | null
	setSelectedChoiceId: (choiceId: string | null) => void
	isDisabled?: boolean
}) => {
	return (
		<Select
			value={
				selectedChoiceId
					? {
							value: selectedChoiceId,
							label: choices.find(c => c.id === selectedChoiceId)?.text ?? ""
					  }
					: null
			}
			options={choices.map(choice => ({ value: choice.id, label: choice.text }))}
			onChange={choiceId => setSelectedChoiceId(choiceId?.value ?? null)}
			isMulti={false}
			isSearchable={false}
			isDisabled={isDisabled}
			placeholder="Select a choice"
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
	)
}

export default Dropdown
