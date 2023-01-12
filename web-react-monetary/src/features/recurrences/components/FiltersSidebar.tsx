import {
	Box, Card, CardBody, CardHeader, Heading, Radio, RadioGroup, Stack, Text
} from "@chakra-ui/react"
import { useContext } from "react"
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
				<Heading size="md">Recurrences</Heading>
			</CardHeader>
			<CardBody>
				<Box sx={{ px: 4 }}>
					<Text>Sort By</Text>
					<RadioGroup
						sx={{ mt: 2 }}
						value={sortBy}
						onChange={e => setSortBy(e as "date-desc" | "date-asc")}>
						<Stack>
							<Radio value="date-asc">Date Ascending</Radio>
							<Radio value="date-desc">Date Descending</Radio>
						</Stack>
					</RadioGroup>
				</Box>
			</CardBody>
		</Card>
	)
}

export default FiltersSidebar
