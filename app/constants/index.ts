// URLS
export const DOMAIN = 'https://naepick.co.kr';
export const IMG_ORIGIN = 'https://cdn.naepick.co.kr';
export const VIDEO_ORIGIN = 'https://cdn.naepick.co.kr';

// nanoid: 회원 수 = 월드컵 수 < 후보 수 (num needed for 1% of 1 collision)
export const WORLDCUP_ID_LENGTH = 6; // => 37K
export const USER_ID_LENGTH = 7; // => 297K
export const CANDIDATE_ID_LENGTH = 8; // => 2M
export const COMMENT_ID_LENGTH = 8;
export const OBJECT_ID_LENGTH = 6;

export const MIN_NUMBER_OF_CANDIDATES = 2;

// Create Post Form Validation
export const WORLDCUP_TITLE_MIN_LENGTH = 2;
export const WORLDCUP_TITLE_MAX_LENGTH = 60;
export const WORLDCUP_DESCRIPTION_MAX_LENGTH = 500;

// File Name Limit
export const FILE_NAME_MAX_LENGTH = 60;

// signup
export const USERNAME_MIN_LENGTH = 4;
export const USERNAME_MAX_LENGTH = 40;
export const NICKNAME_MIN_LENGTH = 2; // should be byte
export const NICKNAME_MAX_LENGTH = 20;
export const EMAIL_MAX_LENGTH = 255;
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 64;

// candidate name length
export const CANDIDATE_NAME_MAX_LENGTH = 100;

// comment
export const COMMENT_TEXT_MAX_LENGTH = 300;

// number of rounds available
export const DEFAULT_ROUNDS = 32;

export const CHZZK_THUMBNAIL_URL =
  'https://nng-phinf.pstatic.net/MjAyMzEyMDZfMTU4/MDAxNzAxODM5NjIxMzUz.Ni9QdFjPNWRClkoo8bLmHEUojK9LQTo8H9Ngj7igRh8g.w9RX4vkKEYZuBj7Q8BKk4tdvh9fE7w8wlU7Z9aAV6Tgg.PNG/Android.png';

export const enum MatchStatus {
  SELECTING_ROUNDS,
  IDLE,
  PICK_LEFT,
  PICK_RIGHT,
  END,
}

export type MatchStatusType = (typeof MatchStatus)[keyof typeof MatchStatus];
