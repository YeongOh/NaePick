import mysql from 'mysql2/promise';

export async function fetchAllPosts() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      port: 3306,
    });

    const [result, meta] = await connection.execute(
      `SELECT p.*, c1.name as leftCandidateName, c2.name as rightCandidateName, 
              c1.url as leftCandidateUrl, c2.url as rightCandidateUrl
      FROM Posts p 
      LEFT JOIN Thumbnails t ON p.id = t.postId
      LEFT JOIN Candidates c1 ON t.leftCandidateId = c1.id
      LEFT JOIN Candidates c2 ON t.rightCandidateId = c2.id
      ORDER BY p.createdAt DESC 
      LIMIT 12;`
    );

    console.log(result);
    console.log('fetched all posts : ');

    return result;
  } catch (err) {
    console.log(err);
  }
}

export async function fetchAllCategories() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      port: 3306,
    });

    const result: any = await connection.execute(
      `SELECT *
      FROM Categories;`
    );

    return result[0];
  } catch (err) {
    console.log(err);
  }
}

export async function fetchPostById(id: string) {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      port: 3306,
    });

    const [result, meta] = await connection.execute(
      `SELECT p.*, c.name AS categoryName
       FROM Posts p
       LEFT JOIN Categories c ON p.categoryId = c.id
       WHERE p.id = ?;`,
      [id]
    );

    console.log(result);
    console.log('fetched posts');

    return result;
  } catch (err) {
    console.log(err);
  }
}

export async function fetchCandidatesByPostId(postId: string) {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      port: 3306,
    });

    const [result, meta] = await connection.execute(
      `SELECT * FROM Candidates WHERE postId = ?;`,
      [postId]
    );
    console.log(result);
    console.log('fetched Canddiates');
    return result;
  } catch (err) {
    console.log(err);
  }
}
