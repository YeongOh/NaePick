// URLS
// TODO: env에 넣기 => 클라이언트에서 현재 안되는 문제
export const DOMAIN = 'https://naepick.co.kr';

// nanoid: 회원 수 = 월드컵 수 < 후보 수 (num needed for 1% of 1 collision)
export const WORLDCUP_ID_LENGTH = 6; // => 37K
export const USER_ID_LENGTH = 7; // => 297K
export const CANDIDATE_ID_LENGTH = 8; // => 2M
export const COMMENT_ID_LENGTH = 8;
export const OBJECT_ID_LENGTH = 6;

// Create Post Form Validation
export const WORLDCUP_TITLE_MIN_LENGTH = 2;
export const WORLDCUP_TITLE_MAX_LENGTH = 60;
export const WORLDCUP_DESCRIPTION_MAX_LENGTH = 500;

// File Name Limit
export const FILE_NAME_MAX_LENGTH = 60;

export const CATEGORIES = [
  'animations',
  'athletes',
  'celebrities',
  'idols',
  'other',
];

// signup
export const USERNAME_MIN_LENGTH = 4;
export const USERNAME_MAX_LENGTH = 40;
export const NICKNAME_MIN_LENGTH = 2; // should be byte
export const NICKNAME_MAX_LENGTH = 20;
export const EMAIL_MAX_LENGTH = 255;
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 64;

// candidate name length
export const CANDIDATE_NAME_MAX_LENGTH = 25;

// comment
export const COMMENT_TEXT_MAX_LENGTH = 300;

// number of rounds available
export const DEFAULT_ROUNDS = 32;

export function getNumberOfRoundsAvailable(
  numberOfCandidates: number
): number[] {
  const options = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024];
  const result = options.filter((option) => option <= numberOfCandidates);
  return result;
}

// TODO: in env
export const BASE_IMAGE_URL = 'https://cdn.naepick.co.kr/';
