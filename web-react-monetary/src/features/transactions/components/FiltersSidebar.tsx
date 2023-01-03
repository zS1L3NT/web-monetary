import { Fragment, useContext } from "react"

import {
	Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Card, CardBody,
	CardHeader, Center, Checkbox, CheckboxGroup, Heading, Spinner, Stack
} from "@chakra-ui/react"

import AccountsContext from "../contexts/AccountsContext"
import CategoriesContext from "../contexts/CategoriesContext"
import FiltersContext from "../contexts/FiltersContext"

const FiltersSidebar = ({}: {}) => {
	const { accounts } = useContext(AccountsContext)
	const { categories } = useContext(CategoriesContext)
	const {
		selectedAccounts,
		selectAccount,
		deselectAccount,
		selectedCategories,
		selectCategory,
		deselectCategory
	} = useContext(FiltersContext)

	const renderCategories = (categoryIds: string[], depth: number) => {
		return (
			<Stack
				sx={{
					pl: depth * 6,
					mt: 1
				}}
				spacing={1}>
				{categoryIds
					.map(c => categories!.find(c_ => c_.id === c)!)
					.map(c => (
						<Fragment key={c.id}>
							<Checkbox
								isChecked={!!selectedCategories?.find(sc => sc.id === c.id)}
								onChange={e =>
									e.target.checked ? selectCategory(c) : deselectCategory(c)
								}>
								{c.name}
							</Checkbox>
							{c.category_ids.length
								? renderCategories(c.category_ids, depth + 1)
								: null}
						</Fragment>
					))}
			</Stack>
		)
	}

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
				<Heading size="md">Filters</Heading>
			</CardHeader>
			<CardBody>
				<Accordion
					defaultIndex={[0, 1]}
					allowMultiple>
					<AccordionItem>
						<AccordionButton>
							Accounts
							<AccordionIcon sx={{ ml: "auto" }} />
						</AccordionButton>
						<AccordionPanel>
							{accounts ? (
								<CheckboxGroup>
									<Stack>
										{accounts?.map(a => (
											<Checkbox
												key={a.id}
												isChecked={
													!!selectedAccounts?.find(sa => sa.id === a.id)
												}
												onChange={e =>
													e.target.checked
														? selectAccount(a)
														: deselectAccount(a)
												}>
												{a.name}
											</Checkbox>
										))}
									</Stack>
								</CheckboxGroup>
							) : (
								<Center mt={2}>
									<Spinner size="sm" />
								</Center>
							)}
						</AccordionPanel>
					</AccordionItem>
					<AccordionItem>
						<AccordionButton>
							Categories
							<AccordionIcon sx={{ ml: "auto" }} />
						</AccordionButton>
						<AccordionPanel>
							{categories ? (
								<CheckboxGroup>
									{renderCategories(
										(categories.find(c => c.category_ids.length > 0)
											? categories.filter(c => c.category_ids.length > 0)
											: categories
										).map(c => c.id),
										0
									)}
								</CheckboxGroup>
							) : (
								<Center mt={2}>
									<Spinner size="sm" />
								</Center>
							)}
						</AccordionPanel>
					</AccordionItem>
				</Accordion>
			</CardBody>
		</Card>
	)
}

export default FiltersSidebar
