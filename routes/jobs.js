//@ts-check

const express = require('express');
const router = express.Router();
const Job = require('../models/job')
const {validateBody} = require('../middleware/route.validate');
const {createJobSchema, updateJobSchema, jobFilterSchema} = require('../schemas/job.schema');
const {ensureAdmin} = require('../middleware/auth');
module.exports = router;

router.get('/', async function (req, res, next) {
  try {
    const filter = jobFilterSchema.parse(req.query.filter??{});
    console.debug({filter, query: req.query})
    const jobs = await Job.findAll(filter);
    return res.json({ jobs });
  } catch (err) {
    return next(err);
  }
})

router.get('/:id', async function (req, res, next) {
  try {
    const job = await Job.get(req.params.id);
    return res.json({ job });
  } catch (err) {
    return next(err);
  }
})
router.post('/', ensureAdmin, validateBody(createJobSchema, async function (req, res, next) {
  try {
    const job = await Job.create(res.locals.zod);
    return res.status(201).json({ job });
  } catch (err) {
    return next(err);
  }
})
)
/**
 * @typedef {import("express").Request<any, any, {abc: string}, any, any>} Request 
 */
router.patch('/:id', ensureAdmin, validateBody(updateJobSchema, async function (req, res, next) {
  try {
    await Job.update(req.params.id, res.locals.zod);
    return res.json({ updated: true });
  } catch (err) {
    return next(err);
  }
}))

router.put('/:id', ensureAdmin, validateBody(updateJobSchema.partial(), async function (req, res, next) {
  try {
    await Job.partialUpdate(req.params.id, res.locals.zod);
    return res.json({ updated: true });
  } catch (err) {
    return next(err);
  }
}))

