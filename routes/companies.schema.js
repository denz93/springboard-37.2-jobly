const {z} = require('zod');

const companyFilterSchema = z.object({
  name: z.string().optional(),
  minEmployees: z.number({coerce: true}).min(0).optional(),
  maxEmployees: z.number({coerce: true}).min(0).optional(),
}).refine((arg) => {
  return (typeof arg.minEmployees !== 'number' || typeof arg.maxEmployees === 'number') ||  arg.minEmployees <= arg.maxEmployees
}, "minEmployees must be less than or equal to maxEmployees")

module.exports = {
  companyFilterSchema
}