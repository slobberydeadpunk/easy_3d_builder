import * as Three from 'three';
import React from 'react';

const stoneMat  = new Three.MeshLambertMaterial({ color: 0xC8B89A });
const edgeMat   = new Three.MeshLambertMaterial({ color: 0xDDD0B8 });

export default {
  name: 'kitchen-countertop',
  prototype: 'items',

  info: {
    tag: ['kitchen', 'countertop', 'surface'],
    title: '台面',
    description: 'Kitchen countertop slab / 台面',
    image: require('./kitchen-countertop.png'),
  },

  properties: {
    width:     { label: '宽度 Width',     type: 'length-measure', defaultValue: { length: 120, unit: 'cm' } },
    depth:     { label: '深度 Depth',     type: 'length-measure', defaultValue: { length: 60,  unit: 'cm' } },
    thickness: { label: '厚度 Thickness', type: 'length-measure', defaultValue: { length: 4,   unit: 'cm' } },
    altitude:  { label: '高程 Altitude',  type: 'length-measure', defaultValue: { length: 85,  unit: 'cm' } },
  },

  render2D: function (element, layer, scene) {
    let w   = element.properties.getIn(['width', 'length']);
    let d   = element.properties.getIn(['depth', 'length']);
    let sel = element.selected;
    let stroke = sel ? '#0096fd' : '#8A7A6A';
    let angle = element.rotation + 90;
    let textRotation = Math.sin(angle * Math.PI / 180) < 0 ? 180 : 0;

    // Stone vein lines
    let veins = [];
    for (let i = 0; i < 4; i++) {
      let y = d * (0.2 + i * 0.18);
      veins.push(<line key={`v${i}`} x1={w * 0.05} y1={y} x2={w * 0.85} y2={y + d * 0.06}
                       stroke="#B8A890" strokeWidth="0.8"/>);
    }

    return (
      <g transform={`translate(${-w / 2},${-d / 2})`}>
        {/* Slab fill */}
        <rect x="0" y="0" width={w} height={d} fill="#D4C4AE" stroke={stroke} strokeWidth="2"/>
        {/* Stone veins */}
        {veins}
        {/* Front edge highlight */}
        <rect x="0" y={d - 5} width={w} height="5" fill="#E0D0BC"/>
        {/* Label */}
        <text x="0" y="0"
              transform={`translate(${w / 2},${d * 0.48}) scale(1,-1) rotate(${textRotation})`}
              style={{ textAnchor: 'middle', fontSize: '11px', fill: '#7A6A55' }}>
          台面
        </text>
      </g>
    );
  },

  render3D: function (element, layer, scene) {
    let w   = element.properties.getIn(['width',     'length']);
    let d   = element.properties.getIn(['depth',     'length']);
    let t   = element.properties.getIn(['thickness', 'length']);
    let alt = element.properties.getIn(['altitude',  'length']);

    let obj = new Three.Object3D();

    // Main slab
    let slab = new Three.Mesh(new Three.BoxGeometry(w, t, d), stoneMat);
    slab.position.y = alt + t / 2;
    obj.add(slab);

    // Front edge strip (slightly lighter)
    let edge = new Three.Mesh(new Three.BoxGeometry(w, t + 2, 2), edgeMat);
    edge.position.set(0, alt + (t + 2) / 2, -(d / 2) - 0.5);
    obj.add(edge);

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
