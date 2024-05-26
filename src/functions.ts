import {
	collectAllKeys,
	convertToPrimitive,
	flattenStructure,
	getNestedObject,
	processRow
} from "./json.utils";
import {
	createDataRow,
	createHeaderRow,
	createSeparatorRow,
	getLineContent,
	getTableLines,
	parseHeader,
	removeDuplicateWhitespaces,
	trimSeperatorSpaces
} from "./md.utils";

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

	const flatData = jsonData.map((data: string[]) => flattenStructure(data));

	const headers = collectAllKeys(flatData);
	const headerRow = createHeaderRow(headers);
	const separatorRow = createSeparatorRow(headers);
	const dataRows = flatData.map((data) => createDataRow(data, headers));

	const markdownTable = [
		headerRow,
		separatorRow,
		...dataRows.map((data) => {
			return removeDuplicateWhitespaces(data);
		})
	].join("\n");

	return markdownTable;
}

/**
 * Convert Markdown table to JSON string
 *
 * @param {string} content
 * @returns {Array}
 */
export function tableToJson(content: string): Record<string, unknown>[] {
	content = trimSeperatorSpaces(content);

	const lines = getTableLines(content);
	if (lines.length <= 2) {
		return [];
	}

	const headers = getLineContent(lines[0]);
	const rows = lines.slice(2);
	const parsedHeaders = headers.map(parseHeader);

	return rows
		.map((row) => processRow(row, parsedHeaders))
		.filter((row) => Object.keys(row).length > 0);
}
