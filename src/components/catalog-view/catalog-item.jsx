import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {FaPlusCircle as IconAdd} from 'react-icons/fa';
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
  justifySelf: 'stretch',
  display: 'flex',
  flexDirection: 'column'
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
  marginBottom: SharedStyle.SPACING.sm,
  textTransform: 'capitalize',
  fontFamily: SharedStyle.TYPOGRAPHY.fontFamily,
  fontWeight: SharedStyle.TYPOGRAPHY.fontWeight.medium,
  fontSize: SharedStyle.TYPOGRAPHY.fontSize.sm,
  color: SharedStyle.PRIMARY_COLOR.text_main
};

const STYLE_TITLE_HOVER = {
  ...STYLE_TITLE,
  color: SharedStyle.SECONDARY_COLOR.light
};

const STYLE_IMAGE_CONTAINER = {
  width: '100%',
  height: '120px',
  position: 'relative',
  overflow: 'hidden',
  borderRadius: SharedStyle.RADIUS.md,
  padding: 0,
  margin: 0,
  marginBottom: SharedStyle.SPACING.sm,
  backgroundColor: SharedStyle.PRIMARY_COLOR.input
};

const STYLE_IMAGE = {
  position: 'absolute',
  width: '100%',
  height: '100%',
  backgroundSize: 'contain',
  backgroundPosition: '50% 50%',
  backgroundColor: SharedStyle.PRIMARY_COLOR.input,
  backgroundRepeat: 'no-repeat',
  transition: SharedStyle.TRANSITIONS.normal
};

const STYLE_IMAGE_HOVER = {
  ...STYLE_IMAGE,
  transform: 'scale(1.1)'
};

const STYLE_PLUS_HOVER = {
  marginTop: '2em',
  color: SharedStyle.SECONDARY_COLOR.main,
  fontSize: '2em',
  opacity: '0.9',
  width: '100%',
  filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))'
};

const STYLE_DESCRIPTION = {
  display: '-webkit-box',
  height: '2.5em',
  margin: '0 auto',
  fontSize: SharedStyle.TYPOGRAPHY.fontSize.xs,
  fontStyle: 'normal',
  lineHeight: '1.25em',
  WebkitLineClamp: '2',
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  color: SharedStyle.PRIMARY_COLOR.text_muted,
  fontFamily: SharedStyle.TYPOGRAPHY.fontFamily,
  marginTop: 'auto'
};

const STYLE_TAGS = {
  listStyle: 'none',
  margin: '0px',
  padding: '0px',
  fontSize: SharedStyle.TYPOGRAPHY.fontSize.xs,
  marginBottom: SharedStyle.SPACING.xs,
  display: 'flex',
  flexWrap: 'wrap',
  gap: '4px'
};

const STYLE_TAG = {
  display: 'inline-block',
  background: 'rgba(59, 130, 246, 0.15)',
  color: SharedStyle.SECONDARY_COLOR.light,
  padding: '2px 8px',
  borderRadius: SharedStyle.RADIUS.full,
  fontFamily: SharedStyle.TYPOGRAPHY.fontFamily,
  fontWeight: SharedStyle.TYPOGRAPHY.fontWeight.medium
};

export default class CatalogItem extends Component {

  constructor(props) {
    super(props);
    this.state = {hover: false};
  }

  select() {
    let element = this.props.element;

    switch (element.prototype) {
      case 'lines':
        this.context.linesActions.selectToolDrawingLine(element.name);
        break;
      case 'items':
        this.context.itemsActions.selectToolDrawingItem(element.name);
        break;
      case 'holes':
        this.context.holesActions.selectToolDrawingHole(element.name);
        break;
    }

    this.context.projectActions.pushLastSelectedCatalogElementToHistory(element);
  }

  render() {
    let element = this.props.element;
    let hover = this.state.hover;

    return (
      <div
        style={hover ? STYLE_BOX_HOVER : STYLE_BOX}
        onClick={e => this.select()}
        onMouseEnter={e => this.setState({hover: true})}
        onMouseLeave={e => this.setState({hover: false})}
      >
        <b style={ !hover ? STYLE_TITLE : STYLE_TITLE_HOVER }>{element.info.title}</b>
        <div style={ STYLE_IMAGE_CONTAINER }>
          <div style={{...( !hover ? STYLE_IMAGE: STYLE_IMAGE_HOVER ), backgroundImage: 'url(' + element.info.image + ')'}}>
            { hover ? <IconAdd style={STYLE_PLUS_HOVER} /> : null }
          </div>
        </div>
        <ul style={STYLE_TAGS}>
          {element.info.tag.map((tag, index) => <li style={STYLE_TAG} key={index}>{tag}</li>)}
        </ul>
        <div style={STYLE_DESCRIPTION}>{element.info.description}</div>
      </div>
    );
  }
}

CatalogItem.propTypes = {
  element: PropTypes.object.isRequired,
};

CatalogItem.contextTypes = {
  itemsActions: PropTypes.object.isRequired,
  linesActions: PropTypes.object.isRequired,
  holesActions: PropTypes.object.isRequired,
  projectActions: PropTypes.object.isRequired
};
