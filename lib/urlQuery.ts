type QueryInput = URLSearchParams | { toString(): string };

type QueryValue = string | number | null | undefined;

export function parsePositivePageParam(value: string | null, fallback: number = 1): number {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export function parseStringParam(value: string | null, fallback: string = ""): string {
    return value ?? fallback;
}

export function parseEnumParam<T extends string>(
    value: string | null,
    allowed: readonly T[],
    fallback: T,
): T {
    return value && (allowed as readonly string[]).includes(value) ? (value as T) : fallback;
}

export function buildQueryString(current: QueryInput, updates: Record<string, QueryValue>): string {
    const params = new URLSearchParams(current.toString());

    for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === undefined || value === "") {
            params.delete(key);
            continue;
        }

        params.set(key, String(value));
    }

    return params.toString();
}
