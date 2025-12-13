const { spawn } = require('node:child_process');

const major = Number.parseInt(process.versions.node.split('.')[0], 10);
if (major >= 17 && !String(process.env.NODE_OPTIONS || '').includes('--openssl-legacy-provider')) {
  process.env.NODE_OPTIONS = `${process.env.NODE_OPTIONS ? `${process.env.NODE_OPTIONS} ` : ''}--openssl-legacy-provider`;
}

const webpackBin = require.resolve('webpack/bin/webpack.js');
const args = process.argv.slice(2);

const child = spawn(process.execPath, [webpackBin, ...args], { stdio: 'inherit', env: process.env });
child.on('exit', (code) => process.exit(code ?? 1));

