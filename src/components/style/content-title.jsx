import React from 'react';
import PropTypes from 'prop-types';
import * as SharedStyle from '../../shared-style';

const STYLE = {
  color: SharedStyle.PRIMARY_COLOR.text_main,
  fontFamily: SharedStyle.TYPOGRAPHY.fontFamily,
  fontWeight: SharedStyle.TYPOGRAPHY.fontWeight.semibold,
  fontSize: SharedStyle.TYPOGRAPHY.fontSize['2xl'],
  marginBottom: SharedStyle.SPACING.lg,
  letterSpacing: '-0.025em'
};

export default function ContentTitle({children, style = {}, ...rest}) {
  return <h1 style={{...STYLE, ...style}} {...rest}>{children}</h1>
}

ContentTitle.propsType = {
  style: PropTypes.object
};
