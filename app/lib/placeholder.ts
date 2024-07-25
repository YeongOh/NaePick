import { v4 as uuidv4 } from 'uuid';

const post1Id = uuidv4();
const post2Id = uuidv4();

export const posts = [
  {
    id: post1Id,
    title: '주술회전',
    userId: 723,
    numberOfCandidates: 4,
    description: '주술회전에 관한 월드컵입니다',
    categoryId: 1,
  },
  {
    id: post2Id,
    title: '원피스',
    userId: 723,
    numberOfCandidates: 4,
    description: '원피스에 관한 월드컵입니다',
    categoryId: 1,
  },
];

export const candidates = [
  { postId: post1Id, url: '/toji.webp', name: '토우지' },
  { postId: post1Id, url: '/megumi.jpg', name: '메구미' },
  { postId: post1Id, url: '/geto.jpg', name: '게토' },
  { postId: post1Id, url: '/gojo.webp', name: '고죠' },
  { postId: post2Id, url: '/nami.jpg', name: '나미' },
  { postId: post2Id, url: '/ruffy.jpg', name: '루피' },
  { postId: post2Id, url: '/sanji.jpg', name: '상디' },
  { postId: post2Id, url: '/zoro/.jpg', name: '조로' },
];

export const categories = [
  { name: 'other' },
  { name: 'animations' },
  { name: 'idols' },
  { name: 'celebrities' },
  { name: 'athletes' },
];
