type TPullRequest = {
  title: string;
  pullNumber: number;
  linkUrl: string;
  dDay: number;
};

export function createAttachment(
  pretext: string,
  color: string,
  pulls: TPullRequest[]
) {
  return {
    mrkdwn_in: ["text", "pretext"] as ("text" | "pretext" | "fields")[],
    pretext,
    color,
    fields: pulls.map((pull) => ({
      title: "",
      value: `<${pull.linkUrl}|${pull.dDay === 0 ? "🚨 " : ""}[D-${
        pull.dDay
      }] [#${pull.pullNumber}] ${pull.title}>`,
    })),
  };
}

export function generateAttachments(pullRequests: TPullRequest[]) {
  if (!pullRequests || !pullRequests.length) return [];

  const timeCategorizedPulls = pullRequests.reduce<{
    imminent: Array<TPullRequest>; // 시간이 촉박한 경우
    approaching: Array<TPullRequest>; // 다가오는 경우
    safe: Array<TPullRequest>; // 여유로운 경우
  }>(
    (accumulator, currentPull) => {
      const updatedPull = { ...currentPull, dDay: currentPull.dDay + 5 };

      if (updatedPull.dDay >= 4) {
        accumulator.safe.push(updatedPull);
      } else if (updatedPull.dDay >= 2) {
        accumulator.approaching.push(updatedPull);
      } else {
        accumulator.imminent.push({
          ...updatedPull,
          dDay: Math.max(updatedPull.dDay, 0),
        });
      }

      return accumulator;
    },
    { imminent: [], approaching: [], safe: [] }
  );

  return [
    timeCategorizedPulls.imminent.length
      ? createAttachment(
          "💚📝코드리뷰가🌱세상을🌏지배👊한다📝💚",
          "#D91C29",
          timeCategorizedPulls.imminent
        )
      : null,
    timeCategorizedPulls.approaching.length
      ? createAttachment("", "#FFC107", timeCategorizedPulls.approaching)
      : null,
    timeCategorizedPulls.safe.length
      ? createAttachment("", "#04A37E", timeCategorizedPulls.safe)
      : null,
  ].filter((el) => el !== null); // null 값 제거
}

export function createApprovedPulls(pulls: TPullRequest[]) {
  return {
    mrkdwn_in: ["text", "fields"] as ("text" | "pretext" | "fields")[],
    pretext: `:me::me::me::me: ${pulls.length}개의 PR이 머지를 기다리고 있어요! :me::me::me::me:`,
    fields: pulls.map((pull) => ({
      title: "",
      value: `<${pull.linkUrl}|[#${pull.pullNumber}] ${pull.title}>`,
    })),
  };
}

// --

// type TPullRequest = {
//   title: string;
//   pullNumber: number;
//   linkUrl: string;
//   dDay: number;
// };

// export class BoltService {
//   constructor() {}

//   createAttachment(pretext: string, color: string, pulls: TPullRequest[]) {
//     return {
//       mrkdwn_in: ["text", "pretext"] as ("text" | "pretext" | "fields")[],
//       pretext,
//       color,
//       fields: pulls.map((pull) => ({
//         title: "",
//         value: `<${pull.linkUrl}|${pull.dDay === 0 ? "🚨 " : ""}[D-${
//           pull.dDay
//         }] [#${pull.pullNumber}] ${pull.title}>`,
//       })),
//     };
//   }

//   generateAttachments(pullRequests: TPullRequest[]) {
//     if (!pullRequests || !pullRequests.length) return [];

//     const timeCategorizedPulls = pullRequests.reduce<{
//       imminent: Array<TPullRequest>; // 시간이 촉박한 경우
//       approaching: Array<TPullRequest>; // 다가오는 경우
//       safe: Array<TPullRequest>; // 여유로운 경우
//     }>(
//       (accumulator, currentPull) => {
//         const updatedPull = { ...currentPull, dDay: currentPull.dDay + 5 };

//         if (updatedPull.dDay >= 4) {
//           accumulator.safe.push(updatedPull);
//         } else if (updatedPull.dDay >= 2) {
//           accumulator.approaching.push(updatedPull);
//         } else {
//           accumulator.imminent.push({
//             ...updatedPull,
//             dDay: Math.max(updatedPull.dDay, 0),
//           });
//         }

//         return accumulator;
//       },
//       { imminent: [], approaching: [], safe: [] }
//     );

//     return [
//       timeCategorizedPulls.imminent.length
//         ? this.createAttachment(
//             "💚📝코드리뷰가🌱세상을🌏지배👊한다📝💚",
//             "#D91C29",
//             timeCategorizedPulls.imminent
//           )
//         : null,
//       timeCategorizedPulls.approaching.length
//         ? this.createAttachment("", "#FFC107", timeCategorizedPulls.approaching)
//         : null,
//       timeCategorizedPulls.safe.length
//         ? this.createAttachment("", "#04A37E", timeCategorizedPulls.safe)
//         : null,
//     ].filter((el) => el !== null); // null 값 제거
//   }

//   createApprovedPulls(pulls: TPullRequest[]) {
//     return {
//       mrkdwn_in: ["text", "fields"] as ("text" | "pretext" | "fields")[],
//       pretext: `:me::me::me::me: ${pulls.length}개의 PR이 머지를 기다리고 있어요! :me::me::me::me:`,
//       fields: pulls.map((pull) => ({
//         title: "",
//         value: `<${pull.linkUrl}|[#${pull.pullNumber}] ${pull.title}>`,
//       })),
//     };
//   }
// }
