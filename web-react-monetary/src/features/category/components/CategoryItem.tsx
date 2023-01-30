import { useNavigate } from "react-router-dom"

import {
	Alert, AlertIcon, AlertTitle, Box, Card, CardBody, Flex, Heading, Text
} from "@chakra-ui/react"

import Category from "../../../models/category"

const CategoryItem = ({
	category,
	clickable
}: {
	category: Category | undefined
	clickable: boolean
}) => {
	const navigate = useNavigate()

	return (
		<Card
			sx={{
				transition: "transform 0.3s",
				cursor: "pointer",
				":hover": clickable ? { transform: "scale(1.01)" } : {}
			}}
			onClick={() => (clickable && category ? navigate("/categories/" + category.id) : null)}>
			<CardBody>
				{category ? (
					<>
						<Flex
							sx={{
								alignItems: "center",
								gap: 2
							}}>
							<Box
								sx={{
									w: 6,
									h: 6,
									borderRadius: 6,
									bg: category.color
								}}
							/>
							<Heading size="md">{category.name}</Heading>
						</Flex>

						{category.category_ids.length ? (
							<Text sx={{ mt: 2 }}>
								{category.category_ids.length}{" "}
								{category.category_ids.length > 1 ? "subcategories" : "subcategory"}
							</Text>
						) : null}
					</>
				) : (
					<Alert
						variant="left-accent"
						status="error">
						<AlertIcon />
						<AlertTitle>Category not found</AlertTitle>
					</Alert>
				)}
			</CardBody>
		</Card>
	)
}

export default CategoryItem
