import { readStdin } from './lib/stdin.mjs';
import { writeState } from './lib/state.mjs';

async function main() {
  try {
    await readStdin(2000);
    writeState('thinking');
  } catch {}
  process.stdout.write(JSON.stringify({ continue: true }) + '\n');
}
main();
