import {expect, test} from "vitest";
import {describe} from "node:test";
import {
	createHeaderRow,
	createSeparatorRow,
	getRowContent,
	getTableLines,
	parseHeader,
	trimSeperatorSpaces
} from "src/md.utils";
import {testCaseLarge, testCaseSmallTable} from "./test-data";

describe("MD Utils", () => {
	describe("trimSeperatorSpaces", () => {
		describe("Single", () => {
			test("Empty", () => {
				expect("").toStrictEqual("");
			});

			test("No Space", () => {
				expect(trimSeperatorSpaces("|Test|")).toStrictEqual("|Test|");
			});

			test("All 1 Space", () => {
				expect(trimSeperatorSpaces(" | Test | ")).toStrictEqual(
					"|Test|"
				);
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

			test("Space in word", () => {
				expect(trimSeperatorSpaces("|  Te st   |   ")).toStrictEqual(
					"|Te st|"
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

		describe("Edge Cases", () => {
			test("Only Spaces", () => {
				expect(trimSeperatorSpaces("     ")).toStrictEqual("     ");
			});

			test("Only Separators", () => {
				expect(trimSeperatorSpaces("|||||")).toStrictEqual("|||||");
			});

			test("Spaces and Separators", () => {
				expect(trimSeperatorSpaces(" | | | | | ")).toStrictEqual(
					"|||||"
				);
			});

			test("Different Spaces", () => {
				expect(trimSeperatorSpaces("|    ||  |  ")).toStrictEqual(
					"||||"
				);
			});

			test("Newlines and Spaces", () => {
				expect(trimSeperatorSpaces("\n | Test | \n")).toStrictEqual(
					"\n|Test|\n"
				);
			});

			test("Tabs and Spaces", () => {
				expect(trimSeperatorSpaces("\t | Test | \t")).toStrictEqual(
					"|Test|"
				);
			});
		});
	});

	describe("parseHeader", () => {
		test("simple keys", () => {
			expect(parseHeader("key1.key2.key3")).toEqual({
				keys: ["key1", "key2", "key3"],
				isArray: [false, false, false],
				indices: []
			});
		});

		test("keys with array indices", () => {
			expect(parseHeader("key1[0].key2[1].key3[2]")).toEqual({
				keys: ["key1[0]", "key2[1]", "key3[2]"],
				isArray: [true, true, true],
				indices: [0, 1, 2]
			});
		});

		test("mixed keys", () => {
			expect(parseHeader("key1.key2[1].key3")).toEqual({
				keys: ["key1", "key2[1]", "key3"],
				isArray: [false, true, false],
				indices: [1]
			});
		});

		test("empty header", () => {
			expect(parseHeader("")).toEqual({
				keys: [""],
				isArray: [false],
				indices: []
			});
		});
	});

	describe("getLineContent", () => {
		test("Header Line", () => {
			expect(getRowContent(testCaseLarge.lines[0])).toEqual([
				"Test1",
				"Test2",
				"Test3",
				"Test4"
			]);
		});

		test("Separator Line", () => {
			expect(getRowContent(testCaseLarge.lines[1])).toEqual([
				"---",
				"---",
				"---",
				"---"
			]);
		});

		test("Content Line", () => {
			expect(getRowContent(testCaseLarge.lines[2])).toEqual([
				"Value 1.1",
				"Value 1.2",
				"Value 1.3",
				"Value 1.4"
			]);
		});

		test("emptyString", () => {
			expect(getRowContent("")).toEqual([""]);
		});

		test("singlePipeStartNoSpace", () => {
			expect(getRowContent("|u ")).toEqual(["u"]);
		});

		test("singlePipeEndNoSpace", () => {
			expect(getRowContent(" g|")).toEqual(["g"]);
		});

		test("singlePipeSpace", () => {
			expect(getRowContent(" | ")).toEqual(["", ""]);
		});

		test("whitespaceOnly", () => {
			expect(getRowContent("   |   |   ")).toEqual(["", "", ""]);
		});

		test("multiplePipes", () => {
			expect(getRowContent("|a||b|")).toEqual(["a", "", "b"]);
		});
		test("wrong format", () => {
			expect(getRowContent("1|2||3|4")).toEqual(["", "2", "", "3", ""]);
		});
	});

	describe("getTableLines", () => {
		test("testCaseSmallTable", () => {
			expect(getTableLines(testCaseSmallTable.md)).toEqual(
				testCaseSmallTable.lines
			);
		});

		test("testCaseLarge", () => {
			expect(getTableLines(testCaseLarge.md)).toEqual(
				testCaseLarge.lines
			);
		});

		test("emptyString", () => {
			expect(getTableLines("")).toEqual([]);
		});

		test("whitespaceOnly", () => {
			expect(getTableLines("   \n\t   \n   ")).toEqual([]);
		});

		test("multipleNewlines", () => {
			expect(getTableLines("\n\na\n\nb\n\nc\n\n")).toEqual([
				"a",
				"b",
				"c"
			]);
		});
	});

	describe("createHeaderRow", () => {
		test('should return a string with headers separated by " | "', () => {
			expect(createHeaderRow(["Header1", "Header2", "Header3"])).toBe(
				"| Header1 | Header2 | Header3 |"
			);
		});

		test("should handle an empty array", () => {
			expect(createHeaderRow([])).toBe("| |");
		});

		test("should handle one string", () => {
			expect(createHeaderRow([""])).toBe("| |");
		});

		test("should handle array with one element", () => {
			const headers = ["Header1"];
			const result = createHeaderRow(headers);
			expect(result).toBe("| Header1 |");
		});
	});

	describe("createSeparatorRow", () => {
		test("should return a string with separators for each header", () => {
			const headers = ["Header1", "Header2", "Header3"];
			const result = createSeparatorRow(headers);
			expect(result).toBe("| --- | --- | --- |");
		});

		test("should handle an empty array", () => {
			const headers: string[] = [];
			const result = createSeparatorRow(headers);
			expect(result).toBe("| |");
		});

		test("should handle array with one element", () => {
			const headers = ["Header1"];
			const result = createSeparatorRow(headers);
			expect(result).toBe("| --- |");
		});
	});
});
