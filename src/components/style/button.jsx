import React, {Component} from 'react';
import PropTypes from 'prop-types';
import * as SharedStyle from '../../shared-style';

const BASE_STYLE = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  fontFamily: SharedStyle.TYPOGRAPHY.fontFamily,
  fontWeight: SharedStyle.TYPOGRAPHY.fontWeight.medium,
  lineHeight: "1",
  textAlign: "center",
  whiteSpace: "nowrap",
  verticalAlign: "middle",
  cursor: "pointer",
  WebkitUserSelect: "none",
  MozUserSelect: "none",
  MsUserSelect: "none",
  userSelect: "none",
  padding: "10px 16px",
  fontSize: SharedStyle.TYPOGRAPHY.fontSize.sm,
  color: SharedStyle.COLORS.white,
  transition: SharedStyle.TRANSITIONS.normal,
  outline: "none",
  borderRadius: SharedStyle.RADIUS.md,
  borderWidth: "1px",
  borderStyle: "solid",
  width: '100%'
};

const BASE_STYLE_SIZE = {
  small: {
    fontSize: SharedStyle.TYPOGRAPHY.fontSize.xs,
    padding: "6px 12px",
    borderRadius: SharedStyle.RADIUS.sm,
  },
  normal: {},
  large: {
    fontSize: SharedStyle.TYPOGRAPHY.fontSize.base,
    padding: "12px 24px",
    borderRadius: SharedStyle.RADIUS.lg,
  },
};

export default class Button extends Component {

  constructor(props) {
    super(props);
    this.state = {hover: false, active: false};
  }

  render() {
    let {hover, active} = this.state;
    let {type, style: customStyle, styleHover: customStyleHover, children, size, ...rest} = this.props;
    
    let styleMerged = Object.assign(
      {}, 
      BASE_STYLE, 
      BASE_STYLE_SIZE[size], 
      hover ? customStyleHover : customStyle,
      active ? { transform: 'scale(0.98)' } : {}
    );

    return <button
      type={type}
      onMouseEnter={e => this.setState({hover: true})}
      onMouseLeave={e => this.setState({hover: false, active: false})}
      onMouseDown={e => this.setState({active: true})}
      onMouseUp={e => this.setState({active: false})}
      style={styleMerged}
      {...rest}>{children}</button>
  }
}

Button.defaultProps = {
  type: "button",
  size: "normal",
  style: {
    backgroundColor: SharedStyle.SECONDARY_COLOR.main,
    borderColor: SharedStyle.SECONDARY_COLOR.main,
    color: SharedStyle.COLORS.white,
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)'
  },
  styleHover: {
    backgroundColor: SharedStyle.SECONDARY_COLOR.alt,
    borderColor: SharedStyle.SECONDARY_COLOR.alt,
    color: SharedStyle.COLORS.white,
    boxShadow: '0 2px 6px rgba(59, 130, 246, 0.4)'
  },
};

Button.propTypes = {
  type: PropTypes.string,
  style: PropTypes.object,
  styleHover: PropTypes.object,
  size: PropTypes.oneOf(['large', 'normal', 'small']),
};

