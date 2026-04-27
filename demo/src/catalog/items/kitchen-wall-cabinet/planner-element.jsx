import * as Three from 'three';
import React from 'react';

const bodyMat   = new Three.MeshLambertMaterial({ color: 0xC4A882 });
const panelMat  = new Three.MeshLambertMaterial({ color: 0xD8CAA8 });
const handleMat = new Three.MeshLambertMaterial({ color: 0x555555 });
const mountMat  = new Three.MeshLambertMaterial({ color: 0x888888 });

export default {
  name: 'kitchen-wall-cabinet',
  prototype: 'items',

  info: {
    tag: ['kitchen', 'cabinet', 'furniture'],
    title: '吊柜',
    description: 'Kitchen wall cabinet / 吊柜',
    image: require('./kitchen-wall-cabinet.png'),
  },

  properties: {
    width:    { label: '宽度 Width',   type: 'length-measure', defaultValue: { length: 60,  unit: 'cm' } },
    depth:    { label: '深度 Depth',   type: 'length-measure', defaultValue: { length: 35,  unit: 'cm' } },
    height:   { label: '高度 Height',  type: 'length-measure', defaultValue: { length: 70,  unit: 'cm' } },
    altitude: { label: '高程 Altitude',type: 'length-measure', defaultValue: { length: 155, unit: 'cm' } },
  },

  render2D: function (element, layer, scene) {
    let w   = element.properties.getIn(['width',  'length']);
    let d   = element.properties.getIn(['depth',  'length']);
    let sel = element.selected;
    let stroke = sel ? '#0096fd' : '#7A5C3A';
    let angle = element.rotation + 90;
    let textRotation = Math.sin(angle * Math.PI / 180) < 0 ? 180 : 0;

    // Dashes for top edge (wall-mounting indicator)
    let dashes = [];
    for (let x = 4; x < w - 4; x += 9) {
      dashes.push(<line key={`d${x}`} x1={x} y1={3} x2={x + 5} y2={3} stroke={stroke} strokeWidth="2"/>);
    }

    return (
      <g transform={`translate(${-w / 2},${-d / 2})`}>
        {/* Cabinet body */}
        <rect x="0" y="0" width={w} height={d} fill="#D4BC98" stroke={stroke} strokeWidth="2"/>
        {/* Door panel inset */}
        <rect x={w * 0.06} y={d * 0.08} width={w * 0.88} height={d * 0.84}
              fill="#E0CEAC" stroke={stroke} strokeWidth="1"/>
        {/* Center door divider */}
        <line x1={w / 2} y1={d * 0.08} x2={w / 2} y2={d * 0.92} stroke={stroke} strokeWidth="1"/>
        {/* Handles */}
        <rect x={w / 2 - 10} y={d / 2 - 3} width={7} height={6} fill="#777" rx="1.5"/>
        <rect x={w / 2 + 3}  y={d / 2 - 3} width={7} height={6} fill="#777" rx="1.5"/>
        {/* Dashed wall indicator at top */}
        {dashes}
        {/* Label */}
        <text x="0" y="0"
              transform={`translate(${w / 2},${d * 0.48}) scale(1,-1) rotate(${textRotation})`}
              style={{ textAnchor: 'middle', fontSize: '11px', fill: '#7A5C3A' }}>
          吊柜
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

    // Cabinet body
    let body = new Three.Mesh(new Three.BoxGeometry(w, h, d), bodyMat);
    body.position.y = alt + h / 2;
    obj.add(body);

    // Front panel / doors
    let panel = new Three.Mesh(new Three.BoxGeometry(w - 4, h - 6, 3), panelMat);
    panel.position.set(0, alt + h / 2, -(d / 2) - 0.5);
    obj.add(panel);

    // Left door handle
    let handleL = new Three.Mesh(new Three.CylinderGeometry(1.5, 1.5, w * 0.28, 8), handleMat);
    handleL.rotation.z = Math.PI / 2;
    handleL.position.set(-w * 0.15, alt + h * 0.5, -(d / 2) - 2.5);
    obj.add(handleL);

    // Right door handle
    let handleR = new Three.Mesh(new Three.CylinderGeometry(1.5, 1.5, w * 0.28, 8), handleMat);
    handleR.rotation.z = Math.PI / 2;
    handleR.position.set(w * 0.15, alt + h * 0.5, -(d / 2) - 2.5);
    obj.add(handleR);

    // Wall mounting bracket (back top edge)
    let bracket = new Three.Mesh(new Three.BoxGeometry(w, 5, 5), mountMat);
    bracket.position.set(0, alt + h - 2.5, d / 2 - 2.5);
    obj.add(bracket);

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
