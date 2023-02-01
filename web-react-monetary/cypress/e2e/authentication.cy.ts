describe("Appropriate authentication redirects", () => {
    it("Loads /login when unauthenticated", () => {
        cy.visit("http://localhost:8000/login")

        cy.location("pathname").should("eq", "/login")
        cy.toasts([])
    })

    it("Redirects /login to /dashboard when authenticated", () => {
        cy.login()
    })

    it("Redirects /login to /accounts when authenticated with continue", () => {
        cy.login("/accounts")
    })

    it("Loads /register when unauthenticated", () => {
        cy.visit("http://localhost:8000/register")

        cy.location("pathname").should("eq", "/register")
        cy.toasts([])
    })

    it("Redirects /register to /dashboard when authenticated", () => {
        cy.login().push("/register")

        cy.location("pathname").should("eq", "/dashboard")
        cy.toasts([])
    })

    it("Redirects /logout to /login when unauthenticated", () => {
        cy.visit("http://localhost:8000/logout")

        cy.location("pathname").should("eq", "/login")
        cy.toasts([])
    })

    it("Redirects /logout to / when authenticated", () => {
        cy.login().push("/logout")

        cy.location("pathname").should("eq", "/")
        cy.toasts(["Logged out successfully!"])
    })

    it("Redirects /profile to /login when unauthenticated", () => {
        cy.visit("http://localhost:8000/profile")

        cy.location("pathname").should("eq", "/login")
        cy.toasts(["Unauthorized"])
    })

    it("Loads /profile when authenticated", () => {
        cy.login("/profile")
    })
})

describe("Login", () => {
    it("Cannot login with invalid data", () => {
        cy.intercept("POST", "/api/login").as("login")
        cy.visit("http://localhost:8000/login")

        cy.el("login-button").click()

        cy.wait("@login").its("response.statusCode").should("eq", 400)
        cy.contains("The email field is required.").should("exist")
        cy.contains("The password field is required.").should("exist")
        cy.toasts(["Invalid data"])

        cy.el("email-input").type("test")
        cy.el("password-input").type("test")
        cy.el("login-button").click()

        cy.wait("@login").its("response.statusCode").should("eq", 400)
        cy.contains("The email must be a valid email address.").should("exist")
        cy.toasts(["Invalid data"])

        cy.el("email-input").clear().type("zechariahtan144@gmail.com")
        cy.el("login-button").click()

        cy.location("pathname").should("eq", "/login")
        cy.toasts(["Login Error"])
    })

    it("Can hide and unhide password", () => {
        cy.intercept("POST", "/api/login").as("login")
        cy.visit("http://localhost:8000/login")

        cy.el("password-view-button").click()

        cy.el("password-input").should("have.attr", "type", "text")

        cy.el("password-view-button").click()

        cy.el("password-input").should("have.attr", "type", "password")
    })

    it("Can login", () => {
        cy.intercept("POST", "/api/login").as("login")
        cy.visit("http://localhost:8000/login")

        cy.el("email-input").type("zechariahtan144@gmail.com")
        cy.el("password-input").type("P@ssw0rd")
        cy.el("login-button").click()

        cy.wait("@login").its("response.statusCode").should("eq", 200)

        cy.location("pathname").should("eq", "/dashboard")
        cy.toasts(["Logged in successfully!"])
    })

    it("Can redirect to /register when clicking register", () => {
        cy.visit("http://localhost:8000/login")

        cy.el("register-link").click()

        cy.location("pathname").should("eq", "/register")
    })
})

describe("Register", () => {
    it("Cannot register with invalid data", () => {
        cy.intercept("POST", "/api/register").as("register")
        cy.visit("http://localhost:8000/register")

        cy.el("register-button").click()

        cy.wait("@register").its("response.statusCode").should("eq", 400)
        cy.contains("The email field is required.").should("exist")
        cy.contains("The password field is required.").should("exist")

        cy.el("email-input").type("test")
        cy.el("password-input").type("test")
        cy.el("register-button").click()

        cy.wait("@register").its("response.statusCode").should("eq", 400)
        cy.contains("The email must be a valid email address.").should("exist")
        cy.contains("The password must be at least 8 characters. The password must contain at least one uppercase and one lowercase letter. The password must contain at least one symbol. The password must contain at least one number.").should("exist")
        cy.toasts(["Invalid data"])

        cy.el("email-input").clear().type("zechariahtan144@gmail.com")
        cy.el("register-button").click()

        cy.wait("@register").its("response.statusCode").should("eq", 400)
        cy.contains("The email has already been taken.").should("exist")
        cy.toasts(["Invalid data"])
    })

    it("Can hide and unhide password", () => {
        cy.intercept("POST", "/api/register").as("register")
        cy.visit("http://localhost:8000/register")

        cy.el("password-view-button").click()

        cy.el("password-input").should("have.attr", "type", "text")

        cy.el("password-view-button").click()

        cy.el("password-input").should("have.attr", "type", "password")
    })

    it("Can register", () => {
        cy.intercept("POST", "/api/register").as("register")
        cy.visit("http://localhost:8000/register")

        cy.el("email-input").type("test@gmail.com")
        cy.el("password-input").type("test_P@ssw0rd")
        cy.el("register-button").click()

        cy.wait("@register").its("response.statusCode").should("eq", 200)

        cy.location("pathname").should("eq", "/dashboard")
        cy.toasts(["Registered successfully!"])
    })

    it("Can redirect to /login when clicking login", () => {
        cy.visit("http://localhost:8000/register")

        cy.el("login-link").click()

        cy.location("pathname").should("eq", "/login")
    })
})

describe("Logout", () => {
    it("Can logout", () => {
        cy.intercept("POST", "/api/logout").as("logout")
        cy.login().push("/logout")

        cy.wait("@logout").its("response.statusCode").should("eq", 200)

        cy.location("pathname").should("eq", "/")
        cy.window().then(win => {
            expect(win.localStorage.getItem("token")).to.be.null
            cy.toasts(["Logged out successfully!"])
        })
    })
})

describe("Profile", () => {
	let token

	beforeEach(() => {
		if (token) {
			cy.intercept("GET", "/api/user").as("getUser")
			cy.window().then(win => {
				win.localStorage.setItem("token", token)
			})
		}

		cy.visit("http://localhost:8000/login?continue=%2Fprofile")

		if (token) {
			cy.wait("@getUser").its("response.statusCode").should("eq", 200)
		} else {
			cy.el("email-input").type("test@gmail.com")
			cy.el("password-input").type("test_P@ssw0rd")
			cy.el("login-button").click()

            cy.toasts(["Logged in successfully!"])
		}

		cy.location("pathname").should("eq", "/profile")

		cy.window().then(win => {
			token = win.localStorage.getItem("token") as string
		})
	})

	it("Cannot update email with invalid data", () => {
		cy.intercept("PUT", "/api/user").as("updateUser")

		cy.el("email-input").clear()

		cy.el("email-save-button").should("be.disabled")

        cy.el("email-input").clear().type("test")
        cy.el("email-save-button").click()

        cy.wait("@updateUser").its("response.statusCode").should("eq", 400)
        cy.contains("The email must be a valid email address.").should("exist")
        cy.toasts(["Invalid data"])
	})

	it("Can update email", () => {
		cy.intercept("PUT", "/api/user").as("updateUser")

		cy.el("email-input").clear().type("test1@gmail.com")
		cy.el("email-save-button").click()

		cy.wait("@updateUser").its("response.statusCode").should("eq", 200)
        cy.toasts(["User updated successfully!"])
	})

	it("Cannot update password with invalid data", () => {
		cy.intercept("PUT", "/api/user/password").as("updateUserPassword")
        
		cy.el("password-save-button").should("be.disabled")

        cy.el("password-old-input").type("P@ssw0rd")
  
		cy.el("password-save-button").should("be.disabled")

        cy.el("password-new-input").type("test_P@ssw0rd")
		cy.el("password-save-button").click()

        cy.wait("@updateUserPassword").its("response.statusCode").should("eq", 400)
        cy.toasts(["Password Update Error"])

        cy.el("password-old-input").clear().type("test_P@ssw0rd")
        cy.el("password-new-input").clear().type("P@ssw0rd")
		cy.el("password-save-button").click()

        cy.wait("@updateUserPassword").its("response.statusCode").should("eq", 400)
        cy.contains("The given new password has appeared in a data leak. Please choose a different new password.").should("exist")
        cy.toasts(["Invalid data"])
	})

	it("Can update password", () => {
		cy.intercept("PUT", "/api/user/password").as("updateUserPassword")

		cy.el("password-old-input").clear().type("test_P@ssw0rd")
		cy.el("password-new-input").clear().type("test_P@ssw0rd")
		cy.el("password-save-button").click()

		cy.wait("@updateUserPassword").its("response.statusCode").should("eq", 200)
        cy.toasts(["Password updated successfully!"])
	})

    it("Can delete user", () => {
        cy.intercept("DELETE", "/api/user").as("deleteUser")

        cy.el("delete-user-button").click()
		cy.el("delete-confirm-button").click()

        cy.wait("@deleteUser").its("response.statusCode").should("eq", 200)

        cy.location("pathname").should("eq", "/")
        cy.toasts([])
    })
})
