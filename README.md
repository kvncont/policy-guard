# tpl-gh-app

This repository contains a template for creating a GitHub App using Probot.

## Prerequisites

- [Node.js](https://nodejs.org/) v14 or higher
- [npm](https://www.npmjs.com/) v6 or higher
- [GitHub CLI](https://cli.github.com/)

## Getting Started

### Create a new Probot app:

```bash
npx create-probot-app my-probot-app
cd my-probot-app
```

This will ask you a series of questions about your app, which should look something like this:

```txt
Let's create a Probot app!
? App name: my-first-app
? Description of app: A 'Hello World' GitHub App built with Probot.
? Author's full name: Katie Horne
? Author's email address: katie@auth0.com
? GitHub user or org name: khorne3
? Repository name: my-first-app
? Which template would you like to use? (Use arrow keys)
❯ basic-js
  basic-ts (use this one for TypeScript support)
  checks-js
  git-data-js
  deploy-js

Finished scaffolding files!

Installing dependencies. This may take a few minutes...

Successfully created my-first-app.

Begin using your app with:
  cd my-first-app
  npm start

View your app's README for more usage instructions.

Visit the Probot docs:
  https://probot.github.io/docs/

Get help from the community:
  https://probot.github.io/community/

Enjoy building your Probot app!
```

The most important files created are index.js, which is where the code for your app will go, and package.json, which makes the app a standard npm module.

### Running the app locally

Now you're ready to run the app on your local machine. Run `npm start` to start the server:

> Note: If you're building a TypeScript app, be sure to run `npm run build` first!

```bash
> testerino@1.0.0 dev /Users/hiimbex/Desktop/testerino
> nodemon

[nodemon] 1.18.4
[nodemon] to restart at any time, enter `rs`
[nodemon] watching: .env *.*
[nodemon] starting `npm start`

> testerino@1.0.0 start /Users/hiimbex/Desktop/testerino
> my-first-app@1.0.0 start /private/var/folders/hs/x9qtfmvn1lz1sgml9q21h7k80000gn/T/tmp.bgzYr6j1/my-first-app
> probot run ./index.js

INFO     (probot):
INFO     (probot): Welcome to Probot!
INFO     (probot): Probot is in setup mode, webhooks cannot be received and
INFO     (probot): custom routes will not work until APP_ID and PRIVATE_KEY
INFO     (probot): are configured in .env.
INFO     (probot): Please follow the instructions at http://localhost:3000 to configure .env.
INFO     (probot): Once you are done, restart the server.
INFO     (probot):
INFO     (server): Running Probot v11.0.5 (Node.js: v15.5.1)
INFO     (server): Listening on http://localhost:3000
```

### Configuring a GitHub App

To automatically configure your GitHub App, follow these steps:

1. Run the app locally by running `npm start` in your terminal.
1. Next follow instructions to visit http://localhost:3000 (or your custom Glitch URL).
1. You should see something like this: Screenshot of Probot's setup wizard
1. Go ahead and click the Register a GitHub App button.
1. Next, you'll get to decide on an app name that isn't already taken. Note: if you see a message "Name is already in use" although no such app exists, it means that a GitHub organization with that name exists and cannot be used as an app name.
1. After registering your GitHub App, you'll be redirected to install the app on any repositories. At the same time, you can check your local .env and notice it will be populated with values GitHub sends us in the course of that redirect.
1. Restart the server in your terminal (press ctrl + c to stop the server)
1. Install the app on a test repository.
1. Try triggering a webhook to activate the bot!
1. You're all set! Head down to Debugging to learn more about developing your Probot App.

## Contributing

If you would like to contribute, please fork the repository and use a feature branch. Pull requests are warmly welcome.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.