import { useEffect, useRef, useState } from "react"
import { useLocation } from "react-router-dom"

import {
	Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader,
	ModalOverlay, Stack
} from "@chakra-ui/react"

import { useGetCategoryQuery, useUpdateCategoryMutation } from "../../api/categories"
import useOnlyAuthenticated from "../../hooks/useOnlyAuthenticated"
import useToastError from "../../hooks/useToastError"
import ColorInput from "./inputs/ColorInput"
import NameInput from "./inputs/NameInput"

const EditCategoryModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
	const { token } = useOnlyAuthenticated()

	const location = useLocation()
	const categoryId = location.pathname.slice(12)

	const [updateCategory, { error: updateCategoryError, isLoading: updateCategoryIsLoading }] =
		useUpdateCategoryMutation()
	const { data: category, error: categoryError } = useGetCategoryQuery(
		{
			token,
			category_id: categoryId!
		},
		{ skip: location.pathname.slice(1, 11) !== "categories" || !categoryId }
	)

	const [name, setName] = useState("")
	const [color, setColor] = useState("#FFFFFF")
	const finalFocusRef = useRef(null)

	useToastError(updateCategoryError, true)
	useToastError(categoryError, true)

	useEffect(() => {
		if (category) {
			setName(category.name)
			setColor(category.color)
		}
	}, [category])

	const handleEdit = async () => {
		if (invalid) return

		await updateCategory({
			token,
			category_id: categoryId,
			name,
			color
		})
	}

	const invalid = !name

	return (
		<Modal
			finalFocusRef={finalFocusRef}
			isOpen={isOpen}
			onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Edit Category</ModalHeader>
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
						isLoading={updateCategoryIsLoading}
						disabled={invalid}
						onClick={handleEdit}>
						Edit
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	)
}

export default EditCategoryModal
