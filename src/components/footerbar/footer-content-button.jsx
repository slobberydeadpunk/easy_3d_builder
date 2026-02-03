import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as SharedStyle from '../../shared-style';
import {FaTimes as IconClose} from 'react-icons/fa';

const labelContainerStyle = {
  width: 'auto',
  display: 'inline-flex',
  alignItems: 'center',
  margin: 0,
  padding: '0px 8px 0px 0px'
};

const toggleButtonStyle = {
  color: SharedStyle.PRIMARY_COLOR.text_muted,
  textAlign: 'center',
  cursor: 'pointer',
  userSelect: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  padding: '4px 8px',
  borderRadius: SharedStyle.RADIUS.sm,
  transition: SharedStyle.TRANSITIONS.fast,
  fontFamily: SharedStyle.TYPOGRAPHY.fontFamily,
  fontSize: SharedStyle.TYPOGRAPHY.fontSize.xs
};

const toggleButtonStyleOver = {
  ...toggleButtonStyle,
  color: SharedStyle.PRIMARY_COLOR.text_main,
  backgroundColor: 'rgba(255, 255, 255, 0.05)'
};

const contentContainerStyleActive = {
  position: 'fixed',
  width: 'calc(100% - 2px)',
  height: '40%',
  left: 0,
  bottom: 20,
  backgroundColor: SharedStyle.PRIMARY_COLOR.surface,
  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
  zIndex: 0,
  padding: 0,
  margin: 0,
  transition: 'all 300ms ease-out',
  boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.5)'
};

const contentContainerStyleInactive = {
  ...contentContainerStyleActive,
  visibility: 'hidden',
  height: 0,
  boxShadow: 'none'
};

const contentHeaderStyle = {
  position: 'relative',
  width: '100%',
  height: '40px',
  top: 0,
  left: 0,
  borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 16px'
};

const titleStyle = {
  fontFamily: SharedStyle.TYPOGRAPHY.fontFamily,
  fontWeight: SharedStyle.TYPOGRAPHY.fontWeight.medium,
  fontSize: SharedStyle.TYPOGRAPHY.fontSize.sm,
  color: SharedStyle.PRIMARY_COLOR.text_main
};

const contentAreaStyle = {
  position: 'relative',
  width: '100%',
  height: 'calc(100% - 40px)',
  padding: SharedStyle.SPACING.lg,
  overflowY: 'auto',
  scrollbarWidth: 'thin',
  scrollbarColor: `${SharedStyle.PRIMARY_COLOR.hover} transparent`
};

const iconCloseStyleOut = {
  width: '32px',
  height: '32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: SharedStyle.RADIUS.md,
  cursor: 'pointer',
  transition: SharedStyle.TRANSITIONS.fast,
  color: SharedStyle.PRIMARY_COLOR.text_muted
};

const iconCloseStyleOver = {
  ...iconCloseStyleOut,
  color: SharedStyle.COLORS.white,
  backgroundColor: SharedStyle.STATUS_COLORS.error
};

const iconStyle = {
  width: '14px',
  height: '14px',
  marginRight: '4px'
};

const textStyle = {
  position: 'relative',
  fontFamily: SharedStyle.TYPOGRAPHY.fontFamilyMono
}

export default class FooterContentButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      over: false,
      closeOver: false,
      active: this.props.toggleState || false
    };
  }

  toggleOver(e) { this.setState({ over: true }); }
  toggleOut(e) { this.setState({ over: false }); }

  toggle(e) {
    let isActive = !this.state.active;
    this.setState({ active: isActive });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if( this.state.over != nextState.over ) return true;
    if( this.state.closeOver != nextState.closeOver ) return true;
    if( this.state.active != nextState.active ) return true;

    if( this.props.content.length != nextProps.content.length ) return true;
    if( this.props.toggleState != nextProps.toggleState ) return true;

    return false;
  }

  componentWillReceiveProps(nextProps) {
    if( nextProps.toggleState != this.props.toggleState  )
      this.state.active = nextProps.toggleState;
  }

  render() {

    let s = this.state;
    let p = this.props;

    let LabelIcon = p.icon || null;
    let labelIconStyle = p.iconStyle || {};
    let labelTextStyle = p.textStyle || {};
    let inputTitleStyle = p.titleStyle || {};

    return (
      <div style={labelContainerStyle}>
        <div
          style={s.over || s.active ? toggleButtonStyleOver : toggleButtonStyle}
          onClick={e => this.toggle(e)}
          title={p.title}
        >
          <LabelIcon style={{...labelIconStyle, ...iconStyle}}/>
          <span style={{...textStyle, ...labelTextStyle}}>{p.text}</span>
        </div>
        <div style={s.active ? contentContainerStyleActive : contentContainerStyleInactive}>
          <div style={contentHeaderStyle}>
            <b style={{...titleStyle, ...inputTitleStyle}}>{p.title}</b>
            <IconClose
              style={ s.closeOver ? iconCloseStyleOver : iconCloseStyleOut}
              onMouseOver={e => this.setState({closeOver:true})}
              onMouseOut={e => this.setState({closeOver:false})}
              onClick={e => this.toggle(e)}
            />
          </div>
          <div style={contentAreaStyle}>
            {p.content}
          </div>
        </div>
      </div>
    );
  }
}

FooterContentButton.propTypes = {
  state: PropTypes.object.isRequired,
  text: PropTypes.string.isRequired,
  textStyle: PropTypes.object,
  icon: PropTypes.func,
  iconStyle: PropTypes.object,
  content: PropTypes.array.isRequired,
  toggleState: PropTypes.bool,
  title: PropTypes.string,
  titleStyle: PropTypes.object
};

FooterContentButton.contextTypes = {
  projectActions: PropTypes.object.isRequired,
  viewer2DActions: PropTypes.object.isRequired,
  viewer3DActions: PropTypes.object.isRequired,
  linesActions: PropTypes.object.isRequired,
  holesActions: PropTypes.object.isRequired,
  itemsActions: PropTypes.object.isRequired,
  translator: PropTypes.object.isRequired,
};
