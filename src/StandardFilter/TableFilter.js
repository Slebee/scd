import React from 'react';
import styles from './TableFilter.less';

export default ({ children, actions }) => (
  <div className={styles.wrapper}>
    {children}
    <div>{actions}</div>
  </div>
);
