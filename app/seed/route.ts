import { pool } from '../lib/db';

async function seedWorldcup() {
  try {
    // const [results, fields] = await pool.query(
    //   `CREATE TABLE IF NOT EXISTS Posts (
    //     id VARCHAR(255) NOT NULL,
    //     title VARCHAR(100) NOT NULL,
    //     description TEXT,
    //     publicity VARCHAR(20) NOT NULL DEFAULT 'public',
    //     userId VARCHAR(40) NOT NULL,
    //     categoryId INT NOT NULL DEFAULT 1,
    //     numberOfCandidates SMALLINT UNSIGNED NOT NULL,
    //     createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    //     updatedAt TIMESTAMP NOT NULL ON UPDATE CURRENT_TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    //     deletedAt TIMESTAMP,
    //     PRIMARY KEY (id)
    //   );`
    // );

    // new
    const [results2, fields2] = await pool.query(
      `CREATE TABLE IF NOT EXISTS worldcup (
	      worldcup_id VARCHAR(255) NOT NULL,
	      title VARCHAR(30) NOT NULL,
	      description VARCHAR(300),
        publicity ENUM('public', 'private', 'unlisted') NOT NULL DEFAULT 'public',
        user_id VARCHAR(255) DEFAULT NULL,
        category_id INT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL ON UPDATE CURRENT_TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP DEFAULT NULL,
        PRIMARY KEY (worldcup_id),
        FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE SET NULL,
        FOREIGN KEY (category_id) REFERENCES category(category_id)
      );`
    );

    console.log(results2);
  } catch (err) {
    console.log(err);
  }
}

// async function seedPostStats() {
//   try {
//     const [results, fields] = await pool.query(
//       `CREATE TABLE IF NOT EXISTS PostStats (
// 	      id VARCHAR(255) NOT NULL,
//         postId VARCHAR(255) NOT NULL,
//         numberOfMatches INT UNSIGNED NOT NULL DEFAULT 0,
//         numberOfGames INT UNSIGNED NOT NULL DEFAULT 0,
//         totalSpentTime BIGINT UNSIGNED NOT NULL DEFAULT 0,
//         createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
//         updatedAt TIMESTAMP NOT NULL ON UPDATE CURRENT_TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         deletedAt TIMESTAMP,
//         PRIMARY KEY (id)
//       );`
//     );
//   } catch (err) {
//     console.log(err);
//   }
// }

async function seedCandidates() {
  try {
    // const [results, fields] = await pool.query(
    //   `CREATE TABLE IF NOT EXISTS Candidates (
    //       id VARCHAR(255) NOT NULL,
    //       postId VARCHAR(255) NOT NULL,
    //       name VARCHAR(255) NOT NULL,
    //       url VARCHAR(255) NOT NULL,
    //       numberOfMatches INT UNSIGNED NOT NULL DEFAULT 0,
    //       numberOfMatchesWon INT UNSIGNED NOT NULL DEFAULT 0,
    //       numberOfGames INT UNSIGNED NOT NULL DEFAULT 0,
    //       numberOfGamesWon INT UNSIGNED NOT NULL DEFAULT 0,
    //       spentTime BIGINT UNSIGNED NOT NULL DEFAULT 0,
    //       createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    //       updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    //       PRIMARY KEY (id)
    //     );`
    // );

    const [results2, fields2] = await pool.query(
      `CREATE TABLE IF NOT EXISTS candidate (
          candidate_id VARCHAR(255) NOT NULL,
          worldcup_id VARCHAR(255) DEFAULT NULL,
          name VARCHAR(255) NOT NULL,
          url VARCHAR(255) NOT NULL,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (candidate_id),
          FOREIGN KEY (worldcup_id) REFERENCES worldcup(worldcup_id) ON DELETE CASCADE
        );`
    );

    console.log(results2);
    console.log(fields2);
  } catch (err) {
    console.log(err);
  }
}

async function seedCategory() {
  try {
    // const [results, fields] = await pool.query(
    //   `CREATE TABLE IF NOT EXISTS Categories (
    //     id INT NOT NULL AUTO_INCREMENT,
    //     name VARCHAR(20) NOT NULL,
    //     PRIMARY KEY (id),
    //     UNIQUE (name)
    //   );`
    // );

    const [results2, fields2] = await pool.query(
      `CREATE TABLE IF NOT EXISTS category (
        category_id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(20) NOT NULL,
        PRIMARY KEY (category_id),
        UNIQUE (name)
      );`
    );

    console.log(results2);
    console.log(fields2);
  } catch (err) {
    console.log(err);
  }
}

async function seedThumbnail() {
  try {
    // const [results, fields] = await pool.query(
    //   `CREATE TABLE IF NOT EXISTS Thumbnails (
    //     id VARCHAR(255) NOT NULL,
    //     postId VARCHAR(255) NOT NULL,
    //     leftCandidateId VARCHAR(255) NOT NULL,
    //     rightCandidateId VARCHAR(255) NOT NULL,
    //     PRIMARY KEY (id),
    //   );`
    // );

    const [results2, fields2] = await pool.query(
      `CREATE TABLE IF NOT EXISTS thumbnail (
        thumbnail_id VARCHAR(255) NOT NULL,
        worldcup_id VARCHAR(255) NOT NULL,
        left_candidate_id VARCHAR(255) NOT NULL,
        right_candidate_id VARCHAR(255) NOT NULL,
        PRIMARY KEY (thumbnail_id),
        FOREIGN KEY (worldcup_id) REFERENCES worldcup(worldcup_id) ON DELETE CASCADE,
        FOREIGN KEY (left_candidate_id) REFERENCES candidate(candidate_id) ON DELETE CASCADE,
        FOREIGN KEY (right_candidate_id) REFERENCES candidate(candidate_id) ON DELETE CASCADE
      );`
    );

    console.log(results2);
    console.log(fields2);
  } catch (err) {
    console.log(err);
  }
}

async function seedCategoryData() {
  try {
    const insertedCategories = await Promise.all(
      ['animations', 'athletes', 'celebrities', 'idols', 'other'].map(
        (category) =>
          pool.query(
            `INSERT INTO Category (name)
                  VALUES ('${category}');`
          )
      )
    );

    console.log(insertedCategories);
  } catch (err) {
    console.log(err);
  }
}

async function seedUser() {
  try {
    // const [results, fields] = await pool.query(
    //   `CREATE TABLE IF NOT EXISTS Users (
    //     id VARCHAR(255) NOT NULL,
    //     username VARCHAR(40) NOT NULL,
    //     nickname VARCHAR(40) NOT NULL,
    //     role VARCHAR(20) NOT NULL,
    //     email VARCHAR(80) NOT NULL,
    //     emailConfirmedAt TIMESTAMP,
    //     password VARCHAR(255) NOT NULL,
    //     createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    //     updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    //     PRIMARY KEY (id),
    //     UNIQUE (username, nickname)
    //   );`
    // );

    const [results2, fields2] = await pool.query(
      `CREATE TABLE IF NOT EXISTS user (
        user_id VARCHAR(255) NOT NULL,
        nickname VARCHAR(20) NOT NULL,
        email VARCHAR(255) NOT NULL,
        email_confirmed_at TIMESTAMP DEFAULT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id),
        UNIQUE (email),
        UNIQUE (nickname)
      );`
    );

    console.log(results2);
    console.log(fields2);
  } catch (err) {
    console.log(err);
  }
}

async function seedComment() {
  try {
    // const [results, fields] = await pool.query(
    //   `CREATE TABLE IF NOT EXISTS Comments (
    //     id VARCHAR(255) NOT NULL,
    //     postId VARCHAR(255) NOT NULL,
    //     parentId VARCHAR(255),
    //     userId VARCHAR(255),
    //     text Text NOT NULL,
    //     createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    //     updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    //     PRIMARY KEY (id)
    //   );`
    // );

    const [results2, fields2] = await pool.query(
      `CREATE TABLE IF NOT EXISTS comment (
        comment_id VARCHAR(255) NOT NULL,
        worldcup_id VARCHAR(255) NOT NULL,
        parent_comment_id VARCHAR(255) DEFAULT NULL,
        user_id VARCHAR(255) DEFAULT NULL,
        text VARCHAR(300) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (comment_id),
        FOREIGN KEY (worldcup_id) REFERENCES worldcup(worldcup_id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES worldcup(user_id) ON DELETE SET NULL,
        FOREIGN KEY (parent_comment_id) REFERENCES comment(comment_id)
      );`
    );

    console.log(results2);
    console.log(fields2);
  } catch (err) {
    console.log(err);
  }
}

export async function GET() {
  try {
    await seedCategory();
    await seedCategoryData();
    await seedUser();
    await seedWorldcup();
    await seedCandidates();
    await seedThumbnail();
    // await seedPostStats();
    await seedComment();

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
