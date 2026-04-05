/* eslint-disable @typescript-eslint/no-explicit-any */
export function replacePlaceholder(
    template: string,
    values: Record<string, string | number | undefined>
): string {
    // Match any {placeholder}
    return template.replace(/\{([^}]+)\}/g, (_, key) => {
        const value = values[key];
        // Replace if the key exists in values
        if (key in values) {
            return value !== undefined ? String(value) : "[undefined]";
        }
        // If the key is unknown, keep it in the text
        return `{${key}}`;
    });
}