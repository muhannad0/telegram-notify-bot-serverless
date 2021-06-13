#!/usr/bin/env node

const path = require('path')
const es = require('esbuild')

const options = {
  entryPoints: {
    'health-handler/index': './src/functions/health-handler.ts',
    'setwebhook-handler/index': './src/functions/setwebhook-handler.ts',
    'webhook-handler/index': './src/functions/webhook-handler.ts',
  },
  outdir: path.resolve(__dirname, 'build'),
  bundle: true,
  loader: {
    '.html': 'text'
  },
  external: ["aws-sdk"],
  format: "cjs",
  platform: "node",
  target: "node14",
  sourcemap: true,
};

function build() {
  try {
    es.buildSync(options)
  }
  catch (err) {
    process.stderr.write(err.stderr)
    process.exit(1)
  }
}

build()