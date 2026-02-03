import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {MdNavigateNext} from 'react-icons/md';
import * as SharedStyle from '../../shared-style';

const STYLE_BOX = {
  width: '100%',
  minHeight: '200px',
  padding: SharedStyle.SPACING.md,
  background: SharedStyle.PRIMARY_COLOR.surface,
  border: '1px solid rgba(255, 255, 255, 0.06)',
  cursor: 'pointer',
  position: 'relative',
  boxShadow: SharedStyle.SHADOWS.sm,
  borderRadius: SharedStyle.RADIUS.lg,
  transition: SharedStyle.TRANSITIONS.normal,
  alignSelf: 'stretch',
  justifySelf: 'stretch'
};

const STYLE_BOX_HOVER = {
  ...STYLE_BOX,
  background: SharedStyle.PRIMARY_COLOR.hover,
  borderColor: SharedStyle.SECONDARY_COLOR.main,
  boxShadow: SharedStyle.SHADOWS.glow,
  transform: 'translateY(-2px)'
};

const STYLE_TITLE = {
  width: '100%',
  textAlign: 'center',
  display: 'block',
  padding: SharedStyle.SPACING.md,
  textTransform: 'capitalize',
  transition: SharedStyle.TRANSITIONS.normal,
  fontFamily: SharedStyle.TYPOGRAPHY.fontFamily,
  fontWeight: SharedStyle.TYPOGRAPHY.fontWeight.medium,
  fontSize: SharedStyle.TYPOGRAPHY.fontSize.base,
  color: SharedStyle.PRIMARY_COLOR.text_main
};

const STYLE_TITLE_HOVERED = {
  ...STYLE_TITLE,
  fontSize: SharedStyle.TYPOGRAPHY.fontSize.lg,
  color: SharedStyle.SECONDARY_COLOR.light
};

const STYLE_NEXT_HOVER = {
  color: SharedStyle.SECONDARY_COLOR.main,
  fontSize: '4em',
  opacity: 0.8,
  filter: 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.5))'
};

const CONTAINER_DIV = {
  background: SharedStyle.PRIMARY_COLOR.input,
  borderRadius: SharedStyle.RADIUS.md,
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: SharedStyle.SPACING.sm
};

export default class CatalogPageItem extends Component {

  constructor(props) {
    super(props);
    this.state = {hover: false};
  }

  changePage(newPage) {
    this.context.projectActions.changeCatalogPage(newPage, this.props.oldPage.name)
  }

  render() {
    let page = this.props.page;
    let hover = this.state.hover;

    return (
      <div
        style={hover ? STYLE_BOX_HOVER : STYLE_BOX}
        onClick={e => this.changePage(page.name)}
        onMouseEnter={e => this.setState({hover: true})}
        onMouseLeave={e => this.setState({hover: false})}
      >
        {hover ?
          <div style={CONTAINER_DIV}>
            <b style={STYLE_TITLE_HOVERED}>{page.label}</b>
            <MdNavigateNext style={STYLE_NEXT_HOVER}/>
          </div>
          :
          <div style={CONTAINER_DIV}>
            <b style={STYLE_TITLE}>{page.label}</b>
          </div>}

      </div>
    );
  }
}

CatalogPageItem.propTypes = {
  page: PropTypes.object.isRequired,
  oldPage: PropTypes.object.isRequired,
};

CatalogPageItem.contextTypes = {
  projectActions: PropTypes.object.isRequired
};
