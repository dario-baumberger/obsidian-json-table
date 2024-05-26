import {expect, test} from "vitest";
import {describe} from "node:test";
import {
	collectAllKeys,
	convertToPrimitive,
	flattenStructure,
	getNestedObject,
	handleObject
} from "src/json.utils";

describe("JSON Utils", () => {
	describe("collectAllKeys", () => {
		test("Keys", () => {
			expect(
				collectAllKeys([{key1: 1.1}, {key2: 2.2}, {key3: 3.3}])
			).toStrictEqual(["key1", "key2", "key3"]);
		});

		test("sameKeys", () => {
			expect(
				collectAllKeys([
					{key1: 1.1, key2: 1.2, key3: 1.3},
					{key1: 2.1, key2: 2.2, key3: 2.3}
				])
			).toStrictEqual(["key1", "key2", "key3"]);
		});

		test("mixedKeys", () => {
			expect(
				collectAllKeys([
					{key1: 1.1, key2: 1.2},
					{key2: 2.2, key3: 2.3},
					{key1: 3.1, key2: 3.2, key3: 3.3}
				])
			).toStrictEqual(["key1", "key2", "key3"]);
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
				["a", "aa", "aaa"],
				["b", "bb", "bbb"]
			];
			expect(collectAllKeys(input)).toStrictEqual(["0", "1", "2"]);
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
			expect(
				flattenStructure({a: {b: {c: {d: {e: "f"}}}}})
			).toStrictEqual({
				"a.b.c.d.e": "f"
			});
		});

		test("non-string, non-array, non-object values", () => {
			expect(
				flattenStructure({
					a: 1,
					b: true,
					c: null,
					d: undefined,
					e: 0,
					f: -9
				})
			).toStrictEqual({
				a: 1,
				b: true,
				c: null,
				e: 0,
				f: -9
			});
		});

		test("objects with circular references", () => {
			const circularObject: {self: unknown} = {
				self: undefined
			};
			circularObject["self"] = circularObject;
			expect(() => flattenStructure(circularObject)).toThrow();
		});
	});

	describe("handleObject", () => {
		test("should handle non-object item", () => {
			expect(handleObject("value", "key", {}, "prefix.")).toEqual(
				"value"
			);
		});

		test("should handle object item", () => {
			expect(
				handleObject({subkey: "value"}, "key", {}, "prefix.")
			).toEqual({
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
				handleObject(
					{subkey: {subsubkey: "value"}},
					"key",
					{},
					"prefix."
				)
			).toEqual({
				"prefix.key.subkey.subsubkey": "value"
			});
		});

		test("should handle undefined item", () => {
			expect(handleObject(undefined, "key", {}, "prefix.")).toEqual(
				undefined
			);
		});

		test("should handle empty object", () => {
			expect(handleObject({}, "key", {}, "prefix.")).toEqual({});
		});

		test("should handle array of objects", () => {
			expect(
				handleObject(
					[{subkey: "value1"}, {subkey: "value2"}],
					"key",
					{},
					"prefix."
				)
			).toEqual({
				"prefix.key.0.subkey": "value1",
				"prefix.key.1.subkey": "value2"
			});
		});

		test("should handle nested arrays", () => {
			expect(
				handleObject(
					[
						["value1", "value2"],
						["value3", "value4"]
					],
					"key",
					{},
					"prefix."
				)
			).toEqual({
				"prefix.key.0[0]": "value1",
				"prefix.key.0[1]": "value2",
				"prefix.key.1[0]": "value3",
				"prefix.key.1[1]": "value4"
			});
		});

		test("should handle given structure", () => {
			expect(
				handleObject(
					[
						["value1", "value2"],
						["value3", "value4"]
					],
					"key",
					{a: {b: []}},
					"prefix."
				)
			).toEqual({
				a: {
					b: []
				},
				"prefix.key.0[0]": "value1",
				"prefix.key.0[1]": "value2",
				"prefix.key.1[0]": "value3",
				"prefix.key.1[1]": "value4"
			});
		});
	});

	describe("convertToPrimitive", () => {
		test('should convert "true" to boolean true', () => {
			expect(convertToPrimitive("true")).toBe(true);
		});

		test('should convert "false" to boolean false', () => {
			expect(convertToPrimitive("false")).toBe(false);
		});

		test('should convert "null" to null', () => {
			expect(convertToPrimitive("null")).toBe(null);
		});

		test('should convert "undefined" to undefined', () => {
			expect(convertToPrimitive("undefined")).toBe(undefined);
		});

		test('should return string starting with "0" as is', () => {
			expect(convertToPrimitive("0123")).toBe("0123");
		});

		test("should convert numeric string to number", () => {
			expect(convertToPrimitive("123")).toBe(123);
			expect(convertToPrimitive("456 ")).toBe(456);
			expect(convertToPrimitive(" 789")).toBe(789);
			expect(convertToPrimitive(" 0")).toBe(0);
		});

		test("should return non-numeric string as is", () => {
			expect(convertToPrimitive("Hello")).toBe("Hello");
			expect(convertToPrimitive("3 6 9")).toBe("3 6 9");
			expect(convertToPrimitive("1,2")).toBe("1,2");
			expect(convertToPrimitive("999'999.99")).toBe("999'999.99");
		});

		test("should handle case insensitivity", () => {
			expect(convertToPrimitive("TrUe")).toBe(true);
			expect(convertToPrimitive("FaLsE")).toBe(false);
			expect(convertToPrimitive("NuLl")).toBe(null);
			expect(convertToPrimitive("UnDeFiNeD")).toBe(undefined);
		});
	});

	describe("getNestedObject", () => {
		test("should handle empty object", () => {
			expect(
				getNestedObject(
					{},
					["key1", "key2"],
					[false, false],
					[NaN, NaN]
				)
			).toEqual({});
		});

		test("should handle nested object", () => {
			expect(
				getNestedObject(
					{key1: {key2: "value"}},
					["key1", "key2"],
					[false, false],
					[NaN, NaN]
				)
			).toEqual({
				key2: "value"
			});
		});

		test("should handle nested array", () => {
			expect(
				getNestedObject(
					{key1: [{key2: "value"}]},
					["key1[0]", "key2"],
					[true, false],
					[0, NaN]
				)
			).toEqual({
				key2: "value"
			});
		});

		test("should handle nested object in array", () => {
			expect(
				getNestedObject(
					{key1: [{key2: {key3: "value"}}]},
					["key1[0]", "key2", "key3"],
					[true, false, false],
					[0, NaN, NaN]
				)
			).toEqual({
				key3: "value"
			});
		});

		test("should handle nested array in object", () => {
			expect(
				getNestedObject(
					{key1: {key2: ["value"]}},
					["key1", "key2[0]"],
					[false, true],
					[NaN, 0]
				)
			).toEqual({key2: ["value"]});
		});
	});
});
