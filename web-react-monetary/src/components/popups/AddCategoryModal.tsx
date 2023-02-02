import { useRef, useState } from "react"

import {
	Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader,
	ModalOverlay, Stack
} from "@chakra-ui/react"

import { useCreateCategoryMutation } from "../../api/categories"
import useOnlyAuthenticated from "../../hooks/useOnlyAuthenticated"
import useToastError from "../../hooks/useToastError"
import Category from "../../models/category"
import ColorInput from "./inputs/ColorInput"
import NameInput from "./inputs/NameInput"

const AddCategoryModal = ({
	parentCategory,
	isOpen,
	onClose
}: {
	parentCategory?: Category
	isOpen: boolean
	onClose: () => void
}) => {
	const { token } = useOnlyAuthenticated()

	const [createCategory, { error: createCategoryError, isLoading: createCategoryIsLoading }] =
		useCreateCategoryMutation()

	const [name, setName] = useState("")
	const [color, setColor] = useState("#FFFFFF")
	const finalFocusRef = useRef(null)

	useToastError(createCategoryError)

	const handleCreate = async () => {
		if (invalid) return

		const createCategoryResponse = await createCategory({
			token,
			name,
			color,
			category_ids: [],
			parent_category_id: parentCategory?.id
		})

		if ("error" in createCategoryResponse) return

		onClose()
	}

	const invalid = !name

	return (
		<Modal
			finalFocusRef={finalFocusRef}
			isOpen={isOpen}
			onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Add {parentCategory ? "Subcategory" : "Category"}</ModalHeader>
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
						isLoading={createCategoryIsLoading}
						disabled={invalid}
						onClick={handleCreate}
						data-cy="add-button">
						Add
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	)
}

export default AddCategoryModal
