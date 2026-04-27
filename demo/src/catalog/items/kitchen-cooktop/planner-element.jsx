import * as Three from 'three';
import React from 'react';

const PLATE_HEIGHT = 5;   // fixed cooktop thickness in cm

const plateMat  = new Three.MeshLambertMaterial({ color: 0x2A2A2A });
const burnerMat = new Three.MeshLambertMaterial({ color: 0x555555 });
const ringMat   = new Three.MeshLambertMaterial({ color: 0x888888 });
const knobMat   = new Three.MeshLambertMaterial({ color: 0x333333 });

export default {
  name: 'kitchen-cooktop',
  prototype: 'items',

  info: {
    tag: ['kitchen', 'appliance', 'cooktop'],
    title: '灶具',
    description: 'Gas / induction cooktop / 灶具',
    image: require('./kitchen-cooktop.png'),
  },

  properties: {
    width:    { label: '宽度 Width',   type: 'length-measure', defaultValue: { length: 75, unit: 'cm' } },
    depth:    { label: '深度 Depth',   type: 'length-measure', defaultValue: { length: 45, unit: 'cm' } },
    altitude: { label: '高程 Altitude',type: 'length-measure', defaultValue: { length: 89, unit: 'cm' } },
  },

  render2D: function (element, layer, scene) {
    let w   = element.properties.getIn(['width', 'length']);
    let d   = element.properties.getIn(['depth', 'length']);
    let sel = element.selected;
    let stroke = sel ? '#0096fd' : '#222';
    let angle = element.rotation + 90;
    let textRotation = Math.sin(angle * Math.PI / 180) < 0 ? 180 : 0;

    // Burner positions (normalized)
    let bx1 = w * 0.28, bx2 = w * 0.72;
    let by1 = d * 0.28, by2 = d * 0.72;
    let br  = Math.min(w, d) * 0.14;

    // Control knob positions at front
    let knobs = [0.2, 0.4, 0.6, 0.8].map((frac, i) => (
      <circle key={`k${i}`} cx={w * frac} cy={d * 0.9} r={d * 0.04} fill="#888" stroke="#555" strokeWidth="1"/>
    ));

    return (
      <g transform={`translate(${-w / 2},${-d / 2})`}>
        {/* Cooktop plate */}
        <rect x="0" y="0" width={w} height={d} fill="#2A2A2A" stroke={stroke} strokeWidth="2"/>
        {/* Knob row at front */}
        <rect x="0" y={d * 0.82} width={w} height={d * 0.18} fill="#333" stroke={stroke} strokeWidth="1"/>
        {knobs}
        {/* 4 burner rings */}
        {[[bx1, by1], [bx2, by1], [bx1, by2], [bx2, by2]].map(([cx, cy], i) => (
          <g key={`b${i}`}>
            <circle cx={cx} cy={cy} r={br}       fill="#555" stroke="#888" strokeWidth="1"/>
            <circle cx={cx} cy={cy} r={br * 0.55} fill="#2A2A2A"/>
            <circle cx={cx} cy={cy} r={br * 0.22} fill="#777"/>
          </g>
        ))}
        {/* Label */}
        <text x="0" y="0"
              transform={`translate(${w / 2},${d * 0.48}) scale(1,-1) rotate(${textRotation})`}
              style={{ textAnchor: 'middle', fontSize: '11px', fill: '#AAA' }}>
          灶具
        </text>
      </g>
    );
  },

  render3D: function (element, layer, scene) {
    let w   = element.properties.getIn(['width',  'length']);
    let d   = element.properties.getIn(['depth',  'length']);
    let alt = element.properties.getIn(['altitude','length']);
    let h   = PLATE_HEIGHT;

    let obj = new Three.Object3D();

    // Cooktop plate
    let plate = new Three.Mesh(new Three.BoxGeometry(w, h, d), plateMat);
    plate.position.y = alt + h / 2;
    obj.add(plate);

    // Control knob bar at front
    let knobBar = new Three.Mesh(new Three.BoxGeometry(w, h + 4, 6), knobMat);
    knobBar.position.set(0, alt + (h + 4) / 2, -(d / 2) - 2);
    obj.add(knobBar);

    // 4 burner torus rings on top surface
    let burnerRadius = Math.min(w * 0.13, d * 0.18);
    let burnerTube   = 2.5;
    const burnerPositions = [
      [-w * 0.23, -d * 0.22],
      [ w * 0.23, -d * 0.22],
      [-w * 0.23,  d * 0.22],
      [ w * 0.23,  d * 0.22],
    ];
    for (const [bx, bz] of burnerPositions) {
      // Outer ring
      let ring = new Three.Mesh(
        new Three.TorusGeometry(burnerRadius, burnerTube, 8, 24),
        ringMat
      );
      ring.rotation.x = Math.PI / 2;
      ring.position.set(bx, alt + h + burnerTube, bz);
      obj.add(ring);

      // Inner cap
      let cap = new Three.Mesh(
        new Three.CylinderGeometry(burnerRadius * 0.45, burnerRadius * 0.45, burnerTube, 12),
        burnerMat
      );
      cap.position.set(bx, alt + h + burnerTube / 2, bz);
      obj.add(cap);
    }

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
