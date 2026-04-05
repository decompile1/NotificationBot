import type { Client, Interaction } from "discord.js";

export default async (_client: Client, interaction: Interaction) => {
    if (!interaction.isButton()) return;

    if (!interaction.customId.startsWith("welcome-button-")) return;

    try {
        const memberId = interaction.customId.split("welcome-button-")[1];
        const member = interaction.guild?.members.cache.get(memberId);
        const user = interaction.user;

        if (!member) {
            await interaction.reply({ content: "Member not found.", ephemeral: true });
            return;
        }

        await interaction.reply({
            content: `Hello ${member} from ${user}`,
            ephemeral: true // only visible to the clicker
        });
    } catch (err) {
        console.error("[Welcome Button] Error handling button:", err);
    }
};