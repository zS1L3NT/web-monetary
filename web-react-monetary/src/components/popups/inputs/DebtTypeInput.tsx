import { Dispatch, SetStateAction } from "react"

import { Button, ButtonGroup } from "@chakra-ui/react"

const DebtTypeInput = ({
	type,
	setType
}: {
	type: "Lend" | "Borrow" | null
	setType: Dispatch<SetStateAction<"Lend" | "Borrow">>
}) => {
	return (
		<ButtonGroup
			sx={{
				display: "flex",
				justifyContent: "center"
			}}
			isAttached
			variant="outline">
			{(["Lend", "Borrow"] as const).map(t => (
				<Button
					key={t}
					variant={type === t ? "solid" : "outline"}
					onClick={() => setType(t)}>
					{t}
				</Button>
			))}
		</ButtonGroup>
	)
}

export default DebtTypeInput
