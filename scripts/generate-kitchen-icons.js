#!/usr/bin/env node
'use strict';
/**
 * Generates 128×128 PNG icons for all kitchen catalog items.
 * Uses only Node.js built-ins (zlib) — no external dependencies.
 */

const fs   = require('fs');
const path = require('path');
const zlib = require('zlib');

// ── PNG encoder ────────────────────────────────────────────────────────────────

function crc32(buf) {
  const T = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) ? 0xEDB88320 ^ (c >>> 1) : (c >>> 1);
    T[n] = c;
  }
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) crc = T[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
  return (~crc) >>> 0;
}

function pngChunk(type, data) {
  const tb = Buffer.from(type, 'ascii');
  const lb = Buffer.allocUnsafe(4); lb.writeUInt32BE(data.length, 0);
  const cb = Buffer.allocUnsafe(4); cb.writeUInt32BE(crc32(Buffer.concat([tb, data])), 0);
  return Buffer.concat([lb, tb, data, cb]);
}

function encodePNG(W, H, rgb) {
  // Build raw scanlines: filter-byte(0) + RGB row
  const raw = Buffer.allocUnsafe(H * (1 + W * 3));
  for (let y = 0; y < H; y++) {
    raw[y * (1 + W * 3)] = 0;
    Buffer.from(rgb).copy(raw, y * (1 + W * 3) + 1, y * W * 3, (y + 1) * W * 3);
  }
  const ihdr = Buffer.allocUnsafe(13);
  ihdr.writeUInt32BE(W, 0); ihdr.writeUInt32BE(H, 4);
  ihdr[8] = 8; ihdr[9] = 2; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', zlib.deflateSync(raw)),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}

// ── Drawing helpers ─────────────────────────────────────────────────────────────

function sp(p, W, x, y, r, g, b) {
  x = Math.round(x); y = Math.round(y);
  if (x < 0 || x >= W || y < 0 || y >= W) return;
  const o = (y * W + x) * 3; p[o] = r; p[o + 1] = g; p[o + 2] = b;
}
function fillRect(p, W, x, y, w, h, r, g, b) {
  for (let dy = 0; dy < h; dy++) for (let dx = 0; dx < w; dx++) sp(p, W, x+dx, y+dy, r, g, b);
}
function strokeRect(p, W, x, y, w, h, r, g, b, t = 3) {
  for (let i = 0; i < t; i++) {
    for (let dx = 0; dx < w; dx++) { sp(p, W, x+dx, y+i, r, g, b); sp(p, W, x+dx, y+h-1-i, r, g, b); }
    for (let dy = 0; dy < h; dy++) { sp(p, W, x+i, y+dy, r, g, b); sp(p, W, x+w-1-i, y+dy, r, g, b); }
  }
}
function fillCircle(p, W, cx, cy, rad, r, g, b) {
  for (let dy = -rad; dy <= rad; dy++) for (let dx = -rad; dx <= rad; dx++)
    if (dx*dx + dy*dy <= rad*rad) sp(p, W, cx+dx, cy+dy, r, g, b);
}
function hLine(p, W, x, y, len, r, g, b, t = 2) {
  for (let i = 0; i < t; i++) for (let dx = 0; dx < len; dx++) sp(p, W, x+dx, y+i, r, g, b);
}
function vLine(p, W, x, y, len, r, g, b, t = 2) {
  for (let i = 0; i < t; i++) for (let dy = 0; dy < len; dy++) sp(p, W, x+i, y+dy, r, g, b);
}

// ── Icon definitions (128×128) ──────────────────────────────────────────────────

const SIZE = 128;

const icons = {

  'kitchen-base-cabinet': (p) => {
    // Background: warm wood
    fillRect(p, SIZE, 0, 0, SIZE, SIZE, 160, 120, 90);
    // Inner door panel (lighter)
    fillRect(p, SIZE, 10, 10, SIZE-20, SIZE-20, 200, 168, 130);
    // Center vertical divider
    vLine(p, SIZE, SIZE/2-1, 10, SIZE-20, 90, 59, 30, 2);
    // Left door handle (small dark rect)
    fillRect(p, SIZE, SIZE/2-18, SIZE/2-5, 12, 10, 80, 55, 30);
    // Right door handle
    fillRect(p, SIZE, SIZE/2+6,  SIZE/2-5, 12, 10, 80, 55, 30);
    // Toe kick strip at bottom
    fillRect(p, SIZE, 0, SIZE-14, SIZE, 14, 120, 85, 55);
    // Border
    strokeRect(p, SIZE, 0, 0, SIZE, SIZE, 70, 44, 20, 3);
  },

  'kitchen-wall-cabinet': (p) => {
    // Background: lighter wood (wall cabinets are often lighter)
    fillRect(p, SIZE, 0, 0, SIZE, SIZE, 196, 168, 130);
    // Inner door panel
    fillRect(p, SIZE, 10, 10, SIZE-20, SIZE-20, 220, 200, 168);
    // Center vertical divider
    vLine(p, SIZE, SIZE/2-1, 10, SIZE-20, 122, 92, 58, 2);
    // Left door handle
    fillRect(p, SIZE, SIZE/2-16, SIZE/2-4, 10, 8, 100, 72, 44);
    // Right door handle
    fillRect(p, SIZE, SIZE/2+6,  SIZE/2-4, 10, 8, 100, 72, 44);
    // Dashed top edge (indicates wall-mounted)
    for (let x = 4; x < SIZE-4; x += 10) hLine(p, SIZE, x, 4, 5, 122, 92, 58, 2);
    strokeRect(p, SIZE, 0, 0, SIZE, SIZE, 100, 72, 44, 3);
  },

  'kitchen-countertop': (p) => {
    // Background: stone beige
    fillRect(p, SIZE, 0, 0, SIZE, SIZE, 212, 196, 174);
    // Diagonal veining lines (stone texture)
    for (let i = -SIZE; i < SIZE*2; i += 18) {
      for (let s = 0; s <= SIZE*1.5; s++) {
        const x = Math.round(i + s * 0.6);
        const y = Math.round(s);
        sp(p, SIZE, x, y, 190, 174, 150);
      }
    }
    // Horizontal depth lines
    for (let y = 20; y < SIZE-5; y += 25) hLine(p, SIZE, 8, y, SIZE-16, 180, 162, 138, 1);
    // Front edge highlight
    fillRect(p, SIZE, 0, SIZE-10, SIZE, 10, 230, 218, 200);
    strokeRect(p, SIZE, 0, 0, SIZE, SIZE, 138, 122, 106, 3);
  },

  'kitchen-cooktop': (p) => {
    // Background: dark metal
    fillRect(p, SIZE, 0, 0, SIZE, SIZE, 42, 42, 42);
    // Control knob row at top
    fillRect(p, SIZE, 8, 8, SIZE-16, 18, 60, 60, 60);
    for (let kx = 20; kx < SIZE-10; kx += 22) fillCircle(p, SIZE, kx, 17, 5, 100, 100, 100);
    // 4 burner positions: TL, TR, BL, BR
    const burners = [[34, 56], [94, 56], [34, 100], [94, 100]];
    for (const [cx, cy] of burners) {
      fillCircle(p, SIZE, cx, cy, 20, 80, 80, 80);   // outer ring
      fillCircle(p, SIZE, cx, cy, 13, 42, 42, 42);   // middle hollow
      fillCircle(p, SIZE, cx, cy,  6, 110, 110, 110); // center cap
    }
    // Cross grid lines between burners
    hLine(p, SIZE, 10, SIZE/2+2, SIZE-20, 60, 60, 60, 1);
    vLine(p, SIZE, SIZE/2-1, 34, 90, 60, 60, 60, 1);
    strokeRect(p, SIZE, 0, 0, SIZE, SIZE, 100, 100, 100, 2);
  },

  'kitchen-gas-water-heater': (p) => {
    // Background: steel blue
    fillRect(p, SIZE, 0, 0, SIZE, SIZE, 102, 153, 187);
    // Control panel at top (dark strip)
    fillRect(p, SIZE, 8, 8, SIZE-16, 28, 51, 85, 120);
    // Two indicator circles in panel
    fillCircle(p, SIZE, 40,  22, 7, 200, 220, 240);
    fillCircle(p, SIZE, 88, 22, 7, 200, 100, 80);
    // Horizontal heating element bands
    for (let y = 46; y < SIZE-20; y += 14) {
      fillRect(p, SIZE, 8, y, SIZE-16, 8, 130, 170, 200);
    }
    // Bottom water pipe outlet
    fillRect(p, SIZE, SIZE/2-8, SIZE-16, 16, 12, 70, 105, 140);
    strokeRect(p, SIZE, 0, 0, SIZE, SIZE, 51, 85, 120, 3);
  },

  'kitchen-sink': (p) => {
    // Background: stainless steel
    fillRect(p, SIZE, 0, 0, SIZE, SIZE, 200, 200, 216);
    // Sink basin (inset)
    fillRect(p, SIZE, 14, 14, SIZE-28, SIZE-28, 140, 140, 160);
    // Basin inner highlight
    fillRect(p, SIZE, 18, 18, SIZE-36, SIZE-36, 160, 160, 178);
    // Drain circle
    fillCircle(p, SIZE, SIZE/2, SIZE/2, 11, 100, 100, 120);
    fillCircle(p, SIZE, SIZE/2, SIZE/2,  6, 70,  70,  90);
    // Drain cross mark
    hLine(p, SIZE, SIZE/2-5, SIZE/2-1, 10, 50, 50, 70, 2);
    vLine(p, SIZE, SIZE/2-1, SIZE/2-5, 10, 50, 50, 70, 2);
    // Faucet base at top edge
    fillRect(p, SIZE, SIZE/2-9, 5, 18, 13, 160, 160, 180);
    fillCircle(p, SIZE, SIZE/2, 11, 5, 180, 180, 200);
    strokeRect(p, SIZE, 14, 14, SIZE-28, SIZE-28, 120, 120, 145, 2);
    strokeRect(p, SIZE, 0, 0, SIZE, SIZE, 100, 100, 140, 3);
  },

  'kitchen-range-hood': (p) => {
    // Background: gunmetal gray
    fillRect(p, SIZE, 0, 0, SIZE, SIZE, 112, 112, 112);
    // LED light strip at bottom
    fillRect(p, SIZE, 8, SIZE-16, SIZE-16, 10, 255, 248, 220);
    // Ventilation grille (horizontal slots)
    for (let y = 16; y < SIZE-22; y += 14) {
      fillRect(p, SIZE, 12, y, SIZE-24, 7, 72, 72, 72);
    }
    // Central duct circle at top
    fillCircle(p, SIZE, SIZE/2, 22, 18, 80, 80, 80);
    fillCircle(p, SIZE, SIZE/2, 22, 11, 130, 130, 130);
    fillCircle(p, SIZE, SIZE/2, 22,  5, 60, 60, 60);
    strokeRect(p, SIZE, 0, 0, SIZE, SIZE, 60, 60, 60, 3);
  },
};

// ── Write files ─────────────────────────────────────────────────────────────────

const itemsDir = path.resolve(__dirname, '../demo/src/catalog/items');

for (const [name, drawFn] of Object.entries(icons)) {
  const dir = path.join(itemsDir, name);
  fs.mkdirSync(dir, { recursive: true });

  const p = new Uint8Array(SIZE * SIZE * 3);
  drawFn(p);

  const png = encodePNG(SIZE, SIZE, p);
  const outPath = path.join(dir, `${name}.png`);
  fs.writeFileSync(outPath, png);
  console.log(`✓  ${name}.png`);
}

console.log('\nAll 7 kitchen icons generated successfully.');
