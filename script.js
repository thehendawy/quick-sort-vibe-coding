// sorting algorithms and visualization helpers
const worker = window.Worker ? new Worker("quicksort-worker.js") : null;
let currentVisualization = null;

function validateNumericArray(arr) {
  if (!Array.isArray(arr)) {
    throw new Error("Input must be an array");
  }
  for (let item of arr) {
    if (typeof item !== "number" || Number.isNaN(item)) {
      throw new Error("All elements must be valid numbers");
    }
  }
}

function quickSort(arr) {
  validateNumericArray(arr);
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
      recordStep(arr, [i, j]);
    }
  }
  [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]];
  recordStep(arr, [i + 1, right]);
  return i + 1;
}

function mergeSort(arr) {
  validateNumericArray(arr);
  return mergeSortRange(arr);
}

function mergeSortRange(arr) {
  if (arr.length <= 1) {
    return arr;
  }
  const mid = Math.floor(arr.length / 2);
  const left = mergeSortRange(arr.slice(0, mid));
  const right = mergeSortRange(arr.slice(mid));
  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0;
  let j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }
  return result.concat(left.slice(i)).concat(right.slice(j));
}

function heapSort(arr) {
  validateNumericArray(arr);
  const a = arr.slice();
  buildMaxHeap(a);
  for (let end = a.length - 1; end > 0; end--) {
    [a[end], a[0]] = [a[0], a[end]];
    recordStep(a, [0, end]);
    siftDown(a, 0, end - 1);
  }
  return a;
}

function buildMaxHeap(arr) {
  const start = Math.floor((arr.length - 2) / 2);
  for (let i = start; i >= 0; i--) {
    siftDown(arr, i, arr.length - 1);
  }
}

function siftDown(arr, start, end) {
  let root = start;
  while (root * 2 + 1 <= end) {
    let child = root * 2 + 1;
    let swapIndex = root;
    if (arr[swapIndex] < arr[child]) {
      swapIndex = child;
    }
    if (child + 1 <= end && arr[swapIndex] < arr[child + 1]) {
      swapIndex = child + 1;
    }
    if (swapIndex === root) {
      return;
    }
    [arr[root], arr[swapIndex]] = [arr[swapIndex], arr[root]];
    recordStep(arr, [root, swapIndex]);
    root = swapIndex;
  }
}

function builtInSort(arr) {
  validateNumericArray(arr);
  return arr.slice().sort((a, b) => a - b);
}

function parallelQuickSort(arr) {
  return new Promise((resolve, reject) => {
    if (!worker) {
      resolve(quickSort(arr));
      return;
    }
    worker.onmessage = (event) => {
      resolve(event.data.sorted);
    };
    worker.onerror = (error) => {
      reject(error);
    };
    worker.postMessage({ array: arr });
  });
}

function recordStep(arr, highlights = []) {
  if (!currentVisualization) {
    return;
  }
  currentVisualization.steps.push({
    values: arr.slice(),
    highlights: [...highlights],
  });
}

function drawArray(values, highlights = []) {
  const canvas = document.getElementById("sortCanvas");
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  ctx.clearRect(0, 0, width, height);
  const barWidth = width / values.length;
  const max = Math.max(...values, 1);
  values.forEach((value, index) => {
    const barHeight = (value / max) * (height - 20);
    const x = index * barWidth;
    ctx.fillStyle = highlights.includes(index) ? "#f39c12" : "#4caf50";
    ctx.fillRect(x, height - barHeight, barWidth - 1, barHeight);
  });
}

async function animateSteps(steps) {
  if (!steps.length) {
    return;
  }
  const canvas = document.getElementById("sortCanvas");
  canvas.style.display = "block";
  for (let i = 0; i < steps.length; i++) {
    drawArray(steps[i].values, steps[i].highlights);
    await new Promise((resolve) => setTimeout(resolve, 30));
  }
}

function getSelectedAlgorithm() {
  return document.getElementById("algorithmSelect").value;
}

function parseInputArray(text) {
  return text
    .split(",")
    .map((num) => parseFloat(num.trim()))
    .filter((num) => !Number.isNaN(num));
}

async function sortArray() {
  const inputText = document.getElementById("arrayInput").value;
  const array = parseInputArray(inputText);
  const resultEl = document.getElementById("result");
  const canvas = document.getElementById("sortCanvas");
  const visualize = document.getElementById("visualizeCheckbox").checked;
  const algorithm = getSelectedAlgorithm();

  canvas.style.display = "none";
  if (array.length === 0) {
    resultEl.innerHTML = "Please enter valid numbers.";
    return;
  }

  try {
    let sorted;
    if (visualize && array.length > 100) {
      resultEl.innerHTML =
        "Visualization limited to 100 elements. Showing first 100 values.";
    }

    const workingArray = visualize ? array.slice(0, 100) : [...array];
    if (visualize) {
      currentVisualization = { steps: [] };
      switch (algorithm) {
        case "quick":
          quickSort(workingArray);
          break;
        case "parallelQuick":
          quickSort(workingArray);
          break;
        case "merge":
          currentVisualization.sorted = mergeSort(workingArray);
          break;
        case "heap":
          heapSort(workingArray);
          break;
        case "builtIn":
          currentVisualization.sorted = builtInSort(workingArray);
          break;
      }
      if (algorithm === "merge") {
        drawArray(currentVisualization.sorted, []);
      } else if (algorithm === "builtIn") {
        drawArray(currentVisualization.sorted, []);
      }
      await animateSteps(currentVisualization.steps);
      const finalValues = currentVisualization.sorted || workingArray;
      resultEl.innerHTML = `<strong>Sorted Array:</strong> [${finalValues.join(", ")}]`;
      currentVisualization = null;
      return;
    }

    switch (algorithm) {
      case "quick":
        sorted = quickSort([...workingArray]);
        break;
      case "parallelQuick":
        sorted = await parallelQuickSort([...workingArray]);
        break;
      case "merge":
        sorted = mergeSort([...workingArray]);
        break;
      case "heap":
        sorted = heapSort([...workingArray]);
        break;
      case "builtIn":
        sorted = builtInSort([...workingArray]);
        break;
      default:
        throw new Error("Unknown algorithm selected");
    }

    resultEl.innerHTML = `<strong>Sorted Array:</strong> [${sorted.join(", ")}]`;
  } catch (error) {
    resultEl.innerHTML = `<strong>Error:</strong> ${error.message}`;
  }
}
