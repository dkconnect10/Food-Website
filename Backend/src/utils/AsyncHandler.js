const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    if (!(error instanceof Error)) {
      error = new Error(error.message || "Internal Server Error");
    }
    next(error);
  }
};

export { asyncHandler };
