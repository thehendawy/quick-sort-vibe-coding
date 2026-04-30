// Benchmarking tool for QuickSort performance testing
/**
 * Runs performance tests comparing QuickSort with JavaScript's built-in sort.
 * Tests arrays of various sizes and displays timing results.
 */
function runPerformanceTest() {
  const sizes = [100, 1000, 10000, 50000]; // Array sizes to test
  let results = "<strong>Performance Test Results:</strong><br>";

  sizes.forEach((size) => {
    const arr = Array.from({ length: size }, () =>
      Math.floor(Math.random() * 1000000),
    );

    // QuickSort
    const startQuick = performance.now();
    quickSort([...arr]);
    const endQuick = performance.now();

    // Built-in sort
    const startNative = performance.now();
    [...arr].sort((a, b) => a - b);
    const endNative = performance.now();

    const quickTime = (endQuick - startQuick).toFixed(2);
    const nativeTime = (endNative - startNative).toFixed(2);

    results += `Size ${size}: QuickSort = ${quickTime} ms | Built-in = ${nativeTime} ms<br>`;
  });

  document.getElementById("result").innerHTML = results;
}