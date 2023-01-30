import { Dispatch, SetStateAction } from "react"

import { Box, Checkbox, CheckboxGroup, Stack, Text } from "@chakra-ui/react"

import Account from "../../../models/account"

const AccountsMultiInput = ({
	accounts,
	accountIds,
	setAccountIds
}: {
	accounts: Account[]
	accountIds: string[]
	setAccountIds: Dispatch<SetStateAction<string[]>>
}) => {
	return (
		<Box>
			<Text>Accounts</Text>
			<CheckboxGroup>
				<Stack spacing={1}>
					{accounts.map(a => (
						<Checkbox
							key={a.id}
							isChecked={accountIds.includes(a.id)}
							onChange={e =>
								e.target.checked
									? setAccountIds([...accountIds, a.id])
									: setAccountIds(accountIds.filter(i => i !== a.id))
							}
							data-cy={a.id + "-checkbox"}>
							{a.name}
						</Checkbox>
					))}
				</Stack>
			</CheckboxGroup>
		</Box>
	)
}

export default AccountsMultiInput
