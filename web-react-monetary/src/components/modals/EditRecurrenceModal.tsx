import { useRef } from "react"
import { useLocation } from "react-router-dom"

import {
	Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay
} from "@chakra-ui/react"

import { useGetRecurrenceQuery, useUpdateRecurrenceMutation } from "../../api/recurrences"
import useOnlyAuthenticated from "../../hooks/useOnlyAuthenticated"

const EditRecurrenceModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
	const { token } = useOnlyAuthenticated()
	const location = useLocation()
	const finalFocusRef = useRef(null)
	const recurrenceId = location.pathname.slice(13)

	const { data: recurrence, error: recurrenceError } = useGetRecurrenceQuery(
		{
			token,
			recurrence_id: recurrenceId!
		},
		{ skip: !recurrenceId }
	)
	const [
		updateRecurrence,
		{ error: updateRecurrenceError, isLoading: updateRecurrenceIsLoading }
	] = useUpdateRecurrenceMutation()

	const handleEdit = () => {}

	const invalid = true

	return (
		<Modal
			finalFocusRef={finalFocusRef}
			isOpen={isOpen}
			onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Edit Recurrence</ModalHeader>
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
						isLoading={updateRecurrenceIsLoading}
						disabled={invalid}
						onClick={handleEdit}>
						Edit
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	)
}

export default EditRecurrenceModal
