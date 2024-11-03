const now = new Date().toISOString();

/**
 * Helper function to safely convert a value to an integer.
 * If conversion fails, it returns a default value.
 * @param {any} value - The value to convert.
 * @param {number} defaultValue - The default value to return if conversion fails (optional, default is 0).
 * @returns {number} - The converted integer or the default value.
 */
function safeInt(value, defaultValue = 0) {
  const converted = parseInt(value, 10);
  if (isNaN(converted)) {
    return defaultValue;
  }
  return converted;
}

/**
 * Helper function to safely convert a value to a float.
 * If conversion fails, it returns a default value.
 * @param {any} value - The value to convert.
 * @param {number} defaultValue - The default value to return if conversion fails (optional, default is 0.0).
 * @returns {number} - The converted float or the default value.
 */
function safeFloat(value, defaultValue = 0.0) {
  const converted = parseFloat(value);
  if (isNaN(converted)) {
    return defaultValue;
  }
  return converted;
}

/**
 * Helper function to convert a string into a URL-friendly slug.
 * @param {string} text - The input string to be converted to slug.
 * @returns {string} - The slugified version of the input string.
 */
function slugify(text) {
  return text
    .toString() // Convert to string
    .toLowerCase() // Convert to lowercase
    .trim() // Remove whitespace from both ends
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+|-+$/g, ''); // Trim - from start and end
}

/**
 * hasField untuk memeriksa apakah field tertentu diminta dalam query
 * @param {*} info - The info from QraphQL query
 * @param {*} fieldName - Name field
 * @returns {boolean}
 */
const hasField = (info, fieldName) => {
  const checkFields = (selections) => selections.some((selection) => {
    if (selection.name.value === fieldName) {
      return true;
    }
    if (selection.selectionSet) {
      return checkFields(selection.selectionSet.selections);
    }
    return false;
  });

  return checkFields(info.fieldNodes[0].selectionSet.selections);
};

module.exports = {
  now, safeInt, safeFloat, slugify, hasField,
};
