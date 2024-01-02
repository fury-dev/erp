const generateMessage = (
  statusCode: Number,
  success: Object | string | null,
  error: Object | string | null = null
) => {
  return {
    statusCode,
    success,
    error,
  };
};
export { generateMessage };
