export const validation = {
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  phone: (phone: string): boolean => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone.replace(/[\s-]/g, ''));
  },

  required: (value: string): boolean => {
    return value.trim().length > 0;
  },

  minLength: (value: string, min: number): boolean => {
    return value.length >= min;
  },

  maxLength: (value: string, max: number): boolean => {
    return value.length <= max;
  },

  number: (value: string): boolean => {
    return !isNaN(Number(value));
  },

  age: (age: number): boolean => {
    return age >= 5 && age <= 100;
  },

  username: (username: string): boolean => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
  },

  password: (password: string): boolean => {
    return password.length >= 6;
  },
};

export const validateForm = (fields: { [key: string]: any }) => {
  const errors: { [key: string]: string } = {};

  Object.keys(fields).forEach((key) => {
    const value = fields[key];

    if (!validation.required(String(value))) {
      errors[key] = `${key} is required`;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
