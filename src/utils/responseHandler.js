/**
 * @description Success response structured handler
 * @param {import('fastify').FastifyReply} reply
 * @param {any} data
 * @param {any} meta
 * @param {number} statusCode
 */
function responseHandler(reply, data, meta = null, statusCode = 200) {
  const isSuccess = statusCode >= 200 && statusCode < 300;
  const response = {
    success: isSuccess,
    data,
    meta: meta || null,
  };

  reply.status(statusCode).send(response);
}

export default responseHandler;
