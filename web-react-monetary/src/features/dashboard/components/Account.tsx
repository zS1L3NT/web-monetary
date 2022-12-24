import { useContext } from "react"
import { HiDotsVertical } from "react-icons/hi"

import { Box, Checkbox, Flex, GridItem, Icon, IconButton, Text } from "@chakra-ui/react"

import { iAccount } from "../../../api/accounts"
import textColorOnBackground from "../../../utils/textColorOnBackground"
import AccountsContext from "../contexts/AccountsContext"

const Account = ({ account }: { account: iAccount }) => {
	const { selectedAccounts, selectAccount, deselectAccount } = useContext(AccountsContext)

	const selected = !!selectedAccounts?.find(a => a.id === account.id)
	const textColor = selected ? textColorOnBackground(account.color) : "white"

	return (
		<GridItem
			w="100%"
			h="64px"
			px={3}
			bg={selected ? account.color : "none"}
			display="flex"
			alignItems="center"
			justifyContent="space-between"
			borderWidth={2}
			borderColor={account.color}
			borderRadius="12px"
			cursor="pointer"
			transition="filter 0.3s, background 0.3s"
			_hover={{ filter: "brightness(1.2)" }}
			onClick={() => (selected ? deselectAccount(account) : selectAccount(account))}>
			<Flex direction="row">
				<Checkbox
					isChecked={selected}
					iconColor={textColor}
					borderColor={textColor}
					colorScheme={account.color}
					onChange={e =>
						e.currentTarget.checked ? deselectAccount(account) : selectAccount(account)
					}
				/>
				<Box ml={3}>
					<Text
						color={textColor}
						fontSize={17}>
						{account.name}
					</Text>
					<Text
						color={textColor}
						fontWeight="bold">
						${account.initial_balance}
					</Text>
				</Box>
			</Flex>
			<IconButton
				aria-label="More Account Options"
				size="sm"
				icon={
					<Icon
						as={HiDotsVertical}
						color={textColor}
					/>
				}
				onClick={e => e.stopPropagation()}
			/>
		</GridItem>
	)
}

export default Account
