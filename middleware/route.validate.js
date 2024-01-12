const express = require('express')
const {z} = require('zod');
const { fromZodError } = require('zod-validation-error')
const { BadRequestError } = require('../expressError');
/**
 * @template {z.Schema} T
 * @param {T} schema
 * @param {express.RequestHandler<any, any, any, any, Record<string, any> & {zod: z.infer<T>}} anotherMiddleware 
 */
function validateBody(schema, anotherMiddleware) {

  const middleware = async (req, res, next) => {
    try {
      const data = await schema.parse(req.body);
      res.locals.zod = data;
      await anotherMiddleware(req, res, next);
    } catch (err) {
      const e = fromZodError(err);
      next(new BadRequestError(e.message));
    } 
  }
  
  return middleware;
}



module.exports = {
  validateBody
}