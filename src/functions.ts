/**
 * Removes all whitespaces before and after |
 *
 * @param string string
 * @returns string
 */
export function trimSeperatorSpaces(string: string): string {
	return string.replace(/([^\S\r\n]*[|][^\S\r\n]*)/g, "|");
}

/**
 * Search all keys in json and return as string array
 *
 * @param input []
 * @returns string
 */
export function collectAllKeys(input: unknown[]): string[] {
	const keys: string[] = [];

	for (const obj of input) {
		const jsonObject = obj as {[key: string]: never};
		for (const key in jsonObject) {
			if (jsonObject.hasOwnProperty(key) && !keys.includes(key)) {
				keys.push(key);
			}
		}
	}

	return keys;
}

/**
 * Convert json string to markdown table
 *
 * @param content sring
 * @returns string
 */
export function jsonToTable(content: string): string {
	const jsonData = JSON.parse(content);

	if (!jsonData || jsonData.length === 0) {
		return "";
	}

	// create header and separators
	const headers = collectAllKeys(jsonData);
	const headerRow = `| ${headers.join(" | ")} |`;
	const separatorRow = `| ${headers.map(() => "---").join(" | ")} |`;

	// create table body
	const dataRows: string[] = jsonData.map(
		(data: {[key: string]: unknown}) => {
			return `| ${headers.map((header) => data[header]).join(" | ")} |`;
		}
	);

	// make table array and removed dupplicate whitespaces
	const markdownTable = [
		headerRow,
		separatorRow,
		...dataRows.map((row: string) => row.replace(/( {2,})/g, " "))
	].join("\n");

	return markdownTable;
}

/**
 * Convert markdown table to json string
 *
 * @param content string
 * @returns Array
 */
export function tableToJson(content: string): unknown[] {
	const tableObject: unknown[] = [];

	// prepare input to work with
	content = trimSeperatorSpaces(content);

	// get lines
	const lines = content.split("\n").map((line) => line.trim());

	// Do not proceed if only header row and/or seperator row are given
	if (lines.length <= 2) {
		return tableObject;
	}

	// get headers from first line
	const headers = lines[0].substring(1, lines[0].length - 1).split("|");

	// get content rows (no header row, no separators row)
	const rows = lines.slice(2);

	for (const row of rows) {
		//remove leading and trailing |, after split by |
		const rowData = row.slice(1, -1).split("|");
		const rowObject: {[key: string]: unknown} = {};

		for (let i = 0; i < headers.length; i++) {
			rowObject[headers[i]] = rowData[i];
		}

		tableObject.push(rowObject);
	}

	return tableObject;
}
