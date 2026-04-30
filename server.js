const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

function quickSort(arr) {
  if (!Array.isArray(arr)) {
    throw new Error("Input must be an array");
  }
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

app.post("/api/quicksort", (req, res) => {
  const { array } = req.body;
  if (!Array.isArray(array)) {
    return res
      .status(400)
      .json({ error: "Request body must include an array field" });
  }
  if (!array.every((item) => typeof item === "number" && !Number.isNaN(item))) {
    return res
      .status(400)
      .json({ error: "Array elements must be valid numbers" });
  }

  try {
    const sorted = quickSort(array.slice());
    res.json({ sorted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Sorting API server listening at http://localhost:${port}`);
});
