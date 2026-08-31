/**
 * Helper function to generate clean, SEO-friendly URL slugs
 * @param {string} text 
 * @returns {string}
 */
export function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w-]+/g, '')     // Remove all non-word chars
    .replace(/--+/g, '-')        // Replace multiple - with single -
    .replace(/^-+/, '')          // Trim - from start of text
    .replace(/-+$/, '');         // Trim - from end of text
}

/**
 * Generate a unique semantic ID with timestamp & random entropy
 * @param {'BATCH' | 'MOD' | 'CNT'} prefix
 * @param {string} [nameHint] Optional name to include slug
 * @returns {string}
 */
export function generateId(prefix = 'CNT', nameHint = '') {
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  
  if (nameHint) {
    const cleanHint = slugify(nameHint).substring(0, 15);
    if (cleanHint) {
      return `${prefix}-${cleanHint}-${timestamp}-${randomSuffix}`;
    }
  }
  
  return `${prefix}-${timestamp}-${randomSuffix}`;
}

/**
 * Generate semantic content URL slug
 * @param {Object} content - Content object containing title and contentId
 * @returns {string}
 */
export function getContentSlug(content) {
  if (!content) return '';
  const titleSlug = slugify(content.title || content.contentTitle || 'content');
  const shortId = (content.contentId || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  return shortId ? `${titleSlug}-${shortId.slice(-6)}` : titleSlug;
}

/**
 * Find content in LMS nested data by slug or ID
 * @param {Array} data - Nested batch array
 * @param {string} slugOrId - URL slug or contentId
 * @returns {{ batch: Object, module: Object, content: Object } | null}
 */
export function findContentBySlugOrId(data, slugOrId) {
  if (!data || !slugOrId) return null;
  const normalizedSearch = slugOrId.toLowerCase().trim();

  for (const batch of data) {
    for (const module of batch.modules || []) {
      for (const content of module.contents || []) {
        const contentSlug = getContentSlug(content).toLowerCase();
        const rawTitleSlug = slugify(content.title).toLowerCase();
        const contentId = (content.contentId || '').toLowerCase();

        if (
          contentSlug === normalizedSearch ||
          rawTitleSlug === normalizedSearch ||
          contentId === normalizedSearch ||
          contentSlug.endsWith(normalizedSearch) ||
          normalizedSearch.endsWith(contentId.slice(-6))
        ) {
          return { batch, module, content };
        }
      }
    }
  }
  return null;
}
