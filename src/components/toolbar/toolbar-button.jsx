import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as SharedStyle from '../../shared-style';

const STYLE = {
  width: '40px',
  height: '40px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '8px',
  fontSize: '20px',
  position: 'relative',
  cursor: 'pointer',
  borderRadius: SharedStyle.RADIUS.lg,
  transition: SharedStyle.TRANSITIONS.normal,
  backgroundColor: 'transparent'
};

const STYLE_HOVER = {
  backgroundColor: SharedStyle.PRIMARY_COLOR.hover
};

const STYLE_ACTIVE = {
  backgroundColor: 'rgba(59, 130, 246, 0.15)',
  boxShadow: SharedStyle.SHADOWS.glow
};

const STYLE_TOOLTIP = {
  position: 'absolute',
  minWidth: '120px',
  maxWidth: '180px',
  color: SharedStyle.COLORS.white,
  background: SharedStyle.PRIMARY_COLOR.surface,
  padding: '8px 12px',
  textAlign: 'center',
  visibility: 'visible',
  borderRadius: SharedStyle.RADIUS.md,
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: SharedStyle.SHADOWS.lg,
  left: '100%',
  top: '50%',
  transform: 'translateY(-50%)',
  marginLeft: '12px',
  zIndex: SharedStyle.Z_INDEX.tooltip,
  fontSize: SharedStyle.TYPOGRAPHY.fontSize.sm,
  fontFamily: SharedStyle.TYPOGRAPHY.fontFamily,
  fontWeight: SharedStyle.TYPOGRAPHY.fontWeight.medium,
  whiteSpace: 'nowrap',
  backdropFilter: 'blur(8px)'
};

const STYLE_TOOLTIP_PIN = {
  position: 'absolute',
  top: '50%',
  right: '100%',
  marginTop: '-6px',
  width: '0',
  height: '0',
  borderRight: `6px solid ${SharedStyle.PRIMARY_COLOR.surface}`,
  borderTop: '6px solid transparent',
  borderBottom: '6px solid transparent'
};

export default class ToolbarButton extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = { active: false };
  }

  render() {
    let { state, props } = this;
    let isHovered = state.active;
    let isActive = props.active;
    
    let color = isActive ? SharedStyle.SECONDARY_COLOR.main : 
                isHovered ? SharedStyle.SECONDARY_COLOR.light : 
                SharedStyle.PRIMARY_COLOR.icon;

    let buttonStyle = {
      ...STYLE,
      ...(isHovered && !isActive ? STYLE_HOVER : {}),
      ...(isActive ? STYLE_ACTIVE : {})
    };

    return (
      <div 
        style={buttonStyle}
        onMouseOver={event => this.setState({ active: true })}
        onMouseOut={event => this.setState({ active: false })}
        onClick={props.onClick}
      >
        <div style={{ 
          color, 
          transition: SharedStyle.TRANSITIONS.fast,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {props.children}
        </div>

        {isHovered && (
          <div style={STYLE_TOOLTIP}>
            <span style={STYLE_TOOLTIP_PIN} />
            {props.tooltip}
          </div>
        )}
      </div>
    )
  }
}

ToolbarButton.propTypes = {
  active: PropTypes.bool.isRequired,
  tooltip: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
};
