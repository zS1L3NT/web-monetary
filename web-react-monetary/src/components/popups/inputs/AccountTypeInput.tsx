import { Dispatch, SetStateAction } from "react"

import { Button, ButtonGroup } from "@chakra-ui/react"

const AccountTypeInput = ({
	type,
	setType,
	setToAccountId
}: {
	type: "Outgoing" | "Incoming" | "Transfer" | null
	setType: Dispatch<SetStateAction<"Outgoing" | "Incoming" | "Transfer">>
	setToAccountId: Dispatch<SetStateAction<string | null>>
}) => {
	return (
		<ButtonGroup
			sx={{
				display: "flex",
				justifyContent: "center"
			}}
			isAttached
			variant="outline">
			{(["Outgoing", "Incoming", "Transfer"] as const).map(t => (
				<Button
					key={t}
					variant={type === t ? "solid" : "outline"}
					onClick={() => {
						if (type === "Transfer" && t !== "Transfer") {
							setToAccountId(null)
						}
						setType(t)
					}}
					data-cy={t.toLowerCase() + "-button"}>
					{t}
				</Button>
			))}
		</ButtonGroup>
	)
}

export default AccountTypeInput
