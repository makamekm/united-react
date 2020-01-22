import React from 'react';
import script from 'scriptjs';

export const UmdComponent = async (url: string, name: string): Promise<React.FC> => {
  return new Promise<React.FC>((r, e) =>
    script(url, () => {
      const target = window[name];
      console.log(target);
      if (target) {
        r(target.default);
      } else {
        e(`Cannot load component ${name} at ${url}`);
      }
    })
  );
};
