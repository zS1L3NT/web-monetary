import { Fragment, useContext } from "react"

import {
	Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Card, CardBody,
	CardHeader, Center, Checkbox, CheckboxGroup, Flex, Heading, Input, Radio, RadioGroup, Spinner,
	Stack, Text
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
		sortBy,
		setSortBy,
		selectedAccounts,
		selectAccount,
		deselectAccount,
		selectedCategories,
		selectCategory,
		deselectCategory,
		transactionTypes,
		selectTransactionType,
		deselectTransactionType,
		range,
		setRange,
		minAmount,
		setMinAmount,
		maxAmount,
		setMaxAmount
	} = useContext(FiltersContext)

	const renderCategories = (categoryIds: string[], depth: number) => {
		return (
			<Stack
				sx={{
					pl: depth ? 6 : 0,
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
								}
								data-cy="category-checkbox">
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
				<Heading size="md">Transactions</Heading>
			</CardHeader>
			<CardBody>
				<Box sx={{ px: 4 }}>
					<Text>Sort By</Text>
					<RadioGroup
						sx={{ mt: 2 }}
						value={sortBy}
						onChange={e => setSortBy(e as "date-desc" | "date-asc")}>
						<Stack>
							<Radio value="date-asc">Date Asc</Radio>
							<Radio value="date-desc">Date Desc</Radio>
						</Stack>
					</RadioGroup>
				</Box>
				<Accordion
					sx={{ mt: 4 }}
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
												}
												data-cy="account-checkbox">
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
										categories
											.filter(
												c =>
													!categories?.find(c_ =>
														c_.category_ids.includes(c.id)
													)
											)
											.map(c => c.id),
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
											}
											data-cy="transaction-type-checkbox">
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
							<RadioGroup
								value={range}
								onChange={e => setRange(e as "range-all" | "range-custom")}>
								<Stack>
									<Radio
										value="range-all"
										data-cy="range-all-radio">
										All
									</Radio>
									<Radio
										value="range-custom"
										data-cy="range-custom-radio">
										Custom
									</Radio>
								</Stack>
							</RadioGroup>
							{range === "range-custom" && transactions && maxAmount !== undefined ? (
								<Box sx={{ mt: 2 }}>
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
											data-cy="min-amount-input"
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
											data-cy="max-amount-input"
										/>
									</Flex>
								</Box>
							) : range === "range-custom" ? (
								<Center mt={2}>
									<Spinner size="sm" />
								</Center>
							) : null}
						</AccordionPanel>
					</AccordionItem>
				</Accordion>
			</CardBody>
		</Card>
	)
}

export default FiltersSidebar
