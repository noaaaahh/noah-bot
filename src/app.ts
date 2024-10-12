import Bolt from "@slack/bolt";
import { configDotenv } from "dotenv";

import * as AppService from "./services";
import * as BoltService from "./bolt";

configDotenv();

const port: string = process.env.PORT || "3000";

// 모듈 선언
const boltApp: Bolt.App = new Bolt.App({
  logLevel: Bolt.LogLevel.DEBUG,
  socketMode: true,
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SECRET,
  appToken: process.env.SLACK_APP_TOKEN,
});

// 커맨드 정의
async function alarm() {
  const pullRequests = await AppService.getPullRequests();
  const { mergeable, notMergeable } = await AppService.getProcessedPulls(
    pullRequests
  );

  await boltApp.client.chat.postMessage({
    channel: process.env.GDS_CHANNEL || "",
    attachments: [
      BoltService.createApprovedPulls(mergeable),
      {
        mrkdwn_in: ["text", "fields"] as ("text" | "pretext" | "fields")[],
        pretext: `\n\n`,
      },
      ...BoltService.generateAttachments(notMergeable),
    ],
  });
}

async function startServer() {
  await boltApp.start(port);

  console.log("⚡️ Bolt app is running!");

  await alarm();

  boltApp.stop();
}

startServer();

// --

// import { App, LogLevel } from "@slack/bolt";
// import { configDotenv } from "dotenv";

// import { OctokitService } from "./octokit.service";
// import { AppService } from "./app.service";
// import { BoltService } from "./bolt.service";

// class AppController {
//   private readonly port: string = process.env.PORT || "3000";
//   private readonly boltApp: App;
//   private readonly octokitService: OctokitService;
//   private readonly appService: AppService;
//   private readonly boltServce: BoltService;

//   constructor() {
//     configDotenv();

//     this.octokitService = new OctokitService("goorm-dev", "gds");
//     this.appService = new AppService(this.octokitService);
//     this.boltServce = new BoltService();
//     this.boltApp = new App({
//       logLevel: LogLevel.DEBUG,
//       socketMode: true,
//       token: process.env.SLACK_BOT_TOKEN,
//       signingSecret: process.env.SLACK_SECRET,
//       appToken: process.env.SLACK_APP_TOKEN,
//     });

//     this.command();
//   }

//   async startServer() {
//     await this.boltApp.start(this.port);

//     console.log("⚡️ Bolt app is running!");
//   }

//   command() {
//     this.boltApp.command("/review", async ({ ack }) => {
//       try {
//         await ack();
//         const pullRequests = await this.appService.getPullRequests();
//         const { mergeable, notMergeable } =
//           await this.appService.getProcessedPulls(pullRequests);

//         await this.boltApp.client.chat.postMessage({
//           channel: "D07QKS0M3FV",
//           attachments: [
//             this.boltServce.createApprovedPulls(mergeable),
//             {
//               mrkdwn_in: ["text", "fields"] as (
//                 | "text"
//                 | "pretext"
//                 | "fields"
//               )[],
//               pretext: `\n\n`,
//             },
//             ...this.boltServce.generateAttachments(notMergeable),
//           ],
//         });
//       } catch (error) {
//         console.error("에러 발생:", error);
//       }
//     });
//   }
// }

// const controller = new AppController();
// controller.startServer();
