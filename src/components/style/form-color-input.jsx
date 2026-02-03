import React from 'react';
import * as SharedStyle from '../../shared-style';

const STYLE = {
  padding: '4px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: SharedStyle.RADIUS.md,
  backgroundColor: SharedStyle.PRIMARY_COLOR.input,
  cursor: 'pointer',
  height: '36px',
  width: '100%',
  transition: SharedStyle.TRANSITIONS.fast
};

const EREG_NUMBER = /^.*$/;

export default function FormColorInput({onChange, ...rest}) {
  let onChangeCustom = event => {
    let value = event.target.value;
    if (EREG_NUMBER.test(value)) {
      onChange(event);
    }
  };

  return <input type="color" style={STYLE} onChange={onChangeCustom} autoComplete="off" {...rest}/>;
}
