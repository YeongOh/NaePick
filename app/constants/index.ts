// Create Post Form Validation
export const POST_TITLE_MIN_LENGTH = 4;
export const POST_TITLE_MAX_LENGTH = 100;
export const POST_DESCRIPTION_MAX_LENGTH = 300;

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
export const NICKNAME_MIN_LENGTH = 3;
export const NICKNAME_MAX_LENGTH = 12;
export const EMAIL_MAX_LENGTH = 40;
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 40;

// comment
export const COMMENT_MAX_LENGTH = 100;

// number of rounds available
export function getNumberOfRoundsAvailable(
  numberOfCandidates: number
): number[] {
  const options = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024];

  const result = options.filter((option) => option <= numberOfCandidates);
  return result;
}
