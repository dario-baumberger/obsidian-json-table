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
			value.forEach((item, index) => {
				const newKey = `${prefix}${key}[${index}]`;
				if (typeof item === "object" && item !== null) {
					Object.assign(
						flatObject,
						flattenStructure(item, `${newKey}.`)
					);
				} else {
					flatObject[newKey] = item;
				}
			});
		} else {
			const newKey = `${prefix}${key}`;
			if (typeof value === "object" && value !== null) {
				Object.assign(
					flatObject,
					flattenStructure(value, `${newKey}.`)
				);
			} else {
				flatObject[newKey] = value;
			}
		}
	}
	return flatObject;
}

/**
 * Handles the flattening of an object or array item.
 *
 * @param {unknown} item - The item to be flattened.
 * @param {string} key - The key associated with the item.
 * @param {Record<string, unknown>} flatObject - The object that accumulates the flattened structure.
 * @param {string} prefix - The current prefix for the key.
 */
export function handleObject(
	item: unknown,
	key: string,
	flatObject: Record<string, unknown>,
	prefix: string
) {
	if (typeof item === "object" && item !== null) {
		return Object.assign(
			flatObject,
			flattenStructure(item, `${prefix}${key}.`)
		);
	} else {
		return (flatObject[`${prefix}${key}`] = item);
	}
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

export function getTableLines(content: string): string[] {
	return content
		.split("\n")
		.map((line) => line.trim())
		.filter((line) => line.length > 0);
}

export function getLineContent(line: string): string[] {
	return line
		.slice(1, -1)
		.split("|")
		.map((content) => content.trim());
}

export function parseHeader(header: string): {
	keys: string[];
	isArray: boolean[];
	indices: number[];
} {
	const keys = header.split(".");
	const isArray = keys.map((key) => key.includes("["));
	const indices = keys
		.map((key) => {
			const match = key.match(/\[(\d+)\]/);
			return match ? parseInt(match[1]) : undefined;
		})
		.filter((index) => index !== undefined) as number[]; // Filter out undefined values and convert to number[]
	return {keys, isArray, indices};
}

export function getNestedObject(
	rowObject: Record<string, unknown>,
	keys: string[],
	isArray: boolean[],
	indices: number[]
): Record<string, unknown> | unknown[] {
	let current: Record<string, unknown> | unknown[] = rowObject;
	for (let j = 0; j < keys.length - 1; j++) {
		const key = keys[j].replace(/\[\d+\]/, "");
		if (isArray[j]) {
			if (!Array.isArray(current[key])) {
				current[key] = [];
			}
			if (indices[j] !== undefined) {
				const arrayCurrent = current[key] as unknown[];
				if (
					typeof arrayCurrent[indices[j]] !== "object" ||
					arrayCurrent[indices[j]] === null
				) {
					arrayCurrent[indices[j]] = {};
				}
				current = arrayCurrent[indices[j]] as Record<string, unknown>;
			}
		} else {
			if (typeof current[key] !== "object" || current[key] === null) {
				current[key] = {};
			}
			current = current[key] as Record<string, unknown>;
		}
	}
	return current;
}
