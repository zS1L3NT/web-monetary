import { z } from "zod"

import { ArrowForwardIcon } from "@chakra-ui/icons"
import { Box, Flex, Text } from "@chakra-ui/react"

import Model from "./model"

export default class Account extends Model {
	static type: z.infer<typeof Account.schema>
	static fillable: Omit<typeof Account.type, "id" | "created_at" | "updated_at">
	static schema = z.object({
		id: z.string(),
		name: z.string(),
		initial_balance: z.number(),
		balance: z.number(),
		color: z.string(),
		created_at: z.string(),
		updated_at: z.string()
	})

	private constructor(
		id: string,
		public name: string,
		public initial_balance: number,
		public balance: number,
		public color: string,
		created_at: string,
		updated_at: string
	) {
		super(id, created_at, updated_at)
	}

	renderAccount(toAccount?: Account, right = false) {
		return (
			<Flex
				sx={{
					justifyContent: right ? "end" : "start",
					alignItems: "center"
				}}>
				<Box
					sx={{
						width: 4,
						height: 4,
						borderRadius: 4,
						bg: this.color
					}}
				/>
				<Text
					sx={{
						ml: 2,
						fontSize: 18,
						fontWeight: 500
					}}>
					{this.name}
				</Text>
				{toAccount ? (
					<>
						<ArrowForwardIcon sx={{ mx: 2 }} />
						<Box
							sx={{
								width: 4,
								height: 4,
								borderRadius: 4,
								bg: toAccount.color
							}}
						/>
						<Text
							sx={{
								ml: 2,
								fontSize: 18,
								fontWeight: 500
							}}>
							{toAccount.name}
						</Text>
					</>
				) : null}
			</Flex>
		)
	}

	static fromJSON(json: typeof Account.type): Account {
		const parsed = Account.schema.parse(json)

		return new Account(
			parsed.id,
			parsed.name,
			parsed.initial_balance,
			parsed.balance,
			parsed.color,
			parsed.created_at,
			parsed.updated_at
		)
	}

	toJSON(): typeof Account.type {
		return {
			id: this.id,
			name: this.name,
			initial_balance: this.initial_balance,
			balance: this.balance,
			color: this.color,
			created_at: this.$created_at,
			updated_at: this.$updated_at
		}
	}
}
