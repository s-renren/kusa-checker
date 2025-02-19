import { dayjs, graphql } from "../deps.ts";
import { Secret } from "../envValues.ts";

type Contributions = {
  user: {
    contributionsCollection: {
      contributionCalendar: {
        weeks: {
          contributionDays: {
            date: string;
            contributionCount: number;
          }[];
        }[];
      };
    };
  };
};

const getContributions = async () => {
  const userName = "s-renren";

  const now = dayjs().format("YYYY-MM-DDTHH:mm:ss");
  const query = `
    query contributions ($userName:String!, $now:DateTime!) {
      user(login: $userName) {
        contributionsCollection(from: $now, to: $now) {
          contributionCalendar {
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
        }
      }
    }
  `;

  const contributions = await graphql<Contributions>(query, {
    userName,
    now,
    headers: {
      authorization: `Bearer ${Secret.GITHUB_ACCESS_TOKEN}`,
    },
  });

  const dailyContributions: number[] = [];
  contributions.user.contributionsCollection.contributionCalendar.weeks.forEach(
    (week) => {
      week.contributionDays.forEach((day) => {
        dailyContributions.push(day.contributionCount);
      });
    }
  );

  return dailyContributions;
};

export default getContributions;
