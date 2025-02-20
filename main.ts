import { deprivationRole, grantRole } from "./coding.ts";
import {
  createBot,
  Intents,
  startBot,
  sendMessage,
  CreateSlashApplicationCommand,
  InteractionResponseTypes,
} from "./deps.ts";
import { Secret } from "./envValues.ts";
import kusa from "./kusa.ts";

const bot = createBot({
  token: Secret.DISCORD_TOKEN,
  intents: Intents.Guilds | Intents.GuildMessages | Intents.MessageContent,
  events: {
    ready: (_bot, payload) => {
      console.log(`${payload.user.username} is ready!`);
    },
  },
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

const sendMessages = async (message: string) => {
  await sendMessage(bot, Secret.CHANNEL_ID, {
    content: message,
  });
};

const isTime = async (hour: number, minute: number): Promise<void> => {
  if (hour === 9) {
    if (minute === 0) {
      sendMessages("おはようございます！今日もコーディング頑張りましょう！");
    }
  } else if (hour === 12 || hour === 15 || hour === 21) {
    const kusaCount = await kusa();
    if (minute === 0) {
      if (kusaCount === "No contributions") {
        await sendMessages(
          "おや？今日の草が生えていないようですね..." +
            "\n" +
            "1 commitでもいいので頑張りましょう!"
        );
      }
    }
  }
};

Deno.cron("Continuous Request", "*/3 * * * *", async () => {
  const now = new Date();
  const res = now.toTimeString().split(" ")[0];
  const [hour, minute, _] = res.split(":").map(Number);

  await isTime(hour + 9, minute);
  console.log("running... now ->", hour + 9, ":", minute);
});
