import { expect, test } from "vitest";
import {
	jsonToTable,
	tableToJson,
	trimSeperatorSpaces,
	collectAllKeys,
} from "../src/functions";
import { describe } from "node:test";

const noBodyTable = `| Test1 | Test |\n| --- | --- |`;
const testTable = `| Test1 | Test2 |\n| --- | --- |\n| Value 1 | Value 2 |`;
const testJson = [{ Test1: "Value 1", Test2: "Value 2" }];
const testTableLarge = `| Test1 | Test2 | Test3 | Test4 |\n| --- | --- | --- | --- |\n| Value 1.1 | Value 1.2 | Value 1.3 | Value 1.4 |\n| Value 2.1 | Value 2.2 | Value 2.3 | |\n| Value 3.1 | Value 3.2 | | Value 3.4 |`;
const testJsonLarge = [
	{
		Test1: "Value 1.1",
		Test2: "Value 1.2",
		Test3: "Value 1.3",
		Test4: "Value 1.4",
	},
	{
		Test1: "Value 2.1",
		Test2: "Value 2.2",
		Test3: "Value 2.3",
		Test4: "",
	},
	{
		Test1: "Value 3.1",
		Test2: "Value 3.2",
		Test3: "",
		Test4: "Value 3.4",
	},
];
const keys = ["key1", "key2", "key3"];
const sameKeys = [
	{ key1: 1.1, key2: 1.2, key3: 1.3 },
	{ key1: 2.1, key2: 2.2, key3: 2.3 },
];
const mixedKeysSingle = [{ key1: 1.1 }, { key2: 2.2 }, { key3: 3.3 }];

const mixedKeys = [
	{ key1: 1.1, key2: 1.2 },
	{ key2: 2.2, key3: 2.3 },
	{ key1: 3.1, key2: 3.2, key3: 3.3 },
];

describe("trimSeperatorSpaces", () => {
	describe("Single", () => {
		test("Empty", () => {
			expect("").toStrictEqual("");
		});

		test("No Space", () => {
			expect(trimSeperatorSpaces("|Test|")).toStrictEqual("|Test|");
		});

		test("All 1 Space", () => {
			expect(trimSeperatorSpaces(" | Test | ")).toStrictEqual("|Test|");
		});

		test("All 2 Spaces", () => {
			expect(trimSeperatorSpaces("  |  Test  |  ")).toStrictEqual(
				"|Test|"
			);
		});

		test("Random Spaces", () => {
			expect(trimSeperatorSpaces("|  Test   |   ")).toStrictEqual(
				"|Test|"
			);
		});
	});

	describe("Multiple", () => {
		test("No Space", () => {
			expect(trimSeperatorSpaces("|Test|Test|Test|")).toStrictEqual(
				"|Test|Test|Test|"
			);
		});

		test("Random Spaces", () => {
			expect(
				trimSeperatorSpaces("|  Test   | Test| Test|  ")
			).toStrictEqual("|Test|Test|Test|");
		});
	});
});

describe("tableToJson", () => {
	test("empty input", () => {
		expect(tableToJson("")).toStrictEqual([]);
	});

	test("only header", () => {
		expect(tableToJson("|Test1|Test2|")).toStrictEqual([]);
	});

	test("no table body", () => {
		expect(tableToJson(noBodyTable)).toStrictEqual([]);
	});

	test("Complete table", () => {
		expect(tableToJson(testTable)).toEqual(testJson);
	});

	test("Complete table large", () => {
		expect(tableToJson(testTableLarge)).toEqual(testJsonLarge);
	});
});

describe("jsonToTable", () => {
	test("empty input", () => {
		expect(jsonToTable(JSON.stringify([]))).toStrictEqual("");
	});

	test("small", () => {
		expect(jsonToTable(JSON.stringify(testJson))).toStrictEqual(testTable);
	});

	test("testTableLarge", () => {
		expect(jsonToTable(JSON.stringify(testJsonLarge))).toStrictEqual(
			testTableLarge
		);
	});
});

describe("collectAllKeys", () => {
	test("sameKeys", () => {
		expect(collectAllKeys(sameKeys)).toStrictEqual(keys);
	});

	test("mixedKeysSingle", () => {
		expect(collectAllKeys(mixedKeysSingle)).toStrictEqual(keys);
	});

	test("mixedKeys", () => {
		expect(collectAllKeys(mixedKeys)).toStrictEqual(keys);
	});
});
