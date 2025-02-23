import { deprivationRole, grantRole } from "./feature/coding.ts";
import {
  createBot,
  Intents,
  startBot,
  CreateSlashApplicationCommand,
  InteractionResponseTypes,
} from "./deps.ts";
import { Secret } from "./envValues.ts";
import { isTime } from "./feature/isTime.ts";
import kusa from "./feature/kusa.ts";

export const bot = createBot({
  token: Secret.DISCORD_TOKEN,
  intents: Intents.Guilds | Intents.GuildMessages | Intents.MessageContent,
  events: {
    ready: (_bot, payload) => {
      console.log(`${payload.user.username} is ready!`);
    },
  },
});

const formatter = new Intl.DateTimeFormat("ja-JP", {
  timeZone: "Asia/Tokyo",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

const kusaCommand: CreateSlashApplicationCommand = {
  name: "kusa",
  description: "現在のcontribution数を表示します",
};

const grantRoleCoding: CreateSlashApplicationCommand = {
  name: "coding",
  description: "コーディング中に通知を来ないようにします",
};

await bot.helpers.upsertGuildApplicationCommands(Secret.GUILD_ID, [
  kusaCommand,
  grantRoleCoding,
]);

bot.events.interactionCreate = async (b, interaction) => {
  console.log("Received interaction:", interaction.data?.name);

  switch (interaction.data?.name) {
    case "kusa": {
      const res: string = await kusa();
      b.helpers.sendInteractionResponse(interaction.id, interaction.token, {
        type: InteractionResponseTypes.ChannelMessageWithSource,
        data: {
          content: res,
        },
      });
      break;
    }
    case "coding": {
      try {
        const member = await b.helpers.getMember(
          Secret.GUILD_ID,
          interaction.user.id
        );
        const hasRole = member.roles.includes(BigInt(Secret.ROLE_ID));

        if (hasRole) {
          await deprivationRole(b, interaction);
        } else {
          await grantRole(b, interaction);
        }
      } catch (e) {
        console.log("Failed to add role:", e);
        await b.helpers.sendInteractionResponse(
          interaction.id,
          interaction.token,
          {
            type: InteractionResponseTypes.ChannelMessageWithSource,
            data: {
              content: "ロールの付与に失敗しました。",
            },
          }
        );
      }

      break;
    }
    default:
      console.log("Unknown command:", interaction.data?.name);
  }
};

await startBot(bot);

Deno.cron("Continuous Request", "*/3 * * * *", async () => {
  const nowJST = formatter.formatToParts(new Date());
  const hour = Number(nowJST.find((part) => part.type === "hour")?.value);
  const minute = Number(nowJST.find((part) => part.type === "minute")?.value);

  if (hour === 0 && minute === 0) {
    try {
      await bot.helpers.removeRole(
        Secret.GUILD_ID,
        Secret.USER_ID,
        Secret.ROLE_ID
      );
    } catch (e) {
      console.log("error:", e);
    }
  }

  await isTime(hour, minute);
  console.log("running... now ->", hour, ":", minute);
});
