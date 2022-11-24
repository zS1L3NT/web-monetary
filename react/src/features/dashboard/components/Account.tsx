import { useState } from "react"
import { HiDotsVertical } from "react-icons/hi"

import { Box, Checkbox, Flex, GridItem, Icon, Text } from "@chakra-ui/react"

import { iAccount } from "../../../api/accounts"
import textColorOnBackground from "../../../utils/textColorOnBackground"

const Account = ({ account }: { account: iAccount }) => {
	const [checked, setChecked] = useState(false)

	const textColor = textColorOnBackground(account.color)

	return (
		<GridItem
			w="100%"
			h="64px"
			px={3}
			bg={account.color}
			display="flex"
			alignItems="center"
			justifyContent="space-between"
			borderRadius="12px"
			cursor="pointer"
			transition="filter 0.3s"
			_hover={{
				filter: "brightness(1.2)"
			}}
			onClick={() => setChecked(checked => !checked)}>
			<Flex direction="row">
				<Checkbox
					isChecked={checked}
					iconColor={textColor}
					borderColor={textColor}
					colorScheme={account.color}
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
			<Icon as={HiDotsVertical} />
		</GridItem>
	)
}

export default Account
