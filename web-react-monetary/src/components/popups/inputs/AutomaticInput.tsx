import { Dispatch, SetStateAction } from "react"

import { Checkbox } from "@chakra-ui/react"

const AutomaticInput = ({
	automatic,
	setAutomatic
}: {
	automatic: boolean
	setAutomatic: Dispatch<SetStateAction<boolean>>
}) => {
	return (
		<Checkbox
			isChecked={automatic}
			onChange={e => setAutomatic(e.target.checked)}>
			Automatically approve transactions
		</Checkbox>
	)
}

export default AutomaticInput
