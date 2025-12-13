const { spawn } = require('node:child_process');

const major = Number.parseInt(process.versions.node.split('.')[0], 10);
if (major >= 17 && !String(process.env.NODE_OPTIONS || '').includes('--openssl-legacy-provider')) {
  process.env.NODE_OPTIONS = `${process.env.NODE_OPTIONS ? `${process.env.NODE_OPTIONS} ` : ''}--openssl-legacy-provider`;
}

const devServerBin = require.resolve('webpack-dev-server/bin/webpack-dev-server.js');
const args = process.argv.slice(2);

const child = spawn(process.execPath, [devServerBin, ...args], { stdio: 'inherit', env: process.env });
child.on('exit', (code) => process.exit(code ?? 1));

