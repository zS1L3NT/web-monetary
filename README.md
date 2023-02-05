# Monetary

![License](https://img.shields.io/github/license/zS1L3NT/web-monetary?style=for-the-badge) ![Languages](https://img.shields.io/github/languages/count/zS1L3NT/web-monetary?style=for-the-badge) ![Top Language](https://img.shields.io/github/languages/top/zS1L3NT/web-monetary?style=for-the-badge) ![Commit Activity](https://img.shields.io/github/commit-activity/y/zS1L3NT/web-monetary?style=for-the-badge) ![Last commit](https://img.shields.io/github/last-commit/zS1L3NT/web-monetary?style=for-the-badge)

Monetary is an expense tracking website that allows you to take control of your finances yourself. This is a rebuild of an app that I personally use everyday to track my finances, Wallet.

Monetary is build using the microservices architecture and is split into 7 microservices. The backend has been tested with PHPUnit and the frontend has been tested with Cypress. Github Action will automatically test the application and make sure the tests pass before deploying them to the server, see the [Actions](http://github.com/zS1L3NT/web-monetary/actions) tab

View the video demonstration of the website, pipelines and testing [here](https://youtu.be/dPQL6_mx2CA)

## Motivation

I needed a deliverable for my CADV (Cloud Application Development) and DevOps (Development Operations) submissions. I decided to clone Wallet because it was a big project and I was looking for a challenge.

## Subrepositories

### [`web-laravel-monetary-account`](web-laravel-monetary-account)

The Account microservice which handles accounts (bank, cash, etc)

### [`web-laravel-monetary-authentication`](web-laravel-monetary-authentication)

The Authentication microservice which handles user authentication and data (login, logout, etc)

### [`web-laravel-monetary-budget`](web-laravel-monetary-budget)

The Budget microservice which handles budgets (monthly, weekly, etc)

### [`web-laravel-monetary-category`](web-laravel-monetary-category)

The Category microservice which handles categories (food, bills, etc)

### [`web-laravel-monetary-debt`](web-laravel-monetary-debt)

The Debt microservice which handles debts (loans, etc)

### [`web-laravel-monetary-recurrence`](web-laravel-monetary-recurrence)

The Recurrence microservice which handles recurrences (spotify subscription, dicord nitro subscription, etc)

### [`web-laravel-monetary-transaction`](web-laravel-monetary-transaction)

The Transaction microservice which handles transactions (purchases, etc)

### [`web-react-monetary`](web-react-monetary)

The React frontend of the application

## Features

-   Authentication
    -   Login with email and password
    -   Register with email and password
    -   Reset password with email
    -   Update user email and password
-   Account
    -   Create Accounts
    -   View & Sort Accounts
    -   Update Accounts
    -   Delete Accounts
-   Budget
    -   Create Budgets
    -   View Budgets and their Transactions
    -   Update Budgets
    -   Delete Budgets
-   Category
    -   Create Categories
    -   View Categories
    -   Update Categories
    -   Delete Categories
-   Debt
    -   Create Debts
    -   View Debts and their Transactions
    -   Update Debts
    -   Delete Debts
-   Recurrence
    -   Create Recurrences
    -   View Recurrences and their Transactions
    -   Update Recurrences
    -   Delete Recurrences
-   Transaction
    -   Create Transactions
    -   View Transactions
    -   Update Transactions
    -   Delete Transactions

## Usage

### Locally

Copy the .env.example file to .env then fill in the file with the correct project credentials.

```bash
$ docker compose up -d --build
```

You also need to have a local installation of NGINX, then set the configuration to that in [`nginx.dev.conf`](nginx.dev.conf)

### Deployment

Since deployment can be different for everyone in terms what OS you're deploying to, I will give a general overview of how I deploy the application. You also need a PostgreSQL database hosted somewhere on the internet or locally. I will also assume that you have a fork of this repository so that you can use Github actions to deploy the application automatically.

With this current configuration, all the Github Actions workflows will deploy to one server. If you want you can change that to deploy to multiple servers to follow the microserviecs architecture properly.

#### Setting up the server

The server will need to have `docker` and `nginx` installed. The nginx configuration of the server will need to be set to that in [`nginx.prod.conf`](nginx.prod.conf). It will also need to be open to SSH connections so that Github Actions can deploy the application.

#### Setting up the Github Actions

In your Github project settings, go to **Environments** and add a new environment called `production` and set all the environment variables in [`.env.example`](.env.example) to the correct values. Also under **Secrets and variables** and **Actions**, add all the secrets in [`.secrets.example`](.secrets.example) except `GITHUB_TOKEN` to the repository.

## Credits

I had difficulties installing PHP on MacOS, [this](https://gist.github.com/giorgiofellipe/6282df335fd310de4108) tutorial really helped me fix that

## Tests

### Backend

VSCode Extensions do quite a good job in detecting PHPUnit tests, but if you want to run them manually, you can run the following command in each directory

```bash
vendor/bin/phpunit tests
```

Just make sure the environment variables are detected by the script

### Frontend

```bash
pnpx cypress open
```

Then use the Cypress UI to run each test individually

## Built with

-   React
    -   TypeScript
        -   [![@types/luxon](https://img.shields.io/badge/%40types%2Fluxon-%5E3.1.0-red?style=flat-square)](https://npmjs.com/package/@types/luxon/v/3.1.0)
        -   [![@types/react](https://img.shields.io/badge/%40types%2Freact-%5E18.0.26-red?style=flat-square)](https://npmjs.com/package/@types/react/v/18.0.26)
        -   [![@types/react-dom](https://img.shields.io/badge/%40types%2Freact--dom-%5E18.0.10-red?style=flat-square)](https://npmjs.com/package/@types/react-dom/v/18.0.10)
        -   [![typescript](https://img.shields.io/badge/typescript-%5E4.9.4-red?style=flat-square)](https://npmjs.com/package/typescript/v/4.9.4)
    -   Chakra UI
        -   [![@chakra-ui/icons](https://img.shields.io/badge/%40chakra--ui%2Ficons-%5E2.0.14-red?style=flat-square)](https://npmjs.com/package/@chakra-ui/icons/v/2.0.14)
        -   [![@chakra-ui/react](https://img.shields.io/badge/%40chakra--ui%2Freact-%5E2.4.4-red?style=flat-square)](https://npmjs.com/package/@chakra-ui/react/v/2.4.4)
        -   [![@chakra-ui/styled-system](https://img.shields.io/badge/%40chakra--ui%2Fstyled--system-%5E2.5.0-red?style=flat-square)](https://npmjs.com/package/@chakra-ui/styled-system/v/2.5.0)
        -   [![@chakra-ui/system](https://img.shields.io/badge/%40chakra--ui%2Fsystem-%5E2.3.5-red?style=flat-square)](https://npmjs.com/package/@chakra-ui/system/v/2.3.5)
        -   [![@emotion/react](https://img.shields.io/badge/%40emotion%2Freact-%5E11.10.5-red?style=flat-square)](https://npmjs.com/package/@emotion/react/v/11.10.5)
        -   [![@emotion/styled](https://img.shields.io/badge/%40emotion%2Fstyled-%5E11.10.5-red?style=flat-square)](https://npmjs.com/package/@emotion/styled/v/11.10.5)
        -   [![framer-motion](https://img.shields.io/badge/framer--motion-%5E8.0.2-red?style=flat-square)](https://npmjs.com/package/framer-motion/v/8.0.2)
    -   React
        -   [![@babel/core](https://img.shields.io/badge/%40babel%2Fcore-%5E7.20.7-red?style=flat-square)](https://npmjs.com/package/@babel/core/v/7.20.7)
        -   [![react](https://img.shields.io/badge/react-%5E18.2.0-red?style=flat-square)](https://npmjs.com/package/react/v/18.2.0)
        -   [![react-dom](https://img.shields.io/badge/react--dom-%5E18.2.0-red?style=flat-square)](https://npmjs.com/package/react-dom/v/18.2.0)
        -   [![react-router-dom](https://img.shields.io/badge/react--router--dom-%5E6.6.1-red?style=flat-square)](https://npmjs.com/package/react-router-dom/v/6.6.1)
    -   Redux
        -   [![@reduxjs/toolkit](https://img.shields.io/badge/%40reduxjs%2Ftoolkit-%5E1.9.1-red?style=flat-square)](https://npmjs.com/package/@reduxjs/toolkit/v/1.9.1)
        -   [![immer](https://img.shields.io/badge/immer-%5E9.0.16-red?style=flat-square)](https://npmjs.com/package/immer/v/9.0.16)
        -   [![react-redux](https://img.shields.io/badge/react--redux-%5E8.0.5-red?style=flat-square)](https://npmjs.com/package/react-redux/v/8.0.5)
        -   [![use-immer](https://img.shields.io/badge/use--immer-%5E0.8.1-red?style=flat-square)](https://npmjs.com/package/use-immer/v/0.8.1)
    -   Vite
        -   [![@vitejs/plugin-react](https://img.shields.io/badge/%40vitejs%2Fplugin--react-%5E3.0.0-red?style=flat-square)](https://npmjs.com/package/@vitejs/plugin-react/v/3.0.0)
        -   [![vite](https://img.shields.io/badge/vite-%5E4.0.3-red?style=flat-square)](https://npmjs.com/package/vite/v/4.0.3)
    -   Miscellaneous
        -   [![axios](https://img.shields.io/badge/axios-%5E1.2.1-red?style=flat-square)](https://npmjs.com/package/axios/v/1.2.1)
        -   [![chart.js](https://img.shields.io/badge/chart.js-%5E4.1.1-red?style=flat-square)](https://npmjs.com/package/chart.js/v/4.1.1)
        -   [![cypress](https://img.shields.io/badge/cypress-%5E12.4.0-red?style=flat-square)](https://npmjs.com/package/cypress/v/12.4.0)
        -   [![formik](https://img.shields.io/badge/formik-%5E2.2.9-red?style=flat-square)](https://npmjs.com/package/formik/v/2.2.9)
        -   [![luxon](https://img.shields.io/badge/luxon-%5E3.1.1-red?style=flat-square)](https://npmjs.com/package/luxon/v/3.1.1)
        -   [![react-chartjs-2](https://img.shields.io/badge/react--chartjs--2-%5E5.1.0-red?style=flat-square)](https://npmjs.com/package/react-chartjs-2/v/5.1.0)
        -   [![react-colorful](https://img.shields.io/badge/react--colorful-%5E5.6.1-red?style=flat-square)](https://npmjs.com/package/react-colorful/v/5.6.1)
        -   [![react-icons](https://img.shields.io/badge/react--icons-%5E4.7.1-red?style=flat-square)](https://npmjs.com/package/react-icons/v/4.7.1)
        -   [![react-select](https://img.shields.io/badge/react--select-%5E5.7.0-red?style=flat-square)](https://npmjs.com/package/react-select/v/5.7.0)
        -   [![zod](https://img.shields.io/badge/zod-%5E3.20.2-red?style=flat-square)](https://npmjs.com/package/zod/v/3.20.2)
-   Laravel
    -   Authentication
        -   [![tymon/jwt-auth](https://img.shields.io/badge/tymon%2Fjwt--auth-*-red?style=flat-square)](https://packagist.org/packages/tymon/jwt-auth)
