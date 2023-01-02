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

export default Dropdown
