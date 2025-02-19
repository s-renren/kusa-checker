import { dotenv } from "./deps.ts";

dotenv.configSync({
  export: true,
  path: "./.env.local",
});

export const Secret = {
  DISCORD_TOKEN: Deno.env.get("DISCORD_TOKEN")!,
  GITHUB_ACCESS_TOKEN: Deno.env.get("GITHUB_ACCESS_TOKEN")!,
  GUILD_ID: Deno.env.get("GUILD_ID")!,
  CHANNEL_ID: Deno.env.get("CHANNEL_ID")!,
};
