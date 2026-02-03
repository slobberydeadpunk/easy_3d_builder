import React from 'react';
import PropTypes from 'prop-types';
import * as SharedStyle from '../../shared-style';

const STYLE = {
  padding: SharedStyle.SPACING.xl,
  overflowY: 'auto',
  backgroundColor: SharedStyle.PRIMARY_COLOR.main,
  scrollbarWidth: 'thin',
  scrollbarColor: `${SharedStyle.PRIMARY_COLOR.hover} transparent`
};

export default function ContentContainer({children, width, height, style = {}}) {
  return <div style={{width, height, ...STYLE, ...style}} onWheel={event => event.stopPropagation()}>{children}</div>
}

ContentContainer.propsType = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  style: PropTypes.object
};
