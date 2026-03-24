import { readStdin } from './lib/stdin.mjs';
import { writeState } from './lib/state.mjs';

async function main() {
  const isError = process.argv.includes('--error');
  try {
    await readStdin(2000);
    writeState(isError ? 'error' : 'happy');
  } catch {}
  process.stdout.write(JSON.stringify({ continue: true }) + '\n');
}
main();
