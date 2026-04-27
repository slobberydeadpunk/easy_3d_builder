import * as Three from 'three';
import React from 'react';

const SINK_HEIGHT = 22; // fixed basin depth in cm

const steelMat   = new Three.MeshLambertMaterial({ color: 0xAAAAAA });
const basinMat   = new Three.MeshLambertMaterial({ color: 0x888888 });
const faucetMat  = new Three.MeshLambertMaterial({ color: 0xCCCCCC });
const drainMat   = new Three.MeshLambertMaterial({ color: 0x555555 });

export default {
  name: 'kitchen-sink',
  prototype: 'items',

  info: {
    tag: ['kitchen', 'sink', 'appliance'],
    title: '水槽',
    description: 'Kitchen sink / 水槽',
    image: require('./kitchen-sink.png'),
  },

  properties: {
    width:    { label: '宽度 Width',   type: 'length-measure', defaultValue: { length: 80, unit: 'cm' } },
    depth:    { label: '深度 Depth',   type: 'length-measure', defaultValue: { length: 50, unit: 'cm' } },
    altitude: { label: '高程 Altitude',type: 'length-measure', defaultValue: { length: 85, unit: 'cm' } },
  },

  render2D: function (element, layer, scene) {
    let w   = element.properties.getIn(['width', 'length']);
    let d   = element.properties.getIn(['depth', 'length']);
    let sel = element.selected;
    let stroke = sel ? '#0096fd' : '#777799';
    let angle = element.rotation + 90;
    let textRotation = Math.sin(angle * Math.PI / 180) < 0 ? 180 : 0;

    let basinW = w * 0.80, basinD = d * 0.72;
    let bx = (w - basinW) / 2, by = (d - basinD) / 2;

    return (
      <g transform={`translate(${-w / 2},${-d / 2})`}>
        {/* Outer rim */}
        <rect x="0" y="0" width={w} height={d} fill="#C8C8D8" stroke={stroke} strokeWidth="2"/>
        {/* Basin inset */}
        <rect x={bx} y={by} width={basinW} height={basinD}
              fill="#999999" stroke={stroke} strokeWidth="1.5"/>
        {/* Drain circle */}
        <circle cx={w / 2} cy={d / 2} r={Math.min(w, d) * 0.07} fill="#666688"/>
        <line x1={w/2 - d*0.06} y1={d/2} x2={w/2 + d*0.06} y2={d/2} stroke="#444" strokeWidth="1"/>
        <line x1={w/2} y1={d/2 - d*0.06} x2={w/2} y2={d/2 + d*0.06} stroke="#444" strokeWidth="1"/>
        {/* Faucet base at back */}
        <ellipse cx={w / 2} cy={by * 0.5} rx={w * 0.06} ry={d * 0.04} fill="#AAAACC"/>
        {/* Label */}
        <text x="0" y="0"
              transform={`translate(${w / 2},${d * 0.48}) scale(1,-1) rotate(${textRotation})`}
              style={{ textAnchor: 'middle', fontSize: '11px', fill: '#555577' }}>
          水槽
        </text>
      </g>
    );
  },

  render3D: function (element, layer, scene) {
    let w   = element.properties.getIn(['width',  'length']);
    let d   = element.properties.getIn(['depth',  'length']);
    let alt = element.properties.getIn(['altitude','length']);
    let h   = SINK_HEIGHT;
    let t   = 3; // wall thickness

    let obj = new Three.Object3D();

    // Build open-top basin from 5 slabs (bottom + 4 walls)
    // Bottom
    let bottom = new Three.Mesh(new Three.BoxGeometry(w, t, d), steelMat);
    bottom.position.y = alt + t / 2;
    obj.add(bottom);

    // Left wall
    let wallL = new Three.Mesh(new Three.BoxGeometry(t, h, d), steelMat);
    wallL.position.set(-(w / 2) + t / 2, alt + h / 2, 0);
    obj.add(wallL);

    // Right wall
    let wallR = new Three.Mesh(new Three.BoxGeometry(t, h, d), steelMat);
    wallR.position.set(w / 2 - t / 2, alt + h / 2, 0);
    obj.add(wallR);

    // Back wall
    let wallBack = new Three.Mesh(new Three.BoxGeometry(w, h, t), steelMat);
    wallBack.position.set(0, alt + h / 2, d / 2 - t / 2);
    obj.add(wallBack);

    // Front wall (shorter — leaves gap at top for rim visibility)
    let wallFront = new Three.Mesh(new Three.BoxGeometry(w, h, t), steelMat);
    wallFront.position.set(0, alt + h / 2, -(d / 2) + t / 2);
    obj.add(wallFront);

    // Top rim
    let rim = new Three.Mesh(new Three.BoxGeometry(w + 4, t, d + 4), faucetMat);
    rim.position.y = alt + h + t / 2;
    obj.add(rim);

    // Drain
    let drain = new Three.Mesh(new Three.CylinderGeometry(4, 4, t + 1, 12), drainMat);
    drain.position.set(0, alt + t / 2, 0);
    obj.add(drain);

    // Faucet base
    let faucetBase = new Three.Mesh(new Three.CylinderGeometry(3, 3, 6, 8), faucetMat);
    faucetBase.position.set(0, alt + h + t + 3, d / 2 - 8);
    obj.add(faucetBase);

    // Faucet spout (horizontal cylinder)
    let spout = new Three.Mesh(new Three.CylinderGeometry(1.5, 1.5, w * 0.25, 8), faucetMat);
    spout.rotation.x = Math.PI / 2;
    spout.position.set(0, alt + h + t + 10, d / 2 - 8 - w * 0.12);
    obj.add(spout);

    if (element.selected) {
      let bbox = new Three.BoxHelper(obj, 0x99c3fb);
      bbox.material.linewidth = 5;
      bbox.renderOrder = 1000;
      bbox.material.depthTest = false;
      obj.add(bbox);
    }

    return Promise.resolve(obj);
  },
};
