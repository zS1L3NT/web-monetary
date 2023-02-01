import { Card, CardBody, Flex, Text, useDisclosure } from "@chakra-ui/react"

import EditAccountModal from "../../../components/popups/EditAccountModal"
import Account from "../../../models/account"

const AccountItem = ({ account }: { account: Account }) => {
	const {
		isOpen: isEditAccountModalOpen,
		onOpen: onEditAccountModalOpen,
		onClose: onEditAccountModalClose
	} = useDisclosure()

	return (
		<>
			<Card
				sx={{
					transition: "transform 0.3s",
					cursor: "pointer",
					":hover": {
						transform: "scale(1.01)"
					}
				}}
				onClick={onEditAccountModalOpen}
				data-cy="account">
				<CardBody>
					<Flex sx={{ justifyContent: "space-between" }}>
						{account.renderAccount()}

						<Text sx={{ color: account.balance > 0 ? "green.500" : "yellow.500" }}>
							${account.balance.toFixed(2)}
						</Text>
					</Flex>
				</CardBody>
			</Card>
			<EditAccountModal
				account={account}
				isOpen={isEditAccountModalOpen}
				onClose={onEditAccountModalClose}
			/>
		</>
	)
}

export default AccountItem
