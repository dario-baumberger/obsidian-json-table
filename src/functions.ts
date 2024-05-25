import {
	collectAllKeys,
	convertToPrimitive,
	flattenStructure,
	getNestedObject
} from "./json.utils";
import {
	getLineContent,
	getTableLines,
	parseHeader,
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
				.map((header) =>
					data[header] !== undefined && data[header] !== null
						? data[header]
						: ""
				)
				.join(" | ")} |`;
		}
	);

	// Make table array and remove duplicate whitespaces
	const markdownTable = [
		headerRow,
		separatorRow,
		...dataRows.map((row: string) => row.replace(/( {2,})/g, " "))
	].join("\n");

	// return markdown table
	return markdownTable;
}

/**
 * Convert Markdown table to JSON string
 *
 * @param {string} content
 * @returns {Array}
 */
export function tableToJson(content: string): Record<string, unknown>[] {
	const tableObject: Record<string, unknown>[] = [];
	content = trimSeperatorSpaces(content);
	const lines = getTableLines(content);
	if (lines.length <= 2) return tableObject;
	const headers = getLineContent(lines[0]);
	const rows = lines.slice(2);
	const parsedHeaders = headers.map(parseHeader);

	for (const row of rows) {
		const rowData = getLineContent(row);
		const rowObject: Record<string, unknown> = {};

		for (let i = 0; i < headers.length; i++) {
			const {keys, isArray, indices} = parsedHeaders[i];
			const key = keys[keys.length - 1].replace(/\[\d+\]/, "");

			let value: string | number | null | undefined | boolean =
				rowData[i];
			value = convertToPrimitive(value);

			if (value === null || value === undefined || value === "") {
				continue;
			}

			const current = getNestedObject(
				rowObject,
				keys,
				isArray,
				indices
			) as Record<string, unknown>; // Add type assertion

			if (isArray[keys.length - 1]) {
				if (!Array.isArray(current[key])) {
					(current[key] as unknown[]) = [];
				}
				(current[key] as unknown[])[indices[keys.length - 1]] = value;
			} else {
				current[key] = value;
			}
		}

		if (Object.keys(rowObject).length > 0) {
			tableObject.push(rowObject);
		}
	}
	return tableObject;
}
