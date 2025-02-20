import { Bot, Interaction, InteractionResponseTypes } from "./deps.ts";
import { Secret } from "./envValues.ts";

export const grantRole = async (b: Bot, interaction: Interaction) => {
  await b.helpers.addRole(Secret.GUILD_ID, interaction.user.id, Secret.ROLE_ID);
  await b.helpers.sendInteractionResponse(interaction.id, interaction.token, {
    type: InteractionResponseTypes.ChannelMessageWithSource,
    data: {
      content: "コーディング中に変更しました",
    },
  });
};

export const deprivationRole = async (b: Bot, interaction: Interaction) => {
  await b.helpers.removeRole(
    Secret.GUILD_ID,
    interaction.user.id,
    Secret.ROLE_ID
  );
  await b.helpers.sendInteractionResponse(interaction.id, interaction.token, {
    type: InteractionResponseTypes.ChannelMessageWithSource,
    data: {
      content: "コーディングをいったんお休みします",
    },
  });
};
