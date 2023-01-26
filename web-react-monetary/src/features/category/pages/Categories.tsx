import { Container, Heading } from "@chakra-ui/react"

import CategoryList from "../components/CategoryList"

const Categories = ({}: {}) => {
	return (
		<Container variant="page">
			<Heading
				sx={{
					mt: 6,
					mb: 4
				}}
				size="md">
				All Categories
			</Heading>
			<CategoryList />
		</Container>
	)
}

export default Categories
