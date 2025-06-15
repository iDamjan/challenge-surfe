export const ResponseHelpers = {
  // Validation Error Response
  validationError: (reply, message, field = null) => {
    return reply.code(400).send({
      error: message,
      type: "ValidationError",
      ...(field && { field }),
    });
  },

  // Not Found Error Response
  notFound: (reply, resource, id = null) => {
    const message = `${resource}${id ? ` with id ${id}` : ""} not found`;
    return reply.code(404).send({
      error: message,
      type: "NotFoundError",
      resource,
      ...(id && { id }),
    });
  },

  // Business Logic Error Response
  businessLogicError: (reply, message) => {
    return reply.code(422).send({
      error: message,
      type: "BusinessLogicError",
    });
  },

  // Internal Server Error Response
  internalError: (reply, message = "Internal server error", details = null) => {
    return reply.code(500).send({
      error: message,
      type: "InternalServerError",
      ...(process.env.NODE_ENV === "development" && details && { details }),
    });
  },

  // Unauthorized Response
  unauthorized: (reply, message = "Unauthorized") => {
    return reply.code(401).send({
      error: message,
      type: "Unauthorized",
    });
  },

  // Forbidden Response
  forbidden: (reply, message = "Forbidden") => {
    return reply.code(403).send({
      error: message,
      type: "Forbidden",
    });
  },

  // Zod Validation Error Response
  zodError: (reply, zodError) => {
    return reply.code(400).send({
      error: "Validation failed",
      type: "ValidationError",
      details: zodError.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
        code: err.code,
      })),
    });
  },

  // Generic Error Handler
  handleError: (reply, error, context = "") => {
    // Log error with context
    console.error(`Error in ${context}:`, {
      name: error.name,
      message: error.message,
      statusCode: error.statusCode,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });

    // Handle custom errors with statusCode
    if (error.statusCode) {
      return reply.code(error.statusCode).send({
        error: error.message,
        type: error.name,
        ...(error.field && { field: error.field }),
        ...(error.resource && { resource: error.resource }),
        ...(error.id && { id: error.id }),
      });
    }

    // Handle Zod validation errors
    if (error.name === "ZodError") {
      return ResponseHelpers.zodError(reply, error);
    }

    // Handle specific error types
    if (error.name === "ValidationError") {
      return ResponseHelpers.validationError(reply, error.message, error.field);
    }

    if (error.name === "NotFoundError") {
      return ResponseHelpers.notFound(reply, error.resource, error.id);
    }

    // Default to 500 for unknown errors
    return ResponseHelpers.internalError(
      reply,
      "Internal server error",
      process.env.NODE_ENV === "development" ? error.message : null
    );
  },
};
