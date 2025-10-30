export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.com$/i;
  return emailRegex.test(email.trim());
};
