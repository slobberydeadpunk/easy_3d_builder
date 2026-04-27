import * as Three from 'three';
import React from 'react';

const bodyMat    = new Three.MeshLambertMaterial({ color: 0x6699BB });
const panelMat   = new Three.MeshLambertMaterial({ color: 0x334466 });
const pipeMat    = new Three.MeshLambertMaterial({ color: 0x444444 });
const indicatorR = new Three.MeshLambertMaterial({ color: 0xCC4444 });
const indicatorG = new Three.MeshLambertMaterial({ color: 0x44BB44 });

export default {
  name: 'kitchen-gas-water-heater',
  prototype: 'items',

  info: {
    tag: ['kitchen', 'appliance', 'heater'],
    title: '燃气热水器',
    description: 'Gas water heater / 燃气热水器',
    image: require('./kitchen-gas-water-heater.png'),
  },

  properties: {
    width:    { label: '宽度 Width',   type: 'length-measure', defaultValue: { length: 35, unit: 'cm' } },
    depth:    { label: '深度 Depth',   type: 'length-measure', defaultValue: { length: 20, unit: 'cm' } },
    height:   { label: '高度 Height',  type: 'length-measure', defaultValue: { length: 65, unit: 'cm' } },
    altitude: { label: '高程 Altitude',type: 'length-measure', defaultValue: { length: 60, unit: 'cm' } },
  },

  render2D: function (element, layer, scene) {
    let w   = element.properties.getIn(['width',  'length']);
    let d   = element.properties.getIn(['depth',  'length']);
    let sel = element.selected;
    let stroke = sel ? '#0096fd' : '#334466';
    let angle = element.rotation + 90;
    let textRotation = Math.sin(angle * Math.PI / 180) < 0 ? 180 : 0;

    // Horizontal heating element lines
    let lines = [];
    for (let i = 1; i <= 4; i++) {
      let y = d * (0.25 + i * 0.12);
      lines.push(<line key={`l${i}`} x1={w * 0.1} y1={y} x2={w * 0.9} y2={y}
                        stroke="#6699BB" strokeWidth="1.5"/>);
    }

    return (
      <g transform={`translate(${-w / 2},${-d / 2})`}>
        {/* Body */}
        <rect x="0" y="0" width={w} height={d} fill="#6699BB" stroke={stroke} strokeWidth="2"/>
        {/* Control panel at top */}
        <rect x={w * 0.05} y={d * 0.05} width={w * 0.9} height={d * 0.25}
              fill="#334466" stroke={stroke} strokeWidth="1"/>
        {/* Indicator lights */}
        <circle cx={w * 0.3} cy={d * 0.175} r={Math.min(w, d) * 0.06} fill="#CC4444"/>
        <circle cx={w * 0.7} cy={d * 0.175} r={Math.min(w, d) * 0.06} fill="#44BB44"/>
        {/* Heating element bands */}
        {lines}
        {/* Water pipe symbol at bottom */}
        <rect x={w * 0.35} y={d * 0.88} width={w * 0.3} height={d * 0.1} fill="#334466"/>
        {/* Label */}
        <text x="0" y="0"
              transform={`translate(${w / 2},${d * 0.6}) scale(1,-1) rotate(${textRotation})`}
              style={{ textAnchor: 'middle', fontSize: '9px', fill: '#E8F0FF' }}>
          热水器
        </text>
      </g>
    );
  },

  render3D: function (element, layer, scene) {
    let w   = element.properties.getIn(['width',  'length']);
    let h   = element.properties.getIn(['height', 'length']);
    let d   = element.properties.getIn(['depth',  'length']);
    let alt = element.properties.getIn(['altitude','length']);

    let obj = new Three.Object3D();

    // Main body
    let body = new Three.Mesh(new Three.BoxGeometry(w, h, d), bodyMat);
    body.position.y = alt + h / 2;
    obj.add(body);

    // Control panel strip at top front
    let panel = new Three.Mesh(new Three.BoxGeometry(w - 2, h * 0.18, 2), panelMat);
    panel.position.set(0, alt + h - (h * 0.18) / 2 - 1, -(d / 2) - 0.5);
    obj.add(panel);

    // Indicator lights on panel
    let indR = new Three.Mesh(new Three.SphereGeometry(2, 8, 8), indicatorR);
    indR.position.set(-w * 0.18, alt + h - (h * 0.18) / 2 - 1, -(d / 2) - 2);
    obj.add(indR);

    let indG = new Three.Mesh(new Three.SphereGeometry(2, 8, 8), indicatorG);
    indG.position.set(w * 0.18, alt + h - (h * 0.18) / 2 - 1, -(d / 2) - 2);
    obj.add(indG);

    // Exhaust flue pipe at top
    let pipe = new Three.Mesh(new Three.CylinderGeometry(5, 5, 18, 12), pipeMat);
    pipe.position.set(0, alt + h + 9, 0);
    obj.add(pipe);

    // Water inlet/outlet pipes at bottom
    let inletL = new Three.Mesh(new Three.CylinderGeometry(2.5, 2.5, 12, 8), pipeMat);
    inletL.rotation.z = Math.PI / 2;
    inletL.position.set(-w * 0.25, alt + h * 0.12, 0);
    obj.add(inletL);

    let inletR = new Three.Mesh(new Three.CylinderGeometry(2.5, 2.5, 12, 8), pipeMat);
    inletR.rotation.z = Math.PI / 2;
    inletR.position.set(w * 0.25, alt + h * 0.12, 0);
    obj.add(inletR);

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
