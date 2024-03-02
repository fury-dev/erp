const generateMessage = (
  statusCode: number,
  success: any = null,
  error: any = null
) => {
  return {
    statusCode,
    success,
    error,
  };
};
export default { generateMessage };
