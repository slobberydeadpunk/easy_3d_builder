import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as SharedStyle from '../../shared-style';

const toggleButtonStyle = {
  minWidth: '5.5em',
  color: SharedStyle.PRIMARY_COLOR.text_muted,
  textAlign: 'center',
  cursor: 'pointer',
  userSelect: 'none',
  border: '1px solid transparent',
  margin: '0 4px',
  padding: '4px 8px',
  borderRadius: SharedStyle.RADIUS.sm,
  display: 'inline-block',
  fontFamily: SharedStyle.TYPOGRAPHY.fontFamily,
  fontSize: SharedStyle.TYPOGRAPHY.fontSize.xs,
  fontWeight: SharedStyle.TYPOGRAPHY.fontWeight.medium,
  transition: SharedStyle.TRANSITIONS.fast,
  backgroundColor: 'transparent'
};

const toggleButtonStyleOver = {
  ...toggleButtonStyle,
  backgroundColor: SharedStyle.SECONDARY_COLOR.main,
  border: '1px solid transparent',
  color: SharedStyle.COLORS.white,
  boxShadow: '0 0 8px rgba(59, 130, 246, 0.3)'
};

export default class FooterToggleButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      over: false,
      active: this.props.toggleState || false
    };
  }

  toggleOver(e) { this.setState({ over: true }); }
  toggleOut(e) { this.setState({ over: false }); }

  toggle(e) {
    let isActive = !this.state.active;
    this.setState({ active: isActive });

    if (isActive)
    {
      this.props.toggleOn();
    }
    else
    {
      this.props.toggleOff();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if( this.state.over != nextState.over ) return true;
    if( this.state.active != nextState.active ) return true;
    if( this.props.toggleState != nextProps.toggleState ) return true;

    return false;
  }

  componentWillReceiveProps(nextProps) {
    if( nextProps.toggleState != this.props.toggleState  )
      this.state.active = nextProps.toggleState;
  }

  render() {

    return (
      <div
        style={this.state.over || this.state.active ? toggleButtonStyleOver : toggleButtonStyle}
        onMouseOver={e => this.toggleOver(e)}
        onMouseOut={e => this.toggleOut(e)}
        onClick={e => this.toggle(e)}
        title={this.props.title}
      >
        {this.props.text}
      </div>
    );
  }
}

FooterToggleButton.propTypes = {
  state: PropTypes.object.isRequired,
  toggleOn: PropTypes.func.isRequired,
  toggleOff: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  toggleState: PropTypes.bool,
  title: PropTypes.string
};

FooterToggleButton.contextTypes = {
  projectActions: PropTypes.object.isRequired,
  viewer2DActions: PropTypes.object.isRequired,
  viewer3DActions: PropTypes.object.isRequired,
  linesActions: PropTypes.object.isRequired,
  holesActions: PropTypes.object.isRequired,
  itemsActions: PropTypes.object.isRequired,
  translator: PropTypes.object.isRequired,
};
