describe("Appropriate transaction authentication redirects", () => {
	it("Redirects /transactions to /login when unauthenticated", () => {
		cy.visit("http://localhost:8000/transactions")

		cy.location("pathname").should("eq", "/login")
		cy.toasts(["Unauthorized"])
	})

	it("Loads /transactions when authenticated", () => {
		cy.login("/transactions")
	})
})

describe("Creating transactions", () => {
	it("Cannot create a transaction with invalid data", () => {
		cy.login("/transactions")

		cy.el("add-transaction-button").click()

		cy.el("from-account-select").click()
		cy.el("from-account-select-option").first().click()

		cy.el("add-button").should("be.disabled")

		cy.el("transfer-button").click()

		cy.el("add-button").should("be.disabled")

		cy.el("to-account-select").click()
		cy.el("to-account-select-option").first().click()

		cy.el("add-button").should("be.disabled")

		cy.el("category-select").click()
		cy.el("category-select-option").first().click()
		cy.el("category-select").click()

		cy.el("add-button").should("be.disabled")

		cy.el("amount-input").clear().type("1000")
		cy.el("date-time-input").focus()

		cy.el("add-button").should("be.enabled")
	})

	it("Can create a transaction", () => {
		cy.intercept("POST", "/api/transactions").as("createTransaction")
		cy.login("/transactions")

		cy.el("add-transaction-button").click()
		cy.el("from-account-select").click()
		cy.el("from-account-select-option").first().click()
		cy.el("category-select").click()
		cy.el("category-select-option").first().click()
		cy.el("category-select").click()
		cy.el("amount-input").clear().type("1000")
		cy.el("date-time-input").focus()
		cy.el("add-button").click()

		cy.wait("@createTransaction").its("response.statusCode").should("eq", 200)
		cy.contains("-$1000.00").should("exist")
	})
})

describe("Reading transactions", () => {
	it("Can read transactions", () => {
		cy.login("/transactions")

		cy.get(".chakra-card").should("have.length", 152)
		cy.contains("-$1000.00").should("exist")
	})

	it("Can read transactions filtered by accounts", () => {
		cy.login("/transactions").wait(500)

		cy.el("account-checkbox").each(el => {
			cy.wrap(el).click().wait(500)
			cy.el("account-name").should("not.have.text", el.children().last().text())
			cy.wrap(el).click().wait(500)
		})
	})

	it("Can read transactions filtered by categories", () => {
		cy.login("/transactions").wait(500)

		cy.el("category-checkbox").each(el => {
			cy.wrap(el).click().wait(500)
			cy.el("category-name").should("not.have.text", el.children().last().text())
			cy.wrap(el).click().wait(500)
		})
	})

	it("Can read transactions filtered by transaction type", () => {
		cy.login("/transactions").wait(500)

		cy.el("transaction-type-checkbox").each(el => {
			const transactionType = el.children().last().text()

			cy.wrap(el).click().wait(500)

			cy.el("transaction-amount").should(
				"not.have.css",
				"color",
				`var(--chakra-colors-${
					transactionType === "Outgoing"
						? "red"
						: transactionType === "Incoming"
						? "green"
						: "yellow"
				}-500)`
			)

			cy.wrap(el).click().wait(500)
		})
	})

	it("Can read transactions filtered by amount range", () => {
		cy.login("/transactions").wait(500)

        cy.el("transaction-amount").should("have.length", 151)

        cy.el("range-custom-radio").click()
		cy.el("max-amount-input").clear().type("100")
		cy.el("min-amount-input").focus().wait(500)

		cy.el("transaction-amount").each(el => {
			expect(parseFloat(el.text().replace("$", "").replace("-", ""))).to.be.lte(100)
		})

		cy.el("min-amount-input").clear().type("900")
		cy.el("max-amount-input").focus().wait(500)
		cy.el("max-amount-input").clear().type("1000")
		cy.el("min-amount-input").focus().wait(500)

		cy.el("transaction-amount").each(el => {
			expect(parseFloat(el.text().replace("$", "").replace("-", ""))).to.be.gte(900)
		})

        cy.el("range-all-radio").click().wait(500)

        cy.el("transaction-amount").should("have.length", 151)
	})
})

describe("Updating transactions", () => {
	it("Cannot update a transaction with invalid data", () => {
		cy.login("/transactions")

		cy.contains("-$1000.00").first().click()
		cy.el("transfer-button").click()

		cy.el("edit-button").should("be.disabled")

		cy.el("to-account-select").click()
		cy.el("to-account-select-option").first().click()
		cy.el("amount-input").clear()

		cy.el("edit-button").focus().should("be.disabled")

		cy.el("amount-input").type("1000")
		cy.el("date-time-input").focus()

		cy.el("edit-button").should("be.enabled")
	})

	it("Can update a transaction", () => {
		cy.intercept("PUT", "/api/transactions/*").as("updateTransaction")
		cy.login("/transactions")

		cy.contains("-$1000.00").first().click()
		cy.el("outgoing-button").click()
		cy.el("from-account-select").click()
		cy.el("from-account-select-option").eq(1).click()
		cy.el("category-select").click()
		cy.el("category-select-option").eq(1).click()
		cy.el("category-select").click()
		cy.el("amount-input").clear().type("2000")
		cy.el("date-time-input").focus()
		cy.el("edit-button").click()

		cy.wait("@updateTransaction").its("response.statusCode").should("eq", 200)
		cy.contains("-$2000.00").should("exist")
	})
})

describe("Deleting transactions", () => {
	it("Can delete a transaction", () => {
		cy.intercept("DELETE", "/api/transactions/*").as("deleteTransaction")
		cy.login("/transactions")

		cy.contains("-$2000.00").first().click()
		cy.el("delete-transaction-button").click()
		cy.el("delete-confirm-button").click()

		cy.wait("@deleteTransaction").its("response.statusCode").should("eq", 200)
	})
})
