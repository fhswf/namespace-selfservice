import { Octokit } from "@octokit/rest";
const { v4: uuidv4 } = require("uuid");

export function isValidNamespace(name) {
	return (
		/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(name) &&
		name.length <= 63 &&
		name.length >= 1
	);
}

export async function getFileContentFromGitHub() {
	const OCTOKIT = new Octokit({ auth: process.env.GITHUB_TOKEN });
	const { data } = await OCTOKIT.repos.getContent({
		owner: process.env.GITHUB_REPO_OWNER,
		repo: process.env.GITHUB_REPO_NAME,
		path: process.env.GITHUB_FILE_PATH,
		ref: process.env.GITHUB_REPO_BRANCH ?? "main",
	});
	return {
		content: Buffer.from(data.content, "base64").toString("utf-8"),
		sha: data.sha,
	};
}

export async function updateFileContentOnGitHub(data, sha) {
	const OCTOKIT = new Octokit({ auth: process.env.GITHUB_TOKEN });
	return await OCTOKIT.repos.createOrUpdateFileContents({
		owner: process.env.GITHUB_REPO_OWNER,
		repo: process.env.GITHUB_REPO_NAME,
		path: process.env.GITHUB_FILE_PATH,
		branch: process.env.GITHUB_REPO_BRANCH ?? "main",
		message: "kf-registration: add new profile",
		committer: {
			name: "SelfService",
			email: "selfservice@users.noreply.github.com",
		},
		content: Buffer.from(data).toString("base64"),
		sha: sha,
	});
}

export function namespaceExists(data, namespace) {
	return data.deploykf_core.deploykf_profiles_generator.profiles.some(
		(profile) => profile.name === namespace
	);
}

export function userExists(data, email) {
	return data.deploykf_core.deploykf_profiles_generator.users.some(
		(user) => user.email === email
	);
}

export function createUser(data, email, namespace) {
	const USER_ID = uuidv4();
	const NEW_USER = { id: USER_ID, email };
	data.deploykf_core.deploykf_profiles_generator.users.push(NEW_USER);
	data.deploykf_core.deploykf_profiles_generator.profiles.push({
		name: namespace,
		members: [{ user: USER_ID }],
	});
	return data;
}
