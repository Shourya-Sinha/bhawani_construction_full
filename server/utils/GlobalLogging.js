export const LogData = (controllerName, data) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[DEBUG] [${controllerName}]`, data);
  }
};

export const LogError = (controllerName, error) => {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[ERROR] [${controllerName}]`, error?.message || error);
  }
};