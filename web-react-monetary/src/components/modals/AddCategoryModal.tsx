import { useRef, useState } from "react"

import {
	Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader,
	ModalOverlay, Stack
} from "@chakra-ui/react"

import { useCreateCategoryMutation, useUpdateCategoryMutation } from "../../api/categories"
import useOnlyAuthenticated from "../../hooks/useOnlyAuthenticated"
import useToastError from "../../hooks/useToastError"
import NameInput from "./inputs/NameInput"
import ColorInput from "./inputs/ColorInput"

const AddCategoryModal = ({
	parentCategoryId,
	isOpen,
	onClose
}: {
	parentCategoryId?: string
	isOpen: boolean
	onClose: () => void
}) => {
	const { token } = useOnlyAuthenticated()
	
	const [createCategory, { error: createCategoryError, isLoading: createCategoryIsLoading }] =
	useCreateCategoryMutation()
	const [updateCategory, { error: updateCategoryError, isLoading: updateCategoryIsLoading }] =
	useUpdateCategoryMutation()
	
	useToastError(createCategoryError, true)
	useToastError(updateCategoryError, true)
	
	const [name, setName] = useState("")
	const [color, setColor] = useState("#FFFFFF")
	const finalFocusRef = useRef(null)

	const handleCreate = async () => {
		if (invalid) return

		const response = await createCategory({
			token,
			name,
			color,
			category_ids: []
		})

		if ("data" in response && parentCategoryId) {
			await updateCategory({
				token,	
				category_id: parentCategoryId,
				category_ids: [response.data.id]
			})
			onClose()
		}
	}

	const invalid = !name

	return (
		<Modal
			finalFocusRef={finalFocusRef}
			isOpen={isOpen}
			onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Add {parentCategoryId ? "Subcategory" : "Category"}</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<Stack sx={{ gap: 2 }}>
						<NameInput
							name={name}
							setName={setName}
						/>

						<ColorInput
							color={color}
							setColor={setColor}
						/>
					</Stack>
				</ModalBody>
				<ModalFooter>
					<Button
						sx={{ mr: 3 }}
						variant="ghost"
						onClick={onClose}>
						Close
					</Button>
					<Button
						isLoading={createCategoryIsLoading || updateCategoryIsLoading}
						disabled={invalid}
						onClick={handleCreate}>
						Add
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	)
}

export default AddCategoryModal
