import React from 'react';
import ReactRange from '@mapbox/react-range';
import FormTextInput from './form-text-input';
import * as SharedStyle from '../../shared-style';

const containerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: SharedStyle.SPACING.md
};

const sliderContainerStyle = {
  flex: 1,
  display: 'flex',
  alignItems: 'center'
};

const sliderStyle = { 
  display: 'block', 
  width: '100%', 
  height: '36px',
  cursor: 'pointer'
};

const textContainerStyle = {
  width: '70px',
  flexShrink: 0
};

const textStyle = {
  height: '36px', 
  textAlign: 'center',
  fontFamily: SharedStyle.TYPOGRAPHY.fontFamilyMono
};

export default function FormNumberInput({value, onChange, ...rest}) {
  return (
    <div style={containerStyle}>
      <div style={sliderContainerStyle}>
        <ReactRange type='range' style={sliderStyle} onChange={onChange} value={value} {...rest}/>
      </div>

      <div style={textContainerStyle}>
        <FormTextInput value={value} onChange={onChange} style={textStyle}/>
      </div>
    </div>
  )
}
