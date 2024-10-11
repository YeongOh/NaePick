import mysql from 'mysql2/promise';

// const pool = createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_DATABASE,
//   port: 3306,
// });

// pool.getConnection((err, conn) => {
//   if (err) console.log('Error connecting to db...');
//   else console.log('Connected to db');

//   conn.release();
//   console.log('released');
// });

// https://velog.io/@te-ing/Next.js-14-App-router-mysql-Too-many-connections-%EC%98%A4%EB%A5%98
// https://dev.to/noclat/fixing-too-many-connections-errors-with-database-clients-stacking-in-dev-mode-with-next-js-3kpm
// 개발 환경에서 계속해서 API경로 구축하여 too many connections 문제

function check(it: false | (Window & typeof globalThis) | typeof globalThis) {
  return it && it.Math === Math && it;
}

const globalObject =
  check(typeof window === 'object' && window) ||
  check(typeof self === 'object' && self) ||
  check(typeof global === 'object' && global) ||
  (() => {
    return this;
  })() ||
  Function('return this')();

const registerService = (name: string, initFn: any) => {
  if (process.env.NODE_ENV === 'development') {
    if (!(name in globalObject)) {
      globalObject[name] = initFn();
    }
    return globalObject[name];
  }
  return initFn();
};

let db;
try {
  db = registerService('mysql', () =>
    mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      port: 3306,
    })
  );
} catch (err) {
  console.log(err);
}

export default async function getConnection() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: 3306,
  });
  return connection;
}
