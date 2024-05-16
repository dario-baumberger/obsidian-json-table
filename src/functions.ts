/**
 * Removes all whitespaces before and after |
 *
 * @param {string} string
 * @returns {string}
 */
export function trimSeperatorSpaces(string: string): string {
	return string.replace(/([^\S\r\n]*[|][^\S\r\n]*)/g, "|");
}

/**
 * Handles the flattening of an object or array item.
 *
 * @param {unknown} item - The item to be flattened.
 * @param {string} key - The key associated with the item.
 * @param {Record<string, unknown>} flatObject - The object that accumulates the flattened structure.
 * @param {string} prefix - The current prefix for the key.
 */
function handleObject(
	item: unknown,
	key: string,
	flatObject: Record<string, unknown>,
	prefix: string
) {
	if (typeof item === "object" && item !== null) {
		Object.assign(flatObject, flattenStructure(item, `${prefix}${key}.`));
	} else {
		flatObject[`${prefix}${key}`] = item;
	}
}

/**
 * Flattens the structure of a JSON object
 *
 * @param {Object} input
 * @param {string} prefix
 * @returns {Object}
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any

export function flattenStructure(
	input: unknown,
	prefix: string = ""
): Record<string, unknown> {
	const flatObject: Record<string, unknown> = {};

	if (typeof input !== "object" || !input) {
		return flatObject;
	}

	for (const key in input as Record<string, unknown>) {
		const value = (input as Record<string, unknown>)[key];
		if (Array.isArray(value)) {
			value.forEach((item, index) =>
				handleObject(item, `${key}[${index}]`, flatObject, prefix)
			);
		} else {
			handleObject(value, key, flatObject, prefix);
		}
	}
	return flatObject;
}

/**
 * Search all keys in JSON and return as string array
 *
 * @param {Array} input
 * @returns {string[]}
 */
export function collectAllKeys(input: unknown[]): string[] {
	const keys: string[] = [];

	for (const obj of input) {
		const jsonObject = flattenStructure(obj as {[key: string]: never});
		for (const key in jsonObject) {
			if (jsonObject.hasOwnProperty(key) && !keys.includes(key)) {
				keys.push(key);
			}
		}
	}

	return keys;
}

/**
 * Convert JSON string to Markdown table
 *
 * @param {string} content
 * @returns {string}
 */
export function jsonToTable(content: string): string {
	const jsonData = JSON.parse(content);

	if (!jsonData || jsonData.length === 0) {
		return "";
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const flatData = jsonData.map((item: any) => flattenStructure(item));

	// Create header and separators
	const headers = collectAllKeys(flatData);
	const headerRow = `| ${headers.join(" | ")} |`;
	const separatorRow = `| ${headers.map(() => "---").join(" | ")} |`;

	// Create table body
	const dataRows: string[] = flatData.map(
		(data: {[key: string]: unknown}) => {
			return `| ${headers
				.map((header) => data[header] || "")
				.join(" | ")} |`;
		}
	);

	// Make table array and remove duplicate whitespaces
	const markdownTable = [
		headerRow,
		separatorRow,
		...dataRows.map((row: string) => row.replace(/( {2,})/g, " "))
	].join("\n");

	return markdownTable;
}

/**
 * Convert Markdown table to JSON string
 *
 * @param {string} content
 * @returns {Array}
 */
export function tableToJson(content: string): unknown[] {
	const tableObject: unknown[] = [];

	// Prepare input to work with
	content = trimSeperatorSpaces(content);

	// Get lines
	const lines = content.split("\n").map((line) => line.trim());

	// Do not proceed if only header row and/or separator row are given
	if (lines.length <= 2) {
		return tableObject;
	}

	// Get headers from first line
	const headers = lines[0].substring(1, lines[0].length - 1).split("|");

	// Get content rows (no header row, no separators row)
	const rows = lines.slice(2);

	for (const row of rows) {
		// Remove leading and trailing |, then split by |
		const rowData = row.slice(1, -1).split("|");
		const rowObject: {[key: string]: unknown} = {};

		for (let i = 0; i < headers.length; i++) {
			rowObject[headers[i]] = rowData[i];
		}

		tableObject.push(rowObject);
	}

	return tableObject;
}
