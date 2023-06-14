const axios = require("axios");

class ZipHub {
	/**
	 * Get a list of a user's repositories.
	 * @param {string} user The **case-sensitive** user's username.
	 * @param {string} token An *optional* GitHub access token, if you want to access your private repositories.
	 * @returns {Array<*>} A list of repository info objects.
	 */
	static getRepos = async (user, token) => {
		try {
			let page = 1;
			let repos = [];
			let hasNextPage = true;

			while (hasNextPage) {
				const res = await axios.get(
					`https://api.github.com/search/repositories?q=user:${user}`,
					{
						headers: {
							Authorization: token ? `token ${token}` : null,
							Accept: "application/vnd.github.v3+json",
						},
						params: {
							per_page: 100,
							page: page,
						},
					}
				);

				repos.push(...res.data.items);

				const linkHeader = res.headers.link;
				if (linkHeader && linkHeader.includes('rel="next"')) {
					page++;
				} else {
					hasNextPage = false;
				}
			}

			return repos.map(({ html_url }) => html_url);
		} catch (err) {
			console.error(
				"Failed to load repositories:",
				`${
					err.isAxiosError && err.response
						? err.response.data.message
						: err
				}.`
			);
		}
	};

	/**
	 * Create a bash file
	 * @param {Array<string>} repos An array of repository urls to clone. Use `ZipHub.getRepos()` to quickly generate an array.
	 * @param {string} dir **optional** output directory. Defaults to `./github-backup-YYYY-MM-DDTHH-MM-SS-MMM`
	 * @returns {string} A backup for the user to run in the output directory of their choice.
	 */
	static createBackupCommands = async (repos, dir) => {
		try {
			if (!repos) throw "No repository array provided.";

			// List of commands.
			const date = new Date();
			const dirName =
				dir ||
				`./github-backup-${date.getFullYear()}-${date.getMonth()}-${date.getDate()}T${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}-${date.getMilliseconds()}`;

			const clones = repos.map((url) => `git clone ${url}`).join("\n");

			// Command to run.
			return `
mkdir ${dirName}
cd ${dirName}
${clones}
`;
		} catch (err) {
			console.error(`Failed to create backup commands:`, err);
		}
	};
}

module.exports = ZipHub;
