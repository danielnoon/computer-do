const {
  Worker,
  isMainThread,
  parentPort,
  workerData,
} = require("worker_threads");

const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

if (isMainThread) {
  const buffer = new SharedArrayBuffer(16);
  const view = new Int32Array(buffer);

  Atomics.store(view, 0, 0);

  const worker = new Worker(__filename, { workerData: buffer });

  worker.on("message", (data) => {
    if (data.type === "tick") {
      if (data.value % 100 === 0) {
        Atomics.store(view, 0, 0);
        Atomics.notify(view);
        console.log(`Tick: ${data.value}`);
      }
    } else if (data.type === "input") {
      rl.question("> ", (answer) => {
        Atomics.store(view, 0, 1);
        Atomics.notify(view);
        worker.postMessage({ type: "input", value: answer });
      });
    } else {
      console.log(data);
    }
  });
} else {
  const buffer = workerData;
  const arr = new Int32Array(buffer);
  let tick = 0;

  while (true) {
    if (arr[0] === 0) {
      Atomics.wait(arr, 0, 0);
      parentPort.postMessage({ type: "input" });
      parentPort.postMessage({ type: "resuming" });
    }
    tick += 1;
    parentPort.postMessage({ type: "tick", value: tick });
  }
}
