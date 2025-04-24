export const createErrorFactory = (name: string) => {
  return class BusinessError extends Error {
    constructor(message: string) {
      super(message);
      this.name = name;
    }
  };
};
