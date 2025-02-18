import {
  createBot,
  Intents,
  startBot,
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
      console.log(Secret.GUILD_ID);
    },
  },
});

const nekoCommand: CreateSlashApplicationCommand = {
  name: "neko",
  description: "にゃーんと返します",
};

const kusaCommand: CreateSlashApplicationCommand = {
  name: "kusa",
  description: "現在のcontribution数を表示します",
};

await bot.helpers.upsertGuildApplicationCommands(Secret.GUILD_ID, [
  nekoCommand,
  kusaCommand,
]);

bot.events.interactionCreate = async (b, interaction) => {
  console.log("Received interaction:", interaction.data?.name);

  switch (interaction.data?.name) {
    case "neko": {
      b.helpers.sendInteractionResponse(interaction.id, interaction.token, {
        type: InteractionResponseTypes.ChannelMessageWithSource,
        data: {
          content: "にゃーん！！",
        },
      });
      break;
    }
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

Deno.cron("Continuous Request", "*/2 * * * *", () => {
  console.log("running...");
});
