/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 */
export default (app) => {
  app.log.info("Yay, the app was loaded!");

  app.on("repository.created", async (context) => {
    try {
      const { organization, repository } = context.payload;
      const org = organization.login;
      const owner = repository.owner.login;
      const repoName = repository.name;
      const customProperties = repository.custom_properties;

      context.log.info(`Repository ${repoName} created`);

      const { content, teamSlug, pushCodeowners } = setupRepo(customProperties);
      
      if (teamSlug !== "Unmanaged") {
        await grantTeamPermissions(context, org, teamSlug, owner, repoName);
      }

      if (pushCodeowners) {
        await createOrUpdateCodeownersFile(context, owner, repoName, content);
      }
    } catch (error) {
      context.log.error(`Error processing repository.created event: ${error.message}`);
    }
  });
};

/**
 * Set the team and content for the CODEOWNERS file based on custom properties
 * @param {Object} customProperties
 * @returns {Object} An object containing the content, teamSlug, and pushCodeowners flag
 */
function setupRepo(customProperties) {
  let content;
  let teamSlug = "Unmanaged";
  let pushCodeowners = true;

  switch (customProperties.ownership) {
    case "Dev":
      teamSlug = "dev";
      content = Buffer.from("* @kvncont\n/.github/ @kokodoki/dev\n").toString("base64");
      break;
    case "Ops":
      teamSlug = "ops";
      content = Buffer.from("/* @kokodoki/ops\n").toString("base64");
      break;
    default:
      pushCodeowners = false;
      break;
  }

  return { content, teamSlug, pushCodeowners };
}

/**
 * Create or update the CODEOWNERS file in the repository
 * @param {Object} context
 * @param {string} owner
 * @param {string} repo
 * @param {string} content
 */
async function createOrUpdateCodeownersFile(context, owner, repo, content) {
  let sha;
  try {
    const { data: existingFile } = await context.octokit.repos.getContent({
      owner,
      repo,
      path: ".github/CODEOWNERS",
    });
    sha = existingFile.sha;
    context.log.info(`Existing CODEOWNERS file found with sha: ${sha}`);
  } catch (error) {
    if (error.status !== 404) {
      context.log.error(`Error fetching existing CODEOWNERS file: ${error.message}`);
      throw error;
    }
    context.log.info("No existing CODEOWNERS file found, creating a new one.");
  }

  const codeowners = await context.octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path: ".github/CODEOWNERS",
    message: "chore: add CODEOWNERS file",
    content,
    sha,
  });

  context.log.info(`CODEOWNERS file created in ${repo}`);

  return codeowners;
}

/**
 * Grant write permissions to a team for the repository
 * @param {Object} context
 * @param {string} org
 * @param {string} teamSlug
 * @param {string} owner
 * @param {string} repo
 */
async function grantTeamPermissions(context, org, teamSlug, owner, repo) {
  try {
    await context.octokit.teams.addOrUpdateRepoPermissionsInOrg({
      org,
      team_slug: teamSlug,
      owner,
      repo,
      permission: "push",
    });
    context.log.info(`Write permissions granted to team ${teamSlug} for repository ${repo}`);
  } catch (error) {
    context.log.error(`Error granting permissions to team ${teamSlug}: ${error.message}`);
    throw error;
  }
}
