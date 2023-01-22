import { useContext } from "react"
import { HiDotsVertical } from "react-icons/hi"

import { Box, Checkbox, Flex, GridItem, Icon, IconButton, Text } from "@chakra-ui/react"

import Account from "../../../models/account"
import textColorOnBackground from "../../../utils/textColorOnBackground"
import AccountsContext from "../contexts/AccountsContext"

const AccountComponent = ({ account }: { account: Account }) => {
	const { selectedAccounts, selectOnlyAccount, selectAccount, deselectAccount } =
		useContext(AccountsContext)

	const selected = !!selectedAccounts?.find(a => a.id === account.id)
	const textColor = selected ? textColorOnBackground(account.color) : "white"

	return (
		<GridItem
			sx={{
				w: "100%",
				h: "64px",
				px: 3,
				bg: selected ? account.color : "none",
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				borderWidth: 2,
				borderColor: account.color,
				borderRadius: "12px",
				cursor: "pointer",
				transition: "filter 0.3s, background 0.3s",
				_hover: {
					filter: "brightness(1.2)"
				}
			}}
			onClick={e => {
				const target = e.target as HTMLElement
				const classes = [...target.classList]
				if (
					["svg", "polytine"].includes(target.tagName) ||
					classes.includes("chakra-checkbox") ||
					classes.includes("chakra-checkbox__control")
				)
					return
				if (classes.includes("chakra-checkbox__input")) {
					if (selected) {
						deselectAccount(account)
					} else {
						selectAccount(account)
					}
				} else {
					selectOnlyAccount(account)
				}
			}}>
			<Flex sx={{ flexDirection: "row" }}>
				<Box>
					<Checkbox
						sx={{
							top: "50%",
							transform: "translateY(-50%)",
							outline: "none"
						}}
						isChecked={selected}
						iconColor={textColor}
						borderColor={textColor}
						colorScheme={account.color}
						onClick={console.log}
					/>
				</Box>

				<Box ml={3}>
					<Text
						sx={{
							color: textColor,
							fontSize: 17
						}}>
						{account.name}
					</Text>
					<Text
						sx={{
							color: textColor,
							fontWeight: "bold"
						}}>
						${account.balance}
					</Text>
				</Box>
			</Flex>
		</GridItem>
	)
}

export default AccountComponent
