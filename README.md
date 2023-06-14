# backup-github

Open-source GitHub mass-repo backup tool.

This tool will create cross-platform terminal commands for cloning all of a user's repositories.

**If your code is only on the cloud, you have no control over its destiny.**

`backup-github` gives you the tools you need to set up your own backup/download events, ensuring that you have access to your code, no matter what.

## Installation

Install by running:

```terminal
npm install -g backup-github
```

or:

```terminal
npm install -g https://github.com/NotTimTam/backup-github.git
```

## Usage

Import `backup-github` into your Node.js script:

```js
const BGH = require("backup-github");
```

Generate your backup commands using:

```js
const logBackupCommand = async () => {
	// An array of specific repositories from any Git platform can be provided, or you can use this function to auto-generate a list of all of a user's repositories:
	const repos = await BGH.getRepos(
		"YOUR_USERNAME",
		"YOUR_ACCESS_TOKEN" // Optional. Provides access to private repos.
	);

	// Log the created commands:
	console.log(await BGH.createBackupCommands(repos));
};
logBackupCommand();
```

To access your private repositories, you'll need to provide your [GitHub access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens).

After you generate your command string, you can use [Node.js's `exec()` function](https://nodejs.org/api/child_process.html#child_processexeccommand-options-callback), or manually copy-paste the commands into your terminal.
