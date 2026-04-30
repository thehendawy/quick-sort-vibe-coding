self.onmessage = (event) => {
  const { array } = event.data;
  if (!Array.isArray(array)) {
    self.postMessage({ error: "Input must be an array" });
    return;
  }

  try {
    const sorted = quickSort(array.slice());
    self.postMessage({ sorted });
  } catch (error) {
    self.postMessage({ error: error.message });
  }
};

function quickSort(arr) {
  if (arr.length <= 1) {
    return arr;
  }
  quickSortRange(arr, 0, arr.length - 1);
  return arr;
}

function quickSortRange(arr, left, right) {
  if (left >= right) {
    return;
  }
  const pivotIndex = Math.floor((left + right) / 2);
  [arr[pivotIndex], arr[right]] = [arr[right], arr[pivotIndex]];
  const index = partition(arr, left, right);
  quickSortRange(arr, left, index - 1);
  quickSortRange(arr, index + 1, right);
}

function partition(arr, left, right) {
  const pivot = arr[right];
  let i = left - 1;
  for (let j = left; j < right; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]];
  return i + 1;
}
