export const dateMask = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/^(\d{2})(\d)/, '$1/$2')
    .replace(/^(\d{2})\/(\d{2})(\d)/, '$1/$2/$3')
    .substr(0, 10);
};
