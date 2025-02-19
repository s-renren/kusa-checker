import {
  createBot,
  Intents,
  startBot,
  sendMessage,
  CreateSlashApplicationCommand,
  InteractionResponseTypes,
  serve,
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

await bot.helpers.upsertGuildApplicationCommands(Secret.GUILD_ID, [
  kusaCommand,
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

const checkTime = async () => {
  const now = new Date();
  const res = now.toTimeString().split(" ")[0];
  const [hour, minute, _] = res.split(":").map(Number);

  const isTime = async () => {
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

  await isTime();
};

serve(async (_req) => {
  await checkTime();
  return new Response("Executed", { status: 200 });
});
