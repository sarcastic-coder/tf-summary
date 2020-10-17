import React from 'react';

// Default CSS properties allowing for custom variables
export type CSSProperties = React.CSSProperties | Record<string, string>;

export type ThemeDefinition = {
  root?: CSSProperties;
  body?: CSSProperties;
};

export const merge = (...styles: Array<undefined | CSSProperties>) => {
  return styles.reduce((accumulated, properties) => {
    if (properties === undefined) {
      return accumulated;
    }

    return {
      ...accumulated,
      ...properties,
    }
  });
};

export const apply = (styles: undefined | CSSProperties, fallback: CSSProperties = {}) => {
  return styles ?? fallback;
};

export const base: ThemeDefinition = {
  body: {
  },
};

export const light: ThemeDefinition = {};

export const dark: ThemeDefinition = {
  root: {
    '--body-color': 'var(--gray-200)',
    '--body-background': 'var(--gray-dark)',
    '--card-bg': 'var(--gray-dark)',
    '--hr-border-color': 'rgba(255, 255, 255, 0.3)',
    '--input-backround-color': 'var(--gray-700)',
    '--input-color': 'var(--gray-400)',
    '--change-value-color': 'var(--gray-400)',
    '--change-value-background-color': 'var(--gray-700)',
  },
};
