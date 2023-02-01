import { Dispatch, SetStateAction } from "react"

import { Box, Flex, Text } from "@chakra-ui/react"

import Account from "../../../models/account"
import Dropdown from "../../Dropdown"

const AccountsInput = ({
	accounts,
	type,
	fromAccountId,
	setFromAccountId,
	toAccountId,
	setToAccountId
}: {
	accounts: Account[]
	type: "Outgoing" | "Incoming" | "Transfer" | null
	fromAccountId: string | null
	setFromAccountId: Dispatch<SetStateAction<string | null>>
	toAccountId: string | null
	setToAccountId: Dispatch<SetStateAction<string | null>>
}) => {
	return (
		<Flex gap={3}>
			<Box sx={{ w: "full" }}>
				<Text>{type === "Transfer" ? "From " : ""}Account</Text>
				<Dropdown
					choices={accounts
						.filter(a => a.id !== toAccountId)
						.map(a => ({ id: a.id, text: a.name }))}
					selectedChoiceId={fromAccountId}
					setSelectedChoiceId={setFromAccountId}
					placeholder="Select an account"
					data-cy="from-account-select"
				/>
			</Box>
			{type === "Transfer" ? (
				<Box sx={{ w: "full" }}>
					<Text>To Account</Text>
					<Dropdown
						choices={accounts
							.filter(a => a.id !== fromAccountId)
							.map(a => ({ id: a.id, text: a.name }))}
						selectedChoiceId={toAccountId}
						setSelectedChoiceId={setToAccountId}
						placeholder="Select an account"
						data-cy="to-account-select"
					/>
				</Box>
			) : null}
		</Flex>
	)
}

export default AccountsInput
