export const formattedTemplateValue = (value: string | undefined) => {
  if (!value) return value;
  return value.replace(/ /g, '\u00A0');
};

export const getNestedValue = (obj: any, path: string): any => {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
};
