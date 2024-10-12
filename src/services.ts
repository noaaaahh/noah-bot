import { RestEndpointMethodTypes } from "@octokit/rest";
import * as OctokitService from "./octokit";
import dayjs from "dayjs";

export async function getPullRequests() {
  const pullRequests = await OctokitService.getPullRequests({
    owner: "goorm-dev",
    repo: "gds",
  });

  return pullRequests;
}

export async function getProcessedPulls(
  pulls: RestEndpointMethodTypes["pulls"]["list"]["response"]
) {
  const mergeable = [];
  const notMergeable = [];

  for (const pull of pulls.data) {
    if (pull.draft) continue;

    const { isMergeable, ...pullRequest } = await getPullRequestDetail(pull);

    if (isMergeable) mergeable.push(pullRequest);
    else notMergeable.push(pullRequest);
  }

  return { mergeable, notMergeable };
}

export async function getPullRequestDetail(
  pullRequest: RestEndpointMethodTypes["pulls"]["list"]["response"]["data"][0]
) {
  const title = pullRequest.title;
  const pullNumber = pullRequest.number;
  const linkUrl = pullRequest.html_url;

  const { data: pullDetail } = await OctokitService.getPullRequest(pullNumber);

  const isMergeable = checkMergeable(pullDetail);
  const dDay = checkDueDate(pullDetail.created_at);

  return { title, pullNumber, linkUrl, isMergeable, dDay };
}

export function checkMergeable(
  pullRequest: RestEndpointMethodTypes["pulls"]["get"]["response"]["data"]
) {
  const isMergeable = pullRequest.mergeable || false;
  const mergeState = pullRequest.mergeable_state;

  return isMergeable && mergeState !== "blocked" && mergeState !== "unstable";
}

export function checkDueDate(date: string) {
  const today = dayjs();
  const createdAt = dayjs(date);

  return createdAt.diff(today, "days");
}

// --

// import { RestEndpointMethodTypes } from "@octokit/rest";
// import { OctokitService } from "./octokit.service";
// import dayjs from "dayjs";

// export class AppService {
//   private readonly octokitService: OctokitService;

//   constructor(octokitService: OctokitService) {
//     this.octokitService = octokitService;
//   }

//   async getPullRequests() {
//     const pullRequests = await this.octokitService.getPullRequests({
//       owner: "goorm-dev",
//       repo: "gds",
//     });

//     return pullRequests;
//   }

//   async getProcessedPulls(
//     pulls: RestEndpointMethodTypes["pulls"]["list"]["response"]
//   ) {
//     const mergeable = [];
//     const notMergeable = [];

//     for (const pull of pulls.data) {
//       if (pull.draft) continue;

//       const { isMergeable, ...pullRequest } = await this.getPullRequestDetail(
//         pull
//       );

//       if (isMergeable) mergeable.push(pullRequest);
//       else notMergeable.push(pullRequest);
//     }

//     return { mergeable, notMergeable };
//   }

//   async getPullRequestDetail(
//     pullRequest: RestEndpointMethodTypes["pulls"]["list"]["response"]["data"][0]
//   ) {
//     const title = pullRequest.title;
//     const pullNumber = pullRequest.number;
//     const linkUrl = pullRequest.html_url;

//     const { data: pullDetail } = await this.octokitService.getPullRequest(
//       pullNumber
//     );

//     const isMergeable = this.checkMergeable(pullDetail);
//     const dDay = this.checkDueDate(pullDetail.created_at);

//     return { title, pullNumber, linkUrl, isMergeable, dDay };
//   }

//   checkMergeable(
//     pullRequest: RestEndpointMethodTypes["pulls"]["get"]["response"]["data"]
//   ) {
//     const isMergeable = pullRequest.mergeable || false;
//     const mergeState = pullRequest.mergeable_state;

//     return isMergeable && mergeState !== "blocked" && mergeState !== "unstable";
//   }

//   checkDueDate(date: string) {
//     const today = dayjs();
//     const createdAt = dayjs(date);

//     return createdAt.diff(today, "days");
//   }
// }
