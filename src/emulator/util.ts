export const catchError = <A>(f: () => A): A | undefined => {
  try {
    return f();
  } catch (error) {
    return undefined;
  }
};
