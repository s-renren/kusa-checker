import { sendMessage } from "../deps.ts";
import { Secret } from "../envValues.ts";
import kusa from "./kusa.ts";
import { bot } from "../main.ts";

const sendMessages = async (message: string) => {
  await sendMessage(bot, Secret.CHANNEL_ID, {
    content: message,
  });
};

export const isTime = async (hour: number, minute: number): Promise<void> => {
  let isReady: boolean = true;
  if (minute === 0) {
    const member = await bot.helpers.getMember(Secret.GUILD_ID, Secret.USER_ID);
    const hasRole = member.roles.includes(BigInt(Secret.ROLE_ID));
    if (hasRole) {
      isReady = false;
    }
  }
  if (hour === 9 && minute === 0) {
    sendMessages("おはようございます！今日もコーディング頑張りましょう！");
    console.log("Send message");
  } else if (
    minute === 0 &&
    (hour === 11 || hour === 13 || hour === 15 || hour === 21) &&
    isReady
  ) {
    const kusaCount = await kusa();
    if (kusaCount === "No contributions") {
      await sendMessages(
        "おや？今日の草が生えていないようですね..." +
          "\n" +
          "1 commitでもいいので頑張りましょう!"
      );
    }
  }
};
