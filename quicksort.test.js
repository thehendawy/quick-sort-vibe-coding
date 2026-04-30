const { quickSort } = require("./main");

describe("quickSort", () => {
  test("should return an empty array when given an empty array", () => {
    const input = [];
    const result = quickSort([...input]); // Copy to avoid mutation
    expect(result).toEqual([]);
  });

  test("should return the same array when given a single element", () => {
    const input = [42];
    const result = quickSort([...input]);
    expect(result).toEqual([42]);
  });

  test("should sort an already sorted array", () => {
    const input = [1, 2, 3, 4, 5];
    const result = quickSort([...input]);
    expect(result).toEqual([1, 2, 3, 4, 5]);
  });

  test("should sort a reverse sorted array", () => {
    const input = [5, 4, 3, 2, 1];
    const result = quickSort([...input]);
    expect(result).toEqual([1, 2, 3, 4, 5]);
  });

  test("should sort an unsorted array", () => {
    const input = [5, 3, 8, 4, 2];
    const result = quickSort([...input]);
    expect(result).toEqual([2, 3, 4, 5, 8]);
  });

  test("should handle arrays with duplicate elements", () => {
    const input = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3];
    const result = quickSort([...input]);
    expect(result).toEqual([1, 1, 2, 3, 3, 4, 5, 5, 6, 9]);
  });

  test("should handle arrays with negative numbers", () => {
    const input = [-3, 1, -1, 4, -5];
    const result = quickSort([...input]);
    expect(result).toEqual([-5, -3, -1, 1, 4]);
  });

  test("should handle arrays with mixed positive and negative numbers", () => {
    const input = [0, -1, 1, -2, 2];
    const result = quickSort([...input]);
    expect(result).toEqual([-2, -1, 0, 1, 2]);
  });

  test("should return the original array reference (in-place sort)", () => {
    const input = [3, 1, 4, 1, 5];
    const result = quickSort(input);
    expect(result).toBe(input); // Should be the same reference
    expect(result).toEqual([1, 1, 3, 4, 5]);
  });

  test("should handle large arrays (performance test)", () => {
    const input = Array.from({ length: 1000 }, () =>
      Math.floor(Math.random() * 1000),
    );
    const result = quickSort([...input]);
    const sorted = [...input].sort((a, b) => a - b);
    expect(result).toEqual(sorted);
  });

  test("should throw or handle non-array inputs gracefully", () => {
    expect(() => quickSort(null)).not.toThrow();
    expect(() => quickSort(undefined)).not.toThrow();
    expect(() => quickSort(42)).not.toThrow();
    expect(() => quickSort("string")).not.toThrow();
  });
});
