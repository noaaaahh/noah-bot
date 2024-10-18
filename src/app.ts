import { configDotenv } from "dotenv";

import * as AppService from "./services";
import * as BoltService from "./bolt";
import axios from "axios";

configDotenv();

async function alarm() {
  const pullRequests = await AppService.getPullRequests();
  const { mergeable, notMergeable } = await AppService.getProcessedPulls(
    pullRequests
  );

  await axios.create().post(process.env.SLACK_WEB_HOOK_URL || "", {
    attachments: [
      BoltService.createApprovedPulls(mergeable),

      ...BoltService.generateAttachments(notMergeable),
    ],
  });
}

alarm();
