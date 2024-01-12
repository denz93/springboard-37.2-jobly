const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
   sampleJobs,
   u1Token, 
   u2Token
} = require("./_testCommon");
const supertest = require('supertest');
const app = require('../app');

beforeAll(commonBeforeAll);
afterAll(commonAfterAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);

describe('GET /jobs', () => {
  test('works', async () => {
    const resp = await supertest(app)
      .get('/jobs')
      .expect(200)
    expect(resp.body).toEqual({jobs: expect.arrayContaining(sampleJobs)})
  })
  test('works with filter title', async () => {
    const resp = await supertest(app)
      .get('/jobs')
      .query({filter: {title: 'J1'}})
      .expect(200)
    expect(resp.body.jobs.length).toEqual(1)
    expect(resp.body).toEqual({jobs: expect.arrayContaining([sampleJobs[0]])})
  })
  test('works with filter minSalary', async () => {
    const resp = await supertest(app)
      .get('/jobs')
      .query({filter: {minSalary: 200}})
      .expect(200)
    expect(resp.body.jobs.length).toEqual(3)
    expect(resp.body).toEqual({jobs: expect.arrayContaining([sampleJobs[2], sampleJobs[3]])})
  })
  test('works with filter hasEquity', async () => {
    const resp = await supertest(app)
      .get('/jobs')
      .query({filter: {hasEquity: true}})
      .expect(200)
    expect(resp.body.jobs.length).toEqual(3)
    expect(resp.body).toEqual({jobs: expect.arrayContaining([sampleJobs[0], sampleJobs[1], sampleJobs[2]]) })
  })
})

describe('GET /jobs/:id', () => {
  test('works', async () => {
    const resp = await supertest(app)
      .get(`/jobs/${sampleJobs[0].id}`)
      .expect(200)
    expect(resp.body).toEqual({job: sampleJobs[0]})
  })
  test('not found', async () => {
    const resp = await supertest(app)
      .get(`/jobs/0`)
      .expect(404)
    expect(resp.body).toEqual({
      error: {
        message: 'Job not found: 0',
        status: 404
      }
    })
  })
})

describe('POST /jobs', () => {
  test('works', async () => {
    const resp = await supertest(app)
      .post('/jobs')
      .auth(u1Token, {type: 'bearer'})
      .send({
        title: 'new job',
        salary: 100,
        equity: 0.1,
        companyHandle: 'c1'
      })
      .expect(201)

    expect(resp.body).toEqual({job: {
      id: expect.any(Number),
      title: 'new job',
      salary: 100,
      equity: 0.1,
      companyHandle: 'c1'
    }})
  })
  test('missing auth', async () => {
    const resp = await supertest(app)
      .post('/jobs')
      .send({
        title: 'new job',
        salary: 100,
        equity: 0.1,
        companyHandle: 'c1'
      })
      .expect(401)
    expect(resp.body).toEqual({
      error: {
        message: 'Unauthorized',
        status: 401
      }
    })
  })
  test('bad request with missing data', async () => {
    const resp = await supertest(app)
      .post('/jobs')
      .auth(u1Token, {type: 'bearer'})
      .send({
        title: 'new job',
        salary: 100
      })
    console.log({data: resp.body})
    expect(resp.body).toEqual({
      error: {
        message: expect.stringMatching(/equity.+companyHandle/i),
        status: 400
      }
    })
  })
})

describe('PATCH /jobs/:id', () => {
  test('works', async () => {
    const resp = await supertest(app)
      .patch(`/jobs/${sampleJobs[0].id}`)
      .auth(u1Token, {type: 'bearer'})
      .send({
        title: 'new job',
        salary: 100,
        equity: 0.1,
        companyHandle: 'c1'
      })
      .expect(200)
    expect(resp.body).toEqual({updated: true})
  })
  test('missing auth', async () => {
    const resp = await supertest(app)
      .patch(`/jobs/${sampleJobs[0].id}`)
      .send({
        title: 'new job',
        salary: 100,
        equity: 0.1,
        companyHandle: 'c1'
      })
      .expect(401)
    expect(resp.body).toEqual({
      error: {
        message: 'Unauthorized',
        status: 401
      }
    })
  })
})