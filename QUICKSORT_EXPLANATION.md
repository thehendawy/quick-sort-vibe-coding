# QuickSort Explanation

This document explains how the `quickSort` function works in `main.js`.

## Function Overview

```javascript
function quickSort(arr) {
  if (arr.length <= 1) {
    return arr;
  }
  const pivot = arr[arr.length - 1];
  const left = [];
  const right = [];
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] < pivot) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }
  return [...quickSort(left), pivot, ...quickSort(right)];
}
```

## How it works

- **Base case:**
  - The function first checks whether the input array has one or zero elements with `if (arr.length <= 1) { return arr; }`.
  - If true, the array is already sorted, so the function returns it immediately.

- **Choosing the pivot:**
  - The pivot is selected as the last element of the array: `const pivot = arr[arr.length - 1];`.
  - The pivot is used to divide the remaining values into smaller and larger groups.

- **Partitioning:**
  - Two arrays are created: `left` for values less than the pivot, and `right` for values greater than or equal to the pivot.
  - The loop iterates through all elements except the pivot itself and pushes each value into the correct side.

- **Recursive sort:**
  - The function calls itself recursively on the `left` and `right` subarrays.
  - This breaks the problem into smaller sorting tasks until all subarrays are trivially sorted.

- **Recombining:**
  - The sorted array is built by combining the sorted `left` side, the pivot, and the sorted `right` side:
    `return [...quickSort(left), pivot, ...quickSort(right)];`
  - The spread syntax `...` expands each sorted subarray into the final returned array.

## Example

For the input `[5, 3, 8, 4, 2]`:

1. Pivot is `2`.
2. `left` becomes `[]` and `right` becomes `[5, 3, 8, 4]`.
3. The function sorts `left` and `right` recursively.
4. The final sorted result is `[2, 3, 4, 5, 8]`.

## Notes

- This implementation is not in-place because it creates new arrays for each partition and for the final return value.
- Average time complexity is `O(n log n)`.
- Worst-case complexity can degrade to `O(n^2)` if the pivot choice consistently produces unbalanced partitions.

## Complexity Analysis

- **Time complexity**
  - Best case: `O(n log n)` when partitions are balanced.
  - Average case: `O(n log n)` for typical input and pivot distribution.
  - Worst case: `O(n^2)` when partitions are highly unbalanced.

- **Space complexity**
  - Extra array space: `O(n)` because this version allocates new `left` and `right` arrays at each step.
  - Recursion stack: `O(n)` worst-case, `O(log n)` average-case.
