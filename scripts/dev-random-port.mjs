import { spawn } from "node:child_process";
import net from "node:net";

const MIN_PORT = 3000;
const MAX_PORT = 9000;
const MAX_TRIES = 30;

function randomPort() {
  return Math.floor(Math.random() * (MAX_PORT - MIN_PORT + 1)) + MIN_PORT;
}

function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();

    server.once("error", () => resolve(false));
    server.once("listening", () => {
      server.close(() => resolve(true));
    });

    server.listen(port, "127.0.0.1");
  });
}

async function pickPort() {
  for (let i = 0; i < MAX_TRIES; i += 1) {
    const candidate = randomPort();
    if (await isPortAvailable(candidate)) {
      return candidate;
    }
  }

  return null;
}

const port = await pickPort();

if (!port) {
  console.error("Could not find an available random port.");
  process.exit(1);
}

console.log(`Starting Next.js dev server on random port: ${port}`);

const npxCmd = process.platform === "win32" ? "npx.cmd" : "npx";

const child = spawn(npxCmd, ["next", "dev", "--port", String(port)], {
  stdio: "inherit",
  env: process.env
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
