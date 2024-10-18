import { Octokit, RestEndpointMethodTypes } from "@octokit/rest";
import { configDotenv } from "dotenv";

configDotenv();

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN || "" });
const githubOwner = process.env.GITHUB_OWNER || "";
const githubRepo = process.env.GITHUB_REPO || "";

export async function getPullRequests({
  state = "open",
  owner = githubOwner,
  repo = githubRepo,
  ...params
}: RestEndpointMethodTypes["pulls"]["list"]["parameters"]) {
  return octokit.rest.pulls.list({ state, owner, repo, ...params });
}

export async function getPullRequest(
  pullNumber: number,
  owner = githubOwner,
  repo = githubRepo
) {
  return octokit.pulls.get({ owner, repo, pull_number: pullNumber });
}
