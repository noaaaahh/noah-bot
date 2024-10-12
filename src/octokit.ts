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

// --

// import { Octokit, RestEndpointMethodTypes } from "@octokit/rest";

// export class OctokitService {
//   private readonly octokit: Octokit;
//   private readonly owner: string;
//   private readonly repo: string;

//   constructor(owner: string, repo: string) {
//     this.octokit = new Octokit({ auth: process.env.GITHUB_TOKEN || "" });
//     this.owner = owner;
//     this.repo = repo;
//   }

//   async getPullRequests({
//     state = "open",
//     owner = this.owner,
//     repo = this.repo,
//     ...params
//   }: RestEndpointMethodTypes["pulls"]["list"]["parameters"]) {
//     return this.octokit.rest.pulls.list({ owner, repo, state, ...params });
//   }

//   async getPullRequest(pullNumber: number) {
//     return this.octokit.pulls.get({
//       owner: this.owner,
//       repo: this.repo,
//       pull_number: pullNumber,
//     });
//   }
// }
