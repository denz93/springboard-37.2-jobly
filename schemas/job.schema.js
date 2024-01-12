const {z} = require('zod');

const jobSchema = z.object({
  id: z.number(),
  title: z.string(),
  salary: z.number(),
  equity: z.number({coerce: true}).min(0).max(1),
  companyHandle: z.string(),
});

const createJobSchema = z.object({
  title: z.string(),
  salary: z.number({coerce: true}).gte(0),
  equity: z.number({coerce: true}).min(0).max(1),
  companyHandle: z.string(),
})

const updateJobSchema = z.object({
  title: z.string(),
  salary: z.number({coerce: true}).gte(0),
  equity: z.number({coerce: true}).min(0).max(1),
})

const jobFilterSchema = z.object({
  title: z.string().default("").catch(""),
  minSalary: z.number({coerce: true}).catch(0),
  hasEquity: z.string({coerce: true}).catch("false").transform(v => ["true", "1"].includes(v.toLowerCase())),
})

const applyJobSchema = z.object({
  username: z.string(),
  jobId: z.number({coerce: true}),
})

module.exports = { 
  jobSchema,
  createJobSchema,
  updateJobSchema,
  jobFilterSchema,
  applyJobSchema
};