import { pool } from '../lib/db';

async function seedPosts() {
  try {
    const [results, fields] = await pool.query(
      `CREATE TABLE IF NOT EXISTS Posts (
	      id VARCHAR(255) NOT NULL,
	      title VARCHAR(100) NOT NULL,
	      description TEXT,
        publicity VARCHAR(20) NOT NULL DEFAULT 'public',
        userId VARCHAR(40) NOT NULL,
        categoryId INT NOT NULL DEFAULT 1,
        numberOfCandidates SMALLINT UNSIGNED NOT NULL,
        createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP NOT NULL ON UPDATE CURRENT_TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        deletedAt TIMESTAMP,
        PRIMARY KEY (id)
      );`
    );

    console.log(results);
    console.log(fields);
  } catch (err) {
    console.log(err);
  }
}

async function seedPostStats() {
  try {
    const [results, fields] = await pool.query(
      `CREATE TABLE IF NOT EXISTS PostStats (
	      id VARCHAR(255) NOT NULL,
        postId VARCHAR(255) NOT NULL,
        numberOfMatches INT UNSIGNED NOT NULL DEFAULT 0,
        numberOfGames INT UNSIGNED NOT NULL DEFAULT 0,
        totalSpentTime BIGINT UNSIGNED NOT NULL DEFAULT 0,
        createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP NOT NULL ON UPDATE CURRENT_TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        deletedAt TIMESTAMP,
        PRIMARY KEY (id)
      );`
    );

    console.log(results);
    console.log(fields);
  } catch (err) {
    console.log(err);
  }
}

async function seedCandidates() {
  try {
    const [results, fields] = await pool.query(
      `CREATE TABLE IF NOT EXISTS Candidates (
          id VARCHAR(255) NOT NULL,
          postId VARCHAR(255) NOT NULL,
          name VARCHAR(255) NOT NULL,
          url VARCHAR(255) NOT NULL,
          numberOfMatches INT UNSIGNED NOT NULL DEFAULT 0,
          numberOfMatchesWon INT UNSIGNED NOT NULL DEFAULT 0,
          numberOfGames INT UNSIGNED NOT NULL DEFAULT 0,
          numberOfGamesWon INT UNSIGNED NOT NULL DEFAULT 0,
          spentTime BIGINT UNSIGNED NOT NULL DEFAULT 0,
          createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (id)
        );`
    );

    console.log(results);
    console.log(fields);
  } catch (err) {
    console.log(err);
  }
}

async function seedCategories() {
  try {
    const [results, fields] = await pool.query(
      `CREATE TABLE IF NOT EXISTS Categories (
        id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(20) NOT NULL,
        PRIMARY KEY (id),
        UNIQUE (name)
      );`
    );

    console.log(results);
    console.log(fields);
  } catch (err) {
    console.log(err);
  }
}

async function seedThumbnails() {
  try {
    const [results, fields] = await pool.query(
      `CREATE TABLE IF NOT EXISTS Thumbnails (
        id VARCHAR(255) NOT NULL,
        postId VARCHAR(255) NOT NULL,
        leftCandidateId VARCHAR(255) NOT NULL,
        rightCandidateId VARCHAR(255) NOT NULL,
        PRIMARY KEY (id)
      );`
    );

    console.log(results);
    console.log(fields);
  } catch (err) {
    console.log(err);
  }
}

async function seedCategoriesData() {
  try {
    const insertedCategories = await Promise.all(
      ['animations', 'athletes', 'celebrities', 'idols', 'other'].map(
        (category) =>
          pool.query(
            `INSERT INTO Categories (name)
                  VALUES ('${category}');`
          )
      )
    );

    console.log(insertedCategories);
  } catch (err) {
    console.log(err);
  }
}

async function seedUsers() {
  try {
    const [results, fields] = await pool.query(
      `CREATE TABLE IF NOT EXISTS Users (
        id VARCHAR(255) NOT NULL,
        username VARCHAR(40) NOT NULL,
        nickname VARCHAR(40) NOT NULL,
        role VARCHAR(20) NOT NULL,
        email VARCHAR(80) NOT NULL,
        emailConfirmedAt TIMESTAMP,
        password VARCHAR(255) NOT NULL,
        createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE (username, nickname)
      );`
    );

    console.log(results);
    console.log(fields);
  } catch (err) {
    console.log(err);
  }
}

async function seedComments() {
  try {
    const [results, fields] = await pool.query(
      `CREATE TABLE IF NOT EXISTS Comments (
        id VARCHAR(255) NOT NULL,
        postId VARCHAR(255) NOT NULL,
        parentId VARCHAR(255),
        userId VARCHAR(255),
        text Text NOT NULL,
        createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      );`
    );

    console.log(results);
    console.log(fields);
  } catch (err) {
    console.log(err);
  }
}

export async function GET() {
  try {
    await seedPosts();
    await seedCandidates();
    await seedCategories();
    await seedThumbnails();
    await seedUsers();
    await seedPostStats();
    await seedComments();
    await seedCategoriesData();

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
