import type { ApplicationCommandOptionChoiceData, ApplicationCommandOptionData } from "discord.js";

export default (
    existingCommand: { description: string; options: readonly ApplicationCommandOptionData[]; },
    localCommand: { description: string; options: readonly ApplicationCommandOptionData[]; }
): boolean => {
    const areChoicesDifferent = (
        existingChoices: readonly ApplicationCommandOptionChoiceData[] = [],
        localChoices: readonly ApplicationCommandOptionChoiceData[] = []
    ): boolean => {
        for (const localChoice of localChoices) {
            const existingChoice = existingChoices?.find((choice: { name: string; }) => choice.name === localChoice.name);

            if (!existingChoice) {
                return true;
            }

            if (localChoice.value !== existingChoice.value) {
                return true;
            }
        }
        return false;
    };

    const areOptionsDifferent = (
        existingOptions: readonly ApplicationCommandOptionData[] = [],
        localOptions: readonly ApplicationCommandOptionData[] = []
    ): boolean => {
        for (const localOption of localOptions) {
            const existingOption = existingOptions?.find((option: { name: string; }) => option.name === localOption.name);

            if (!existingOption) {
                return true;
            }

            if (
                localOption.description !== existingOption.description ||
        localOption.type !== existingOption.type
        // (localOption.required || false) !== existingOption.required ||
        // (localOption.choices?.length || 0) !== (existingOption.choices?.length || 0) ||
        // areChoicesDifferent(localOption.choices || [], existingOption.choices || [])
            ) {
                return true;
            }

            if (
                "required" in localOption &&
        "required" in existingOption &&
        (localOption.required ?? false) !== (existingOption.required ?? false)
            ) {
                return true;
            }

            if (
                "choices" in localOption &&
        "choices" in existingOption &&
        (
            (localOption.choices?.length ?? 0) !== (existingOption.choices?.length ?? 0) ||
          areChoicesDifferent(localOption.choices ?? [], existingOption.choices ?? [])
        )
            ) {
                return true;
            }
        }
        return false;
    };

    if (
        existingCommand.description !== localCommand.description ||
    existingCommand.options?.length !== (localCommand.options?.length || 0) ||
    areOptionsDifferent(
        Array.isArray(existingCommand.options) ? existingCommand.options : [],
        Array.isArray(localCommand.options) ? localCommand.options : []
    )
    ) {
        return true;
    }

    return false;
};