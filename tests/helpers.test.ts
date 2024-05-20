import {expect, test} from "vitest";
import {
	trimSeperatorSpaces,
	collectAllKeys,
	flattenStructure,
	getTableLines,
	getLineContent,
	parseHeader,
	handleObject
} from "../src/helpers";
import {describe} from "node:test";
import {
	testTable,
	testTableLarge,
	sameKeys,
	keys,
	mixedKeysSingle,
	mixedKeys,
	testStringArray,
	testStringArrayLarge
} from "./test-data";

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
			expect(trimSeperatorSpaces(" | | | | | ")).toStrictEqual("|||||");
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

describe("flattenStructure", () => {
	test("empty object", () => {
		expect(flattenStructure({})).toStrictEqual({});
	});

	test("empty array", () => {
		expect(flattenStructure([])).toStrictEqual({});
	});

	test("smallObject", () => {
		expect(
			flattenStructure({
				name: "Peter",
				contact: {
					mail: "1@example.com",
					phone: "foo"
				}
			})
		).toStrictEqual({
			name: "Peter",
			"contact.mail": "1@example.com",
			"contact.phone": "foo"
		});
	});

	test("smallArraySingle", () => {
		expect(
			flattenStructure({
				name: "Max",
				contact: ["123456789", "2@example.com", "bar"]
			})
		).toStrictEqual({
			"contact[0]": "123456789",
			"contact[1]": "2@example.com",
			"contact[2]": "bar",
			name: "Max"
		});
	});

	test("smallArrayMultiple", () => {
		expect(
			flattenStructure({
				name: "Muster",
				contact: [
					["1@mail.com", "2@mail.com"],
					["123456789", "987654321"],
					["blah"],
					[]
				]
			})
		).toStrictEqual({
			"contact[0].0": "1@mail.com",
			"contact[0].1": "2@mail.com",
			"contact[1].0": "123456789",
			"contact[1].1": "987654321",
			"contact[2].0": "blah",
			name: "Muster"
		});
	});

	test("smallMixedObjectArray 1", () => {
		expect(
			flattenStructure({
				name: "Jana",
				contact: {
					mail: "3@example.com",
					phone: "blah"
				},
				food: ["Pizza", "Pasta"]
			})
		).toStrictEqual({
			"contact.mail": "3@example.com",
			"contact.phone": "blah",
			name: "Jana",
			"food[0]": "Pizza",
			"food[1]": "Pasta"
		});
	});

	test("smallMixedObjectArray 2", () => {
		expect(
			flattenStructure({
				name: "Jean",
				contact: {
					mail: "j@example.com",
					phone: {
						private: "privatePhone",
						work: "workPhone"
					}
				},
				food: [
					{
						type: "Italian",
						menus: ["Pizza", "Pasta"]
					},
					{
						type: "Greek",
						menus: ["Souvlaki", "Tzatziki"]
					}
				]
			})
		).toStrictEqual({
			"contact.mail": "j@example.com",
			"contact.phone.private": "privatePhone",
			"contact.phone.work": "workPhone",
			"food[0].menus[0]": "Pizza",
			"food[0].menus[1]": "Pasta",
			"food[0].type": "Italian",
			"food[1].menus[0]": "Souvlaki",
			"food[1].menus[1]": "Tzatziki",
			"food[1].type": "Greek",
			name: "Jean"
		});
	});

	test("nested arrays", () => {
		expect(
			flattenStructure({
				a: [
					[1, 2],
					[3, 4]
				]
			})
		).toStrictEqual({
			"a[0].0": 1,
			"a[0].1": 2,
			"a[1].0": 3,
			"a[1].1": 4
		});
	});

	test("deeply nested objects", () => {
		expect(flattenStructure({a: {b: {c: {d: {e: "f"}}}}})).toStrictEqual({
			"a.b.c.d.e": "f"
		});
	});

	test("non-string, non-array, non-object values", () => {
		expect(
			flattenStructure({a: 1, b: true, c: null, d: undefined})
		).toStrictEqual({
			a: 1,
			b: true,
			c: null,
			d: undefined
		});
	});

	test("objects with circular references", () => {
		const circularObject = {};
		circularObject["self"] = circularObject;
		expect(() => flattenStructure(circularObject)).toThrow();
	});
});

describe("handleObject", () => {
	test("should handle non-object item", () => {
		expect(handleObject("value", "key", {}, "prefix.")).toEqual("value");
	});

	test("should handle object item", () => {
		expect(handleObject({subkey: "value"}, "key", {}, "prefix.")).toEqual({
			"prefix.key.subkey": "value"
		});
	});

	test("should handle null item", () => {
		expect(handleObject(null, "key", {}, "prefix.")).toEqual(null);
	});

	test("should handle array item", () => {
		expect(
			handleObject(["value1", "value2"], "key", {}, "prefix.")
		).toEqual({
			"prefix.key.0": "value1",
			"prefix.key.1": "value2"
		});
	});

	test("should handle nested object item", () => {
		expect(
			handleObject({subkey: {subsubkey: "value"}}, "key", {}, "prefix.")
		).toEqual({
			"prefix.key.subkey.subsubkey": "value"
		});
	});

	test("should handle undefined item", () => {
		expect(handleObject(undefined, "key", {}, "prefix.")).toEqual(
			undefined
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

	test("emptyObject", () => {
		expect(collectAllKeys([{}])).toStrictEqual([]);
	});

	test("nestedObjects", () => {
		const input = [{a: {b: {c: 1}}}, {d: {e: 2}}];
		const expectedKeys = ["a.b.c", "d.e"];
		expect(collectAllKeys(input)).toStrictEqual(expectedKeys);
	});

	test("arrayInput", () => {
		const input = [
			[1, 2, 3],
			[4, 5, 6]
		];
		expect(collectAllKeys(input)).toStrictEqual(["0", "1", "2"]);
	});
});

describe("getTableLines", () => {
	test("testTable", () => {
		expect(getTableLines(testTable)).toEqual(testStringArray);
	});

	test("testTableLarge", () => {
		expect(getTableLines(testTableLarge)).toEqual(testStringArrayLarge);
	});

	test("emptyString", () => {
		expect(getTableLines("")).toEqual([]);
	});

	test("whitespaceOnly", () => {
		expect(getTableLines("   \n\t   \n   ")).toEqual([]);
	});

	test("multipleNewlines", () => {
		expect(getTableLines("\n\na\n\nb\n\nc\n\n")).toEqual(["a", "b", "c"]);
	});
});

describe("getLineContent", () => {
	test("Header Line", () => {
		expect(getLineContent(testStringArrayLarge[0])).toEqual([
			"Test1",
			"Test2",
			"Test3",
			"Test4"
		]);
	});

	test("Separator Line", () => {
		expect(getLineContent(testStringArrayLarge[1])).toEqual([
			"---",
			"---",
			"---",
			"---"
		]);
	});

	test("Content Line", () => {
		expect(getLineContent(testStringArrayLarge[2])).toEqual([
			"Value 1.1",
			"Value 1.2",
			"Value 1.3",
			"Value 1.4"
		]);
	});

	test("emptyString", () => {
		expect(getLineContent("")).toEqual([""]);
	});

	test("singlePipeStartNoSpace", () => {
		expect(getLineContent("| ")).toEqual([""]);
	});

	test("singlePipeEndNoSpace", () => {
		expect(getLineContent(" |")).toEqual([""]);
	});

	test("singlePipeSpace", () => {
		expect(getLineContent(" | ")).toEqual(["", ""]);
	});

	test("whitespaceOnly", () => {
		expect(getLineContent("   |   |   ")).toEqual(["", "", ""]);
	});

	test("multiplePipes", () => {
		expect(getLineContent("|a||b|")).toEqual(["a", "", "b"]);
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
