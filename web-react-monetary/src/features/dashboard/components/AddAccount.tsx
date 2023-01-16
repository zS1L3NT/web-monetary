import { HiPlus } from "react-icons/hi"

import { Flex, GridItem, Text } from "@chakra-ui/react"

const AddAccount = ({}: {}) => {
	return (
		<GridItem
			sx={{
				w: "full",
				h: "64px",
				px: 3,
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				borderRadius: "12px",
				borderWidth: 1,
				borderColor: "primary.200",
				cursor: "pointer",
				transition: "background 0.3s",
				_hover: {
					bg: "primary.300"
				}
			}}>
			<Flex
				sx={{
					flexDirection: "row",
					alignItems: "center"
				}}>
				<HiPlus />
				<Text sx={{ ml: 2 }}>Add Account</Text>
			</Flex>
		</GridItem>
	)
}

export default AddAccount
