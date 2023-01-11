import { Fragment, useContext } from "react"

import {
	Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Card, CardBody,
	CardHeader, Center, Checkbox, CheckboxGroup, Flex, Heading, Input, Spinner, Stack, Text
} from "@chakra-ui/react"

import AccountsContext from "../contexts/AccountsContext"
import CategoriesContext from "../contexts/CategoriesContext"
import FiltersContext from "../contexts/FiltersContext"
import TransactionsContext from "../contexts/TransactionsContext"

const FiltersSidebar = ({}: {}) => {
	const { accounts } = useContext(AccountsContext)
	const { transactions } = useContext(TransactionsContext)
	const { categories } = useContext(CategoriesContext)
	const {
		selectedAccounts,
		selectAccount,
		deselectAccount,
		selectedCategories,
		selectCategory,
		deselectCategory,
		transactionTypes,
		selectTransactionType,
		deselectTransactionType,
		minAmount,
		setMinAmount,
		maxAmount,
		setMaxAmount
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
					defaultIndex={[0, 1, 2, 3]}
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
					<AccordionItem>
						<AccordionButton>
							Transaction Type
							<AccordionIcon sx={{ ml: "auto" }} />
						</AccordionButton>
						<AccordionPanel>
							<CheckboxGroup>
								<Stack>
									{(["Incoming", "Outgoing", "Transfer"] as const).map(tt => (
										<Checkbox
											key={tt}
											isChecked={!!transactionTypes.find(t => t === tt)}
											onChange={e =>
												e.target.checked
													? selectTransactionType(tt)
													: deselectTransactionType(tt)
											}>
											{tt}
										</Checkbox>
									))}
								</Stack>
							</CheckboxGroup>
						</AccordionPanel>
					</AccordionItem>
					<AccordionItem>
						<AccordionButton>
							Amount Range
							<AccordionIcon sx={{ ml: "auto" }} />
						</AccordionButton>
						<AccordionPanel sx={{ px: 2 }}>
							{transactions && maxAmount !== undefined ? (
								<Box>
									<Flex
										sx={{
											justifyContent: "space-between",
											mx: 2
										}}>
										<Text sx={{ fontSize: "sm" }}>Min</Text>
										<Text sx={{ fontSize: "sm" }}>Max</Text>
									</Flex>
									<Flex sx={{ gap: 2 }}>
										<Input
											defaultValue={minAmount}
											onBlur={e => {
												if (e.target.value === "") {
													e.target.value = minAmount + ""
												} else {
													setMinAmount(+e.target.value)
												}
											}}
										/>
										<Input
											defaultValue={maxAmount}
											onBlur={e => {
												if (e.target.value === "") {
													e.target.value = maxAmount + ""
												} else {
													setMaxAmount(+e.target.value)
												}
											}}
										/>
									</Flex>
								</Box>
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
