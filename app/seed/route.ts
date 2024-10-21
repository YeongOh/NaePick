import { pool } from '../lib/db';

async function seedWorldcup() {
  try {
    const [results, fields] = await pool.query(
      `CREATE TABLE IF NOT EXISTS worldcup (
	      worldcup_id VARCHAR(255) NOT NULL,
	      title VARCHAR(60) NOT NULL,
	      description VARCHAR(500),
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

    console.log(results);
  } catch (err) {
    console.log(err);
  }
}

async function seedCandidates() {
  try {
    // TODO: gif, imgur 타입추가
    // TODO: youtube 추가
    const [result, fields] = await pool.query(
      `CREATE TABLE IF NOT EXISTS candidate (
          candidate_id VARCHAR(255) NOT NULL,
          worldcup_id VARCHAR(255) DEFAULT NULL,
          name VARCHAR(255) NOT NULL,
          url VARCHAR(255) NOT NULL,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (candidate_id),
          FOREIGN KEY (worldcup_id) REFERENCES worldcup(worldcup_id) ON DELETE CASCADE
        );`
    );

    console.log(result);
    console.log(fields);
  } catch (err) {
    console.log(err);
  }
}

async function seedCategory() {
  try {
    const [results, fields] = await pool.query(
      `CREATE TABLE IF NOT EXISTS category (
        category_id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(20) NOT NULL,
        PRIMARY KEY (category_id),
        UNIQUE (name)
      );`
    );

    console.log(results);
    console.log(fields);
  } catch (err) {
    console.log(err);
  }
}

async function seedThumbnail() {
  try {
    const [results, fields] = await pool.query(
      `CREATE TABLE IF NOT EXISTS thumbnail (
        thumbnail_id INT NOT NULL AUTO_INCREMENT,
        worldcup_id VARCHAR(255) NOT NULL,
        left_candidate_id VARCHAR(255) NOT NULL,
        right_candidate_id VARCHAR(255) NOT NULL,
        PRIMARY KEY (thumbnail_id),
        FOREIGN KEY (worldcup_id) REFERENCES worldcup(worldcup_id) ON DELETE CASCADE,
        FOREIGN KEY (left_candidate_id) REFERENCES candidate(candidate_id) ON DELETE CASCADE,
        FOREIGN KEY (right_candidate_id) REFERENCES candidate(candidate_id) ON DELETE CASCADE
      );`
    );

    console.log(results);
    console.log(fields);
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
    const [results, fields] = await pool.query(
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

    console.log(results);
    console.log(fields);
  } catch (err) {
    console.log(err);
  }
}

async function seedMatch() {
  try {
    const [results, fields] = await pool.query(
      `CREATE TABLE IF NOT EXISTS match_result (
        match_result_id INT NOT NULL AUTO_INCREMENT,
        worldcup_id VARCHAR(255) NOT NULL,
        winner_candidate_id VARCHAR(255) NOT NULL,
        loser_candidate_id VARCHAR(255) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (match_result_id),
        FOREIGN KEY (worldcup_id) REFERENCES worldcup(worldcup_id) ON DELETE CASCADE,
        FOREIGN KEY (winner_candidate_id) REFERENCES candidate(candidate_id) ON DELETE CASCADE,
        FOREIGN KEY (loser_candidate_id) REFERENCES candidate(candidate_id) ON DELETE CASCADE
      );`
    );

    console.log(results);
    console.log(fields);
  } catch (err) {
    console.log(err);
  }
}

async function seedChampion() {
  try {
    const [results, fields] = await pool.query(
      `CREATE TABLE IF NOT EXISTS champion (
        champion_id INT NOT NULL AUTO_INCREMENT,
        worldcup_id VARCHAR(255) NOT NULL,
        candidate_id VARCHAR(255) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (champion_id),
        FOREIGN KEY (worldcup_id) REFERENCES worldcup(worldcup_id) ON DELETE CASCADE,
        FOREIGN KEY (candidate_id) REFERENCES candidate(candidate_id) ON DELETE CASCADE
      );`
    );

    console.log(results);
    console.log(fields);
  } catch (err) {
    console.log(err);
  }
}

async function seedComment() {
  try {
    const [results, fields] = await pool.query(
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

    console.log(results);
    console.log(fields);
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
    await seedMatch();
    await seedChampion();
    await seedComment();

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
