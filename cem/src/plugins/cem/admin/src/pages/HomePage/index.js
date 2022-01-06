/*
 *
 * HomePage
 *
 */

import React, { memo, useRef, useEffect } from 'react';
// import PropTypes from 'prop-types';
import pluginId from '../../pluginId';

const HomePage = () => {

  const canvasRef = useRef(null)

  return (
    <div ref={canvasRef}> 未做 TODO </div>
  );
};

export default memo(HomePage);
