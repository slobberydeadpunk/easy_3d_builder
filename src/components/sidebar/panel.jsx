import React, {Component} from 'react';
import PropTypes from 'prop-types';
import * as SharedStyle from '../../shared-style';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';

const STYLE = {
  borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
  userSelect: 'none'
};

const STYLE_TITLE = {
  fontSize: SharedStyle.TYPOGRAPHY.fontSize.sm,
  fontFamily: SharedStyle.TYPOGRAPHY.fontFamily,
  fontWeight: SharedStyle.TYPOGRAPHY.fontWeight.medium,
  color: SharedStyle.PRIMARY_COLOR.text_alt,
  padding: '12px 16px',
  backgroundColor: SharedStyle.PRIMARY_COLOR.alt,
  margin: '0px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  transition: SharedStyle.TRANSITIONS.fast,
  letterSpacing: '0.3px',
  textTransform: 'uppercase'
};

const STYLE_TITLE_HOVER = {
  backgroundColor: SharedStyle.PRIMARY_COLOR.hover
};

const STYLE_CONTENT = {
  fontSize: SharedStyle.TYPOGRAPHY.fontSize.sm,
  fontFamily: SharedStyle.TYPOGRAPHY.fontFamily,
  color: SharedStyle.PRIMARY_COLOR.text_alt,
  padding: '0px',
  backgroundColor: SharedStyle.PRIMARY_COLOR.surface,
  overflow: 'hidden',
  transition: 'max-height 200ms ease-out, opacity 200ms ease-out'
};

const STYLE_ARROW = {
  transition: SharedStyle.TRANSITIONS.fast,
  opacity: 0.6
};

export default class Panel extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      opened: props.hasOwnProperty('opened') ? props.opened : false,
      hover: false
    };
  }

  toggleOpen() {
    this.setState({opened: !this.state.opened});
  }

  toggleHover() {
    this.setState({hover: !this.state.hover});
  }

  render() {

    let { name, headComponents, children } = this.props;
    let { opened, hover } = this.state;

    const titleStyle = {
      ...STYLE_TITLE,
      ...(hover ? STYLE_TITLE_HOVER : {}),
      color: hover ? SharedStyle.SECONDARY_COLOR.light : SharedStyle.PRIMARY_COLOR.text_alt
    };

    const arrowStyle = {
      ...STYLE_ARROW,
      transform: opened ? 'rotate(180deg)' : 'rotate(0deg)',
      opacity: hover ? 1 : 0.6
    };

    return (
      <div style={STYLE}>
        <h3
          style={titleStyle}
          onMouseEnter={() => this.toggleHover()}
          onMouseLeave={() => this.toggleHover()}
          onClick={() => this.toggleOpen()}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {name}
            {headComponents}
          </span>
          <FaAngleDown style={arrowStyle} />
        </h3>

        <div style={{
          ...STYLE_CONTENT, 
          maxHeight: opened ? '2000px' : '0px',
          opacity: opened ? 1 : 0
        }}>
          {children}
        </div>
      </div>
    )
  }
}

Panel.propTypes = {
  name: PropTypes.string.isRequired,
  headComponents: PropTypes.array,
  opened: PropTypes.bool
};
