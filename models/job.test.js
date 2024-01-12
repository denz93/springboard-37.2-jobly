const {
  commonBeforeAll,
  commonAfterAll,
  commonBeforeEach,
  commonAfterEach,
  jobs
} = require('./_testCommon');
const {NotFoundError} = require('../expressError')
const Job = require('./job');
const db = require('../db');

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe('create', () => {
  test('works with valid data', async () => {
    const job = await Job.create({
      title: 'a',
      salary: 1000,
      equity: 0.1,
      companyHandle: 'c1'
    })
    expect(job).toEqual({
      id: expect.any(Number),
      title: 'a',
      salary: 1000,
      equity: 0.1,
      companyHandle: 'c1'
    })
  })
})

describe('findAll', () => {
  test('works without filter', async () => {
    const jobs = await Job.findAll()
    expect(jobs).toEqual([
      {
        id: expect.any(Number),
        title: 'j1',
        salary: 100,
        equity: 0.1,
        companyHandle: 'c1',
      }, 
      {
        id: expect.any(Number),
        title: 'j2',
        salary: 200,
        equity: 0.2,
        companyHandle: 'c2',
      },
      {
        id: expect.any(Number),
        title: 'j3',
        salary: 300,
        equity: 0.3,
        companyHandle: 'c3',
      },
      {
        id: expect.any(Number),
        title: 'j4',
        salary: 400,
        equity: 0,
        companyHandle: 'c3',
      }
  ])
  })

  test('works with filter title', async () => {
    const jobs = await Job.findAll({title: 'j1'})
    expect(jobs).toEqual([{
      id: expect.any(Number),
      title: 'j1',
      salary: 100,
      equity: 0.1,
      companyHandle: 'c1',
    }])
  })

  test('works with filter minSalary', async () => {
    const jobs = await Job.findAll({minSalary: 200})
    expect(jobs).toEqual([{
      id: expect.any(Number),
      title: 'j2',
      salary: 200,
      equity: 0.2,
      companyHandle: 'c2',
    }, {
      id: expect.any(Number),
      title: 'j3',
      salary: 300,
      equity: 0.3,
      companyHandle: 'c3',
    }, {
      id: expect.any(Number),
      title: 'j4',
      salary: 400,
      equity: 0,
      companyHandle: 'c3',
    }])
  })
  test('works with filter hasEquity', async () => {
    const jobs = await Job.findAll({hasEquity: true})
    expect(jobs).toEqual([{
      id: expect.any(Number),
      title: 'j1',
      salary: 100,
      equity: 0.1,
      companyHandle: 'c1',
    },{
      id: expect.any(Number),
      title: 'j2',
      salary: 200,
      equity: 0.2,
      companyHandle: 'c2',
    }, {
      id: expect.any(Number),
      title: 'j3',
      salary: 300,
      equity: 0.3,
      companyHandle: 'c3',
    }])
  })
  test('works with all filter', async () => {
    const jobs = await Job.findAll({title: 'j', minSalary: 300, hasEquity: true})
    expect(jobs).toEqual([{
      id: expect.any(Number),
      title: 'j3',
      salary: 300,
      equity: 0.3,
      companyHandle: 'c3',
    }])
  })
})

describe('get', () => {
  test('works with valid id', async () => {
    const expectedJob = jobs[0]
    const job = await Job.get(expectedJob.id)
    expect(job).toEqual(expectedJob)
  })
  test('throws error job id not found', async () => {
    try {
      await Job.get(0)
      fail()
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy()
    }
  })
})

describe('update', () => {
  test('works with valid data', async () => {
    const job = await Job.update(jobs[0].id, {
      title: 'a',
      salary: 1000,
      equity: 0.1
    })
    expect(job).toEqual({
      id: expect.any(Number),
      title: 'a',
      salary: 1000,
      equity: 0.1,
      companyHandle: 'c1'
    })
  })

  test('throws error job id not found', async () => {
    try {
      await Job.update(0, {
        title: 'a',
        salary: 1000,
        equity: 0.1
      })
      fail()
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy()
    }
  })
})

describe('partialUpdate', () => {
  test('works with valid data', async () => {
    const expectedJob = jobs[0]

    const job = await Job.partialUpdate(expectedJob.id, {
      title: 'a',
      equity: 0.1
    })
    expect(job).toEqual({
      ...expectedJob,
      title: 'a',
      equity: 0.1,
    })
  })
})

describe('remove', () => {
  test('works with valid id', async () => {
    const job = await Job.remove(jobs[0].id)
    expect(job).toEqual(jobs[0])
    const {rowCount, rows} = await db.query(`SELECT * FROM jobs`)
    expect(rowCount).toEqual(jobs.length - 1)
    expect(rows.find(r => r.id === jobs[0].id)).toBeFalsy()
  })
  test('throws error job id not found', async () => {
    try {
      await Job.remove(0)
      fail()
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy()
    }
  })
})