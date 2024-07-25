import mysql from 'mysql2/promise';
import { candidates, categories, posts } from '../lib/placeholder';
import { POST_TITLE_MAX_LENGTH } from '../constants';
import { v4 as uuidv4 } from 'uuid';

async function seedPosts() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      port: 3306,
    });

    const [results, fields] = await connection.execute(
      `CREATE TABLE IF NOT EXISTS Posts (
	      id VARCHAR(255) NOT NULL,
	      title VARCHAR(100) NOT NULL,
	      description TEXT,
        publicity VARCHAR(20) NOT NULL DEFAULT 'public',
        userId INT NOT NULL,
        categoryId INT NOT NULL DEFAULT 1,
        numberOfCandidates SMALLINT UNSIGNED NOT NULL, 
        numberOfLikes INT UNSIGNED NOT NULL DEFAULT 0, 
        numberOfComments INT UNSIGNED NOT NULL DEFAULT 0,
        numberOfGames INT UNSIGNED NOT NULL DEFAULT 0,
        viewCount INT UNSIGNED NOT NULL DEFAULT 0,
        dailyViewCount INT UNSIGNED NOT NULL DEFAULT 0,
        monthlyViewCount INT UNSIGNED NOT NULL DEFAULT 0,
        createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP NOT NULL ON UPDATE CURRENT_TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        deletedAt TIMESTAMP,
        PRIMARY KEY (id)
      );`
    );

    console.log(results); // results contains rows returned by server
    console.log(fields); // fields contains extra meta data about results, if available
  } catch (err) {
    console.log(err);
  }
}

async function seedCandidates() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      port: 3306,
    });

    const [results, fields] = await connection.execute(
      `CREATE TABLE IF NOT EXISTS Candidates (
          id VARCHAR(255) NOT NULL,
          postId VARCHAR(255) NOT NULL,
          name VARCHAR(255) NOT NULL,
          url VARCHAR(255) NOT NULL,
          numberOfWins INT UNSIGNED NOT NULL DEFAULT 0,
          numberOfGames INT UNSIGNED NOT NULL DEFAULT 0,
          createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (id)
        );`
    );

    console.log(results); // results contains rows returned by server
    console.log(fields); // fields contains extra meta data about results, if available
  } catch (err) {
    console.log(err);
  }
}

async function seedCategories() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      port: 3306,
    });

    const [results, fields] = await connection.execute(
      `CREATE TABLE IF NOT EXISTS Categories (
        id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(20) NOT NULL,
        PRIMARY KEY (id),
        UNIQUE (name)
      );`
    );

    console.log(results); // results contains rows returned by server
    console.log(fields); // fields contains extra meta data about results, if available
  } catch (err) {
    console.log(err);
  }
}

async function seedThumbnails() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      port: 3306,
    });

    const [results, fields] = await connection.execute(
      `CREATE TABLE IF NOT EXISTS Thumbnails (
        id INT NOT NULL AUTO_INCREMENT,
        postId VARCHAR(255) NOT NULL,
        leftCandidateId VARCHAR(255) NOT NULL,
        rightCandidateId VARCHAR(255) NOT NULL,
        PRIMARY KEY (id),
        FOREIGN KEY (postId) REFERENCES POSTS (id) ON DELETE CASCADE
      );`
    );

    console.log(results); // results contains rows returned by server
    console.log(fields); // fields contains extra meta data about results, if available
  } catch (err) {
    console.log(err);
  }
}

async function seedPostsData() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      port: 3306,
    });

    const insertedPosts = await Promise.all(
      posts.map((post) =>
        connection.execute(
          `INSERT INTO Posts (userId, title, numberOfCandidates, description, categoryId)
                VALUES (${post.userId}, '${post.title}', ${post.numberOfCandidates}, '${post.description}', ${post.categoryId});`
        )
      )
    );

    console.log(insertedPosts);
  } catch (err) {
    console.log(err);
  }
}

async function seedCandidatesData() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      port: 3306,
    });

    const insertedCandidates = await Promise.all(
      candidates.map((candidate) =>
        connection.execute(
          `INSERT INTO Candidates (id, postId, name, url)
                  VALUES ('${uuidv4()}', ${candidate.postId}, '${
            candidate.name
          }', '${candidate.url}');`
        )
      )
    );

    console.log(insertedCandidates);
  } catch (err) {
    console.log(err);
  }
}

async function seedCategoriesData() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      port: 3306,
    });

    const insertedCategories = await Promise.all(
      categories.map((category) =>
        connection.execute(
          `INSERT INTO Categories (name)
                  VALUES ('${category.name}');`
        )
      )
    );

    console.log(insertedCategories); // results contains rows returned by server
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

    // await seedPostsData();
    // await seedCandidatesData();
    await seedCategoriesData();

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
