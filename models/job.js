const db = require('../db');
const {NotFoundError} = require('../expressError');
const { jobSchema, updateJobSchema } = require('../schemas/job.schema');

class Job {
  static async create({title, salary, equity, companyHandle}) {
    const {rowCount: isHandleExist} = await db.query(`SELECT handle FROM companies WHERE handle = $1`, [companyHandle]);
    if (!isHandleExist) {
      throw new NotFoundError(`Company ${companyHandle} does not exist`);
    }
    const {rows} = await db.query(`
      INSERT INTO jobs
        (title, salary, equity, company_handle)
      VALUES
        ($1, $2, $3, $4)
      RETURNING id, title, salary, equity, company_handle AS "companyHandle"
    `, [title, salary, equity, companyHandle]);
    return jobSchema.parse(rows[0]);
  }

  static async findAll(filter = {title: '', minSalary: 0, hasEquity: false}) {
    const {rows} = await db.query(`
      SELECT id, title, salary, equity, company_handle AS "companyHandle"
      FROM jobs
      WHERE title ILIKE $1 AND salary >= $2 ${filter.hasEquity ? 'AND equity > 0' : ''}
    `, [`%${filter.title??''}%`, filter.minSalary??0]);
    return rows.map(r => jobSchema.parse(r));
  }

  static async get(id) {
    const {rows, rowCount} = await db.query(`
      SELECT id, title, salary, equity, company_handle AS "companyHandle"
      FROM jobs
      WHERE id = $1
    `, [id]);
    if (rowCount === 0) {
      throw new NotFoundError(`Job not found: ${id}`);
    }
    return jobSchema.parse(rows[0]);
  }

  static async update(id, {title, salary, equity}) {
    const {rowCount, rows} = await db.query(`
      UPDATE jobs
      SET title = $1, salary = $2, equity = $3
      WHERE id = $4
      RETURNING id, title, salary, equity, company_handle AS "companyHandle"
    `, [title, salary, equity, id]);
    
    if (rowCount === 0) {
      throw new NotFoundError(`Job not found: ${id}`);
    }
    return jobSchema.parse(rows[0]);
  }

  static async remove(id) {
    const {rowCount, rows} = await db.query(`
      DELETE FROM jobs
      WHERE id = $1
      RETURNING id, title, salary, equity, company_handle AS "companyHandle"
    `, [id]);
    if (rowCount === 0) {
      throw new NotFoundError(`Job not found: ${id}`);
    }
    return jobSchema.parse(rows[0]);
  }

  /**
   * 
   * @param {number|string} id 
   * @param {Partial<Zod.infer<typeof updateJobSchema>>} partialBody 
   */
  static async partialUpdate(id, partialBody) {
    const {rowCount, rows} = await db.query(`
      UPDATE jobs
      SET ${Object.keys(partialBody).map((k, idx) => `${k} = $${idx+1}`)}
      WHERE id = $${Object.keys(partialBody).length + 1}
      RETURNING id, title, salary, equity, company_handle AS "companyHandle"
    `, [...Object.values(partialBody), id]);
    if (rowCount === 0) {
      throw new NotFoundError(`Job not found: ${id}`);
    }
    return jobSchema.parse(rows[0]);
  }

  /**
   * Add related technologies to job
   * @param {number} jobId
   * @param {number[]} techIds
   */
  static async addTechologies(jobId, techIds) {
    if (techIds.length === 0) return false

    const {rowCount} = await db.query(`
      INSERT INTO job_tech
      (job_id, tech_id)
      VALUES ${techIds.map((id, idx) => `($1, $${idx+2})`).join(', ')}
      ON CONFLICT DO NOTHING
    `, [jobId, ...techIds])
    return rowCount > 0
  }
}

module.exports = Job;