export const replaceExt = (
  filePath: string,
  before: string,
  after: string,
): string => {
  if (filePath.endsWith(before))
    return `${filePath.slice(0, -before.length)}${after}`;

  return `${filePath}${after}`;
};
