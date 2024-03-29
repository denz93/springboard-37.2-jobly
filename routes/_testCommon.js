"use strict";

const db = require("../db.js");
const User = require("../models/user");
const Company = require("../models/company");
const Job = require("../models/job.js");
const Technology = require("../models/technology");

const { createToken } = require("../helpers/tokens");

/**
 * @type {Awaited<ReturnType<Job.create>>[]}
 */
let sampleJobs = [];

async function commonBeforeAll() {
  await db.query("DELETE FROM job_tech");
  await db.query("DELETE FROM user_tech");

  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM users");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM companies");

  await db.query("DELETE FROM jobs");
  await db.query("DELETE FROM technologies");


  await Company.create(
      {
        handle: "c1",
        name: "C1",
        numEmployees: 1,
        description: "Desc1",
        logoUrl: "http://c1.img",
      });
  await Company.create(
      {
        handle: "c2",
        name: "C2",
        numEmployees: 2,
        description: "Desc2",
        logoUrl: "http://c2.img",
      });
  await Company.create(
      {
        handle: "c3",
        name: "C3",
        numEmployees: 3,
        description: "Desc3",
        logoUrl: "http://c3.img",
      });

  await User.register({
    username: "u1",
    firstName: "U1F",
    lastName: "U1L",
    email: "user1@user.com",
    password: "password1",
    isAdmin: true,
  });
  await User.register({
    username: "u2",
    firstName: "U2F",
    lastName: "U2L",
    email: "user2@user.com",
    password: "password2",
    isAdmin: false,
  });
  await User.register({
    username: "u3",
    firstName: "U3F",
    lastName: "U3L",
    email: "user3@user.com",
    password: "password3",
    isAdmin: false,
  });

  sampleJobs.splice(0, sampleJobs.length);
  sampleJobs.push(...[
    await Job.create({
      title: "J1",
      salary: 100,
      equity: 0.1,
      companyHandle: "c1",
    }),
    await Job.create({
      title: "J2",
      salary: 200,
      equity: 0.2,
      companyHandle: "c2",
    }),
    await Job.create({
      title: "J3",
      salary: 300,
      equity: 0.3,
      companyHandle: "c3",
    }),
    await Job.create({
      title: "J4",
      salary: 1000,
      equity: 0,
      companyHandle: "c3",
    })
  ])
  const technologies = [
    await Technology.create({name: 't1'}),
    await Technology.create({name: 't2'}),
    await Technology.create({name: 't3'})
  ]
  await User.addTechologies('u1', technologies.map(t => t.id));
  await Job.addTechologies(sampleJobs[0].id, [technologies[0].id]);
  await Job.addTechologies(sampleJobs[1].id, [technologies[1].id]);
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


const u1Token = createToken({ username: "u1", isAdmin: true });
const u2Token = createToken({ username: "u2", isAdmin: false });

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token,
  sampleJobs
};
