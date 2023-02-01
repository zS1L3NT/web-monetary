describe("Appropriate category authentication redirects", () => {
	it("Redirects /categories to /login when unauthenticated", () => {
		cy.visit("http://localhost:8000/categories")

		cy.location("pathname").should("eq", "/login")
		cy.toasts(["Unauthorized"])
	})

	it("Loads /categories when authenticated", () => {
		cy.login("/categories")
	})

	it("Redirects /categories/:id to /login when unauthenticated", () => {
		cy.visit("http://localhost:8000/categories/1")

		cy.location("pathname").should("eq", "/login")
		cy.toasts(["Unauthorized"])
	})

	it("Loads /categories/:id when authenticated", () => {
		cy.login("/categories/1")
	})
})

describe("Creating categories", () => {
	it("Cannot create a category with invalid data", () => {
		cy.intercept("POST", "/api/categories").as("createCategory")
		cy.login("/categories")

		cy.el("add-category-button").click()

		cy.el("add-button").should("be.disabled")

		cy.el("category-name")
			.first()
			.invoke("text")
			.then(name => cy.el("name-input").type(name))

		cy.el("add-button").should("be.enabled")

		cy.el("add-button").click()

		cy.wait("@createCategory").its("response.statusCode").should("eq", 409)
		cy.toasts(["Category with that name already exists"])
	})

	it("Can create a category", () => {
		cy.intercept("POST", "/api/categories").as("createCategory")
		cy.login("/categories")

		cy.el("add-category-button").click()

		cy.el("name-input").type("Test Category 1")

		cy.el("add-button").click()

		cy.wait("@createCategory").its("response.statusCode").should("eq", 200)
		cy.contains("Test Category 1").should("exist")
	})

	it("Can create a subcategory", () => {
		cy.intercept("POST", "/api/categories").as("createCategory")
		cy.login("/categories")

		cy.contains("Test Category 1").click()
		cy.el("add-subcategory-button").click()
		cy.el("name-input").type("Test Category 2")
		cy.el("add-button").click()

		cy.wait("@createCategory").its("response.statusCode").should("eq", 200)
		cy.contains("Test Category 2").should("exist")
	})
})

describe("Reading categories", () => {
	it("Can read categories", () => {
		cy.intercept("GET", "/api/categories").as("getCategories")
		cy.login("/categories")

		cy.wait("@getCategories").its("response.statusCode").should("eq", 200)

		cy.el("category").should("have.length", 3)
		cy.contains("Test Category 1").should("exist")
        cy.contains("1 subcategory")
	})

    it("Can read subcategories", () => {
        cy.intercept("GET", "/api/categories").as("getCategories")
        cy.login("/categories")

        cy.contains("Test Category 1").click()

        cy.wait("@getCategories").its("response.statusCode").should("eq", 200)
        cy.el("category").should("have.length", 2)
        cy.contains("Test Category 2").should("exist")
    })

	it("Cannot read a category with invalid id", () => {
		cy.intercept("GET", "/api/categories/*").as("getCategory")
		cy.login("/categories/1")

		cy.wait("@getCategory").its("response.statusCode").should("eq", 404)
		cy.get("[role=alert]").should("have.text", "Category not found")
		cy.toasts(["Category not found"])
	})

	it("Can read a category", () => {
		cy.intercept("GET", "/api/categories/*").as("getCategory")
		cy.login("/categories")

		cy.contains("Test Category 1").click()

		cy.wait("@getCategory").its("response.statusCode").should("eq", 200)
        cy.el("category").should("have.length", 2)
		cy.contains("Test Category 1").should("exist")
		cy.contains("Test Category 2").should("exist")
	})
})

describe("Updating categories", () => {
	it("Cannot update a category with invalid data", () => {
		cy.intercept("PUT", "/api/categories/*").as("updateCategory")
		cy.login("/categories")

		cy.el("category-name")
			.not(':contains("Test Category 1")')
			.first()
			.then(name => cy.wrap(name).as("name"))
		cy.contains("Test Category 1").first().click()
		cy.el("edit-category-button").click()
		cy.el("name-input").clear()

		cy.el("edit-button").should("be.disabled")

		cy.get("@name").then(name => cy.el("name-input").type(name.text()))

		cy.el("edit-button").should("be.enabled")

		cy.el("edit-button").click()

		cy.wait("@updateCategory").its("response.statusCode").should("eq", 409)
		cy.toasts(["Category with that name already exists"])
	})

	it("Can update a category", () => {
		cy.intercept("PUT", "/api/categories/*").as("updateCategory")
		cy.login("/categories")

		cy.contains("Test Category 1").first().click()
		cy.el("edit-category-button").click()
		cy.el("name-input").clear().type("Test Category 3")

		cy.el("edit-button").click()

		cy.wait("@updateCategory").its("response.statusCode").should("eq", 200)
		cy.contains("Test Category 3").should("exist")
	})
})

describe("Deleting categories", () => {
	it("Cannot delete a category with transactions", () => {
		cy.intercept("DELETE", "/api/categories/*").as("deleteCategory")
		cy.login("/categories")

		cy.el("category").not(':contains("Test Category 2")').first().click()
		cy.el("delete-category-button").click()
		cy.el("delete-confirm-button").click()

		cy.wait("@deleteCategory").its("response.statusCode").should("eq", 400)
		cy.toasts(["Transactions associated with this category exist"])
	})

	it("Can delete a subcategory", () => {
		cy.intercept("DELETE", "/api/categories/*").as("deleteCategory")
		cy.login("/categories")

		cy.contains("Test Category 3").first().click()
        cy.contains("Test Category 2").first().click()
		cy.el("delete-category-button").click()
		cy.el("delete-confirm-button").click()

		cy.wait("@deleteCategory").its("response.statusCode").should("eq", 200)
		cy.location("pathname").should("eq", "/categories")
	})

	it("Can delete a category", () => {
		cy.intercept("DELETE", "/api/categories/*").as("deleteCategory")
		cy.login("/categories")

		cy.contains("Test Category 3").first().click()
		cy.el("delete-category-button").click()
		cy.el("delete-confirm-button").click()

		cy.wait("@deleteCategory").its("response.statusCode").should("eq", 200)
		cy.location("pathname").should("eq", "/categories")
	})
})
