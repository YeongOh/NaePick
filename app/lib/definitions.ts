export type Post = {
  id: string;
  title: string;
  description: string;
  publicity: 'public' | 'unlisted' | 'private';
  userId: string; // userName
  categoryId: number; // categoryName
  numberOfCandidates: number;
  numberOfLikes: number;
  numberOfComments: number;
  numberOfGames: number;
  createdAt: string;
  updatedAt: string;
};

export type Candidate = {
  id: string;
  name: string;
  url: string;
  postId: string;
  numberOfWins: number;
  numberOfGames: number;
  createdAt: string;
  updatedAt: string;
};

export type Category = {
  id: string;
  name: string;
};

export type Thumbnail = {
  id: string;
  postId: string;
  leftCandidateId: string;
  rightCandidateId: string;
};

export function getCategoryInKorean(categoryName: string): string {
  switch (categoryName) {
    case 'animations':
      return '애니메이션';
    case 'athletes':
      return '운동선수';
    case 'celebrities':
      return '유명인';
    case 'idols':
      return '아이돌';
    case 'other':
      return '기타';
    default:
      return '오류';
  }
}
