#!/usr/bin/env node
'use strict';
/**
 * Claude Cat - Cross-platform hook runner (run.cjs)
 * Based on OMC run.cjs pattern.
 */

const { spawnSync } = require('child_process');
const { existsSync, realpathSync } = require('fs');
const { join, dirname } = require('path');

const target = process.argv[2];
if (!target) {
  process.exit(0);
}

function resolveTarget(targetPath) {
  if (existsSync(targetPath)) return targetPath;

  try {
    const resolved = realpathSync(targetPath);
    if (existsSync(resolved)) return resolved;
  } catch {}

  try {
    const pluginRoot = process.env.CLAUDE_PLUGIN_ROOT;
    if (!pluginRoot) return null;

    const cacheBase = dirname(pluginRoot);
    const scriptRelative = targetPath.slice(pluginRoot.length);

    if (!scriptRelative || !existsSync(cacheBase)) return null;

    const { readdirSync } = require('fs');
    const entries = readdirSync(cacheBase).filter(v => /^\d+\.\d+\.\d+/.test(v));

    entries.sort((a, b) => {
      const pa = a.split('.').map(Number);
      const pb = b.split('.').map(Number);
      for (let i = 0; i < 3; i++) {
        if ((pa[i] || 0) !== (pb[i] || 0)) return (pb[i] || 0) - (pa[i] || 0);
      }
      return 0;
    });

    for (const version of entries) {
      const candidate = join(cacheBase, version) + scriptRelative;
      if (existsSync(candidate)) return candidate;
    }
  } catch {}

  return null;
}

const resolved = resolveTarget(target);
if (!resolved) {
  process.exit(0);
}

const result = spawnSync(
  process.execPath,
  [resolved, ...process.argv.slice(3)],
  {
    stdio: 'inherit',
    env: process.env,
    windowsHide: true,
  }
);

process.exit(result.status ?? 0);
