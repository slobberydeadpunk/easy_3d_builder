import React, { Component } from 'react';
import * as SharedStyle from '../../shared-style';

const STYLE_INPUT = {
  display: 'block',
  width: '100%',
  padding: '8px 12px',
  fontSize: SharedStyle.TYPOGRAPHY.fontSize.sm,
  fontFamily: SharedStyle.TYPOGRAPHY.fontFamily,
  lineHeight: '1.25',
  color: SharedStyle.PRIMARY_COLOR.text_main,
  backgroundColor: SharedStyle.PRIMARY_COLOR.input,
  backgroundImage: 'none',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: SharedStyle.RADIUS.md,
  outline: 'none',
  height: '36px',
  transition: SharedStyle.TRANSITIONS.fast,
  boxSizing: 'border-box'
};

const STYLE_INPUT_FOCUS = {
  border: `1px solid ${SharedStyle.SECONDARY_COLOR.main}`,
  boxShadow: `0 0 0 3px rgba(59, 130, 246, 0.15)`
};

export default class FormTextInput extends Component {

  constructor(props) {
    super(props);
    this.state = { focus: false };
  }

  render() {
    let { style, ...rest } = this.props;
    let { focus } = this.state;

    let textInputStyle = { 
      ...STYLE_INPUT, 
      ...style,
      ...(focus ? STYLE_INPUT_FOCUS : {})
    };

    return <input
      onFocus={e => this.setState({ focus: true })}
      onBlur={e => this.setState({ focus: false })}
      style={textInputStyle}
      type="text"
      {...rest}
    />
  }
}

FormTextInput.defaultProps = {
  style: {}
};
