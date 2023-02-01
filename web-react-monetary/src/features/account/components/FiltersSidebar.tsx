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
							<Radio
								value="name-asc"
								data-cy="name-asc-radio">
								Name Asc
							</Radio>
							<Radio
								value="name-desc"
								data-cy="name-desc-radio">
								Name Desc
							</Radio>
							<Radio
								value="balance-asc"
								data-cy="balance-asc-radio">
								Balance Asc
							</Radio>
							<Radio
								value="balance-desc"
								data-cy="balance-desc-radio">
								Balance Desc
							</Radio>
						</Stack>
					</RadioGroup>
				</Box>
			</CardBody>
		</Card>
	)
}

export default FiltersSidebar
