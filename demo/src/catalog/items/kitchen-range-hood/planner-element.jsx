import * as Three from 'three';
import React from 'react';

const hoodMat  = new Three.MeshLambertMaterial({ color: 0x888888 });
const darkMat  = new Three.MeshLambertMaterial({ color: 0x555555 });
const lightMat = new Three.MeshLambertMaterial({ color: 0xFFFFDD });
const ductMat  = new Three.MeshLambertMaterial({ color: 0x666666 });

export default {
  name: 'kitchen-range-hood',
  prototype: 'items',

  info: {
    tag: ['kitchen', 'appliance', 'rangehood'],
    title: '油烟机',
    description: 'Kitchen range hood / 油烟机',
    image: require('./kitchen-range-hood.png'),
  },

  properties: {
    width:    { label: '宽度 Width',   type: 'length-measure', defaultValue: { length: 90,  unit: 'cm' } },
    depth:    { label: '深度 Depth',   type: 'length-measure', defaultValue: { length: 50,  unit: 'cm' } },
    height:   { label: '高度 Height',  type: 'length-measure', defaultValue: { length: 60,  unit: 'cm' } },
    altitude: { label: '高程 Altitude',type: 'length-measure', defaultValue: { length: 185, unit: 'cm' } },
  },

  render2D: function (element, layer, scene) {
    let w   = element.properties.getIn(['width', 'length']);
    let d   = element.properties.getIn(['depth', 'length']);
    let sel = element.selected;
    let stroke = sel ? '#0096fd' : '#555555';
    let angle = element.rotation + 90;
    let textRotation = Math.sin(angle * Math.PI / 180) < 0 ? 180 : 0;

    // Vent grille slots
    let slots = [];
    for (let i = 0; i < 4; i++) {
      let y = d * (0.22 + i * 0.14);
      slots.push(<rect key={`s${i}`} x={w * 0.1} y={y} width={w * 0.8} height={d * 0.07}
                       fill="#444444"/>);
    }

    return (
      <g transform={`translate(${-w / 2},${-d / 2})`}>
        {/* Hood body */}
        <rect x="0" y="0" width={w} height={d} fill="#888888" stroke={stroke} strokeWidth="2"/>
        {/* Ventilation slots */}
        {slots}
        {/* Central duct circle */}
        <circle cx={w / 2} cy={d * 0.13} r={Math.min(w, d) * 0.09} fill="#666" stroke="#444" strokeWidth="1.5"/>
        <circle cx={w / 2} cy={d * 0.13} r={Math.min(w, d) * 0.05} fill="#888"/>
        {/* LED light strip at front bottom */}
        <rect x={w * 0.05} y={d * 0.88} width={w * 0.9} height={d * 0.08} fill="#FFFFCC" opacity="0.8"/>
        {/* Label */}
        <text x="0" y="0"
              transform={`translate(${w / 2},${d * 0.7}) scale(1,-1) rotate(${textRotation})`}
              style={{ textAnchor: 'middle', fontSize: '10px', fill: '#DDD' }}>
          油烟机
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

    // Main hood canopy (lower, wider section)
    let canopy = new Three.Mesh(new Three.BoxGeometry(w, h * 0.45, d), hoodMat);
    canopy.position.y = alt + h * 0.225;
    obj.add(canopy);

    // Transition body (upper, narrower section)
    let body = new Three.Mesh(new Three.BoxGeometry(w * 0.55, h * 0.35, d * 0.6), darkMat);
    body.position.y = alt + h * 0.45 + h * 0.175;
    obj.add(body);

    // Vent grille panel on bottom of canopy
    let grille = new Three.Mesh(new Three.BoxGeometry(w - 4, 2, d - 4), darkMat);
    grille.position.y = alt + 1;
    obj.add(grille);

    // LED light strip (front bottom edge)
    let light = new Three.Mesh(new Three.BoxGeometry(w * 0.85, 3, 4), lightMat);
    light.position.set(0, alt + 4, -(d / 2) - 1);
    obj.add(light);

    // Exhaust duct cylinder going upward
    let duct = new Three.Mesh(new Three.CylinderGeometry(8, 10, h * 0.2, 12), ductMat);
    duct.position.y = alt + h * 0.8 + h * 0.1;
    obj.add(duct);

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
