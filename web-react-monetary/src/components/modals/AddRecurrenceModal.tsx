import { useRef } from "react"

import {
	Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay
} from "@chakra-ui/react"

import { useCreateRecurrenceMutation } from "../../api/recurrences"
import useOnlyAuthenticated from "../../hooks/useOnlyAuthenticated"

const AddRecurrenceModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
	const { token } = useOnlyAuthenticated()
	const finalFocusRef = useRef(null)

	const [
		createRecurrence,
		{ error: createRecurrenceError, isLoading: createRecurrenceIsLoading }
	] = useCreateRecurrenceMutation()

	const handleCreate = () => {}

	const invalid = true

	return (
		<Modal
			finalFocusRef={finalFocusRef}
			isOpen={isOpen}
			onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Add Recurrence</ModalHeader>
				<ModalCloseButton />
				<ModalBody></ModalBody>
				<ModalFooter>
					<Button
						sx={{ mr: 3 }}
						variant="ghost"
						onClick={onClose}>
						Close
					</Button>
					<Button
						isLoading={createRecurrenceIsLoading}
						disabled={invalid}
						onClick={handleCreate}>
						Create
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	)
}

export default AddRecurrenceModal
