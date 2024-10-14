import { FieldPacket } from 'mysql2/promise';
import {
  Candidate,
  Comment,
  PostCard,
  PostInfo,
  PostStat,
  Thumbnail,
} from './definitions';
import getConnection from './db';

export async function fetchPublicPosts() {
  try {
    const connection = await getConnection();

    const [result, meta]: [PostCard[] & Thumbnail[], FieldPacket[]] =
      await connection.execute(
        `SELECT p.*, c1.name as leftCandidateName, c2.name as rightCandidateName, 
              c1.url as leftCandidateUrl, c2.url as rightCandidateUrl,
              u.nickname as nickname, u.username as username,
              ct.name as categoryName
      FROM Posts p 
      LEFT JOIN Thumbnails t ON p.id = t.postId
      LEFT JOIN Candidates c1 ON t.leftCandidateId = c1.id
      LEFT JOIN Candidates c2 ON t.rightCandidateId = c2.id
      LEFT JOIN Categories ct ON p.categoryId = ct.id
      LEFT JOIN Users u ON p.userId = u.id
      WHERE p.publicity = 'public'
      ORDER BY p.createdAt DESC
      LIMIT 12;`
      );
    console.log(result);

    return result;
  } catch (err) {
    console.log(err);
  }
}

export async function fetchUserAllPosts(userId: string) {
  try {
    const connection = await getConnection();

    const [result, meta]: [PostCard[] & Thumbnail[], FieldPacket[]] =
      await connection.execute(
        `SELECT p.*, c1.name as leftCandidateName, c2.name as rightCandidateName, 
              c1.url as leftCandidateUrl, c2.url as rightCandidateUrl,
              u.nickname as nickname, u.username as username,
              ct.name as categoryName
      FROM Posts p 
      LEFT JOIN Thumbnails t ON p.id = t.postId
      LEFT JOIN Candidates c1 ON t.leftCandidateId = c1.id
      LEFT JOIN Candidates c2 ON t.rightCandidateId = c2.id
      LEFT JOIN Categories ct ON p.categoryId = ct.id
      LEFT JOIN Users u ON p.userId = u.id
      WHERE p.userId = ?
      ORDER BY p.createdAt DESC 
      LIMIT 12;`,
        [userId]
      );
    console.log(result);

    return result;
  } catch (err) {
    console.log(err);
  }
}

export async function fetchAllCategories() {
  try {
    const connection = await getConnection();

    const result: any = await connection.execute(
      `SELECT *
      FROM Categories;`
    );

    return result[0];
  } catch (err) {
    console.log(err);
  }
}

export async function fetchPostByPostId(id: string) {
  try {
    const connection = await getConnection();

    const [result, meta]: [PostInfo[], FieldPacket[]] =
      await connection.execute(
        `SELECT p.*, c.name AS categoryName,
            u.nickname as nickname,
            u.username as username 
       FROM Posts p
       LEFT JOIN Categories c ON p.categoryId = c.id
       LEFT JOIN Users u ON p.userId = u.id
       WHERE p.id = ?;`,
        [id]
      );
    console.log(result);

    return result;
  } catch (err) {
    console.log(err);
  }
}

export async function fetchPostThumbnailByPostId(id: string) {
  try {
    const connection = await getConnection();

    const [result, meta]: [
      PostInfo[] & { leftCandidateId: string; rightCandidateId: string },
      FieldPacket[]
    ] = await connection.execute(
      `SELECT p.*, c.name AS categoryName,
            u.nickname as nickname,
            t.leftCandidateId as leftCandidateId,
            t.rightCandidateId as rightCandidateId,
            u.username as username 
       FROM Posts p
       LEFT JOIN Thumbnails t ON p.id = t.postId
       LEFT JOIN Categories c ON p.categoryId = c.id
       LEFT JOIN Users u ON p.userId = u.id
       WHERE p.id = ?;`,
      [id]
    );
    console.log(result);

    return result;
  } catch (err) {
    console.log(err);
  }
}

export async function fetchPostStatById(id: string) {
  try {
    const connection = await getConnection();

    const [result, meta]: [PostStat[], FieldPacket[]] =
      await connection.execute(
        `SELECT p.*, c.name AS categoryName,
            u.nickname as nickname,
            u.username as username,
            ps.numberOfMatches as numberOfMatches,
            ps.numberOfGames as numberOfGames,
            ps.totalSpentTime as totalSpentTime
       FROM Posts p
       LEFT JOIN Categories c ON p.categoryId = c.id
       LEFT JOIN Users u ON p.userId = u.id
       LEFT JOIN PostStats ps ON p.id = ps.postId
       WHERE p.id = ?;`,
        [id]
      );
    console.log(result);

    return result;
  } catch (err) {
    console.log(err);
  }
}

export async function fetchCommentsByPostId(postId: string) {
  try {
    const connection = await getConnection();

    const [result, meta]: [Comment[], FieldPacket[]] = await connection.execute(
      `SELECT c.*, 
          u.nickname as nickname
       FROM Comments c
       LEFT JOIN Users u ON u.id = c.userId
       WHERE c.postId = ?;`,
      [postId]
    );
    console.log(result);

    return result;
  } catch (err) {
    console.log(err);
  }
}

export async function fetchRandomCandidatesByPostId(
  postId: string,
  round: number | string
) {
  try {
    const connection = await getConnection();
    const roundForSQL = round === typeof 'string' ? round : String(round);

    console.log(postId, round);
    // rand() 이용한 정렬은 인덱스를 이용하지 않기에 데이터가 많을 경우 성능 저하
    const [result, meta]: [Candidate[], FieldPacket[]] =
      await connection.execute(
        `SELECT * 
        FROM Candidates 
        WHERE postId = ? 
        ORDER BY RAND()
        LIMIT ?;`,
        [postId, round === 0 ? '32' : roundForSQL]
      );

    return result;
  } catch (err) {
    console.log(err);
  }
}

export async function fetchCandidatesByPostId(postId: string) {
  try {
    const connection = await getConnection();

    const [result, meta]: [Candidate[], FieldPacket[]] =
      await connection.execute(
        `SELECT * 
        FROM Candidates 
        WHERE postId = ? `,
        [postId]
      );

    return result;
  } catch (err) {
    console.log(err);
  }
}
