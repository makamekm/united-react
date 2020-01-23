import script from 'scriptjs';

const name = 'services';

export const UmdServices = async (url: string): Promise<any[]> => {
  return new Promise<any[]>((r, e) =>
    script(url, () => {
      const target = window[name];
      if (target) {
        r(target);
      } else {
        e(`Cannot load component ${name} at ${url}`);
      }
    })
  );
};
