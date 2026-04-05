export function deepMerge<T>(target: T | undefined, source: Partial<T>): T | undefined {
    if (typeof target !== "object" || typeof source !== "object" || !target) {
        return target;
    }

    for (const key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            const targetValue = target[key];
            const sourceValue = source[key];

            const isObj =
                targetValue !== undefined &&
        targetValue !== null &&
        typeof targetValue === "object" &&
        sourceValue !== undefined &&
        sourceValue !== null &&
        typeof sourceValue === "object";


            if (isObj) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                target[key] = deepMerge(targetValue, sourceValue) as any;
            } else {
                // @ts-expect-error Some exteractor error
                target[key] = sourceValue;
            }
        }
    }

    return target;
}