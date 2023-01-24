import { useContext } from "react"

import {
	Box, Card, CardBody, CardHeader, Heading, Radio, RadioGroup, Stack, Text
} from "@chakra-ui/react"

import FiltersContext from "../contexts/FiltersContext"

const FiltersSidebar = ({}: {}) => {
	const { sortBy, setSortBy } = useContext(FiltersContext)

	return (
		<Card
			sx={{
				display: {
					base: "none",
					lg: "block"
				},
				width: 250,
				mt: 6
			}}>
			<CardHeader>
				<Heading size="md">Accounts</Heading>
			</CardHeader>
			<CardBody>
				<Box sx={{ px: 4 }}>
					<Text>Sort By</Text>
					<RadioGroup
						sx={{ mt: 2 }}
						value={sortBy}
						onChange={e =>
							setSortBy(
								e as "name-asc" | "name-desc" | "balance-asc" | "balance-desc"
							)
						}>
						<Stack>
							<Radio value="name-asc">Name Asc</Radio>
							<Radio value="name-desc">Name Desc</Radio>
							<Radio value="balance-asc">Balance Asc</Radio>
							<Radio value="balance-desc">Balance Desc</Radio>
						</Stack>
					</RadioGroup>
				</Box>
			</CardBody>
		</Card>
	)
}

export default FiltersSidebar
