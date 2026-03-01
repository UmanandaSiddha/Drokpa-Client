/**
 * Utility functions for generating SEO-friendly slugs
 */

/**
 * Converts a string to a URL-safe slug
 * @param text - The text to convert to a slug
 * @returns URL-safe slug string
 * @example
 * generateSlug("Mountain Trek in Sikkim") // "mountain-trek-in-sikkim"
 * generateSlug("Homestay @ Gangtok!!!") // "homestay-gangtok"
 */
export function generateSlug(text: string): string {
    return text
        .toLowerCase() // Convert to lowercase
        .trim() // Remove whitespace from both ends
        .replace(/[^\w\s-]/g, '') // Remove special characters except word chars, spaces, and hyphens
        .replace(/[\s_]+/g, '-') // Replace spaces and underscores with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
        .replace(/^-+|-+$/g, '') // Remove leading and trailing hyphens
}

/**
 * Ensures slug uniqueness by checking against existing slugs
 * and appending a suffix if necessary
 * @param baseSlug - The base slug to check
 * @param existingSlugs - Array of existing slugs to check against
 * @returns A unique slug with suffix if needed
 * @example
 * ensureUniqueSlug("mountain-trek", ["mountain-trek"]) // "mountain-trek-2"
 * ensureUniqueSlug("mountain-trek", ["mountain-trek", "mountain-trek-2"]) // "mountain-trek-3"
 */
export function ensureUniqueSlug(
    baseSlug: string,
    existingSlugs: string[]
): string {
    if (!existingSlugs.includes(baseSlug)) {
        return baseSlug
    }

    // Find the highest suffix number
    let suffix = 2
    const pattern = new RegExp(`^${baseSlug}-(\\d+)$`)

    existingSlugs.forEach((slug) => {
        const match = slug.match(pattern)
        if (match) {
            const num = parseInt(match[1], 10)
            if (num >= suffix) {
                suffix = num + 1
            }
        }
    })

    return `${baseSlug}-${suffix}`
}

/**
 * Validates if a string is a valid slug
 * @param slug - The slug to validate
 * @returns true if valid, false otherwise
 */
export function isValidSlug(slug: string): boolean {
    const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
    return slugPattern.test(slug)
}

/**
 * Generates a slug from title/name and ensures uniqueness by fetching existing slugs
 * This is the main function to use in forms
 * @param text - The text to convert to slug
 * @param model - The model type ('tour' or 'homestay')
 * @param existingId - Optional ID to exclude from uniqueness check (for updates)
 * @returns Promise with unique slug
 */
export async function generateUniqueSlug(
    text: string,
    model: 'tour' | 'homestay',
    existingId?: string
): Promise<string> {
    const baseSlug = generateSlug(text)

    try {
        // Fetch existing slugs from API
        const endpoint = model === 'tour' ? '/tours/slugs' : '/homestays/slugs'
        const response = await fetch(endpoint)
        const existingSlugs: string[] = await response.json()

        // Filter out the current item's slug if updating
        const filteredSlugs = existingId
            ? existingSlugs.filter((s: string) => s !== baseSlug)
            : existingSlugs

        return ensureUniqueSlug(baseSlug, filteredSlugs)
    } catch (error) {
        console.error('Error fetching existing slugs:', error)
        // Fallback: return base slug with timestamp if API fails
        return `${baseSlug}-${Date.now()}`
    }
}
