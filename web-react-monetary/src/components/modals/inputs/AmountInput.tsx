import { Dispatch, SetStateAction } from "react"

import {
	Box, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField,
	NumberInputStepper, Text
} from "@chakra-ui/react"

const AmountInput = ({
	amount,
	setAmount
}: {
	amount: number
	setAmount: Dispatch<SetStateAction<number>>
}) => {
	return (
		<Box>
			<Text>Amount</Text>
			<NumberInput
				defaultValue={amount}
				onBlur={e => setAmount(+e.target.value.replace(/^\$/, ""))}
				precision={2}
				step={0.05}>
				<NumberInputField />
				<NumberInputStepper>
					<NumberIncrementStepper />
					<NumberDecrementStepper />
				</NumberInputStepper>
			</NumberInput>
		</Box>
	)
}

export default AmountInput
