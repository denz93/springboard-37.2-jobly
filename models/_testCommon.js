const bcrypt = require("bcrypt");

const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config");
let jobs = [];
async function commonBeforeAll() {
  let result
  await db.query('DELETE FROM user_tech');

  await db.query('DELETE FROM job_tech');

  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM companies");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM users");

  await db.query("DELETE FROM jobs");

  await db.query('DELETE FROM technologies');


  await db.query(`
    INSERT INTO companies(handle, name, num_employees, description, logo_url)
    VALUES ('c1', 'C1', 1, 'Desc1', 'http://c1.img'),
           ('c2', 'C2', 2, 'Desc2', 'http://c2.img'),
           ('c3', 'C3', 3, 'Desc3', 'http://c3.img')`);

  await db.query(`
        INSERT INTO users(username,
                          password,
                          first_name,
                          last_name,
                          email)
        VALUES ('u1', $1, 'U1F', 'U1L', 'u1@email.com'),
               ('u2', $2, 'U2F', 'U2L', 'u2@email.com')
        RETURNING username`,
      [
        await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
        await bcrypt.hash("password2", BCRYPT_WORK_FACTOR),
      ]);
  result = await db.query(`
    INSERT INTO jobs (title, salary, equity, company_handle)
    VALUES ('j1', 100, 0.1, 'c1'),
           ('j2', 200, 0.2, 'c2'),
           ('j3', 300, 0.3, 'c3'),
           ('j4', 400, 0, 'c3')
    RETURNING id, title, salary, equity, company_handle as "companyHandle"
  `)
  jobs.splice(0, jobs.length, ...result.rows.map(r => ({...r, salary: r.salary * 1, equity: r.equity * 1})))

  const {rows: technologies} = await db.query(`
    INSERT INTO technologies (name)
    VALUES ('t1'),
           ('t2'),
           ('t3')
    RETURNING id, name
  `)

  
  await db.query(`
    INSERT INTO user_tech (username, tech_id)
    VALUES ('u1', ${technologies[0].id}),
           ('u2', ${technologies[1].id}),
           ('u2', ${technologies[2].id})
  `)
  await db.query(`
    INSERT INTO job_tech (job_id, tech_id)
    VALUES (${jobs[3].id}, ${technologies[2].id}),
           (${jobs[3].id}, ${technologies[1].id}),
           (${jobs[3].id}, ${technologies[0].id}),
           (${jobs[2].id}, ${technologies[1].id}),
           (${jobs[2].id}, ${technologies[0].id})
  `)
}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}


module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  jobs
};