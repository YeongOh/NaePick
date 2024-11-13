'use client;';

import { forwardRef, useState } from 'react';
import Button from '@/app/components/ui/button';
import Avatar from '@/app/components/ui/Avatar';
import ToggleableP from '@/app/components/ui/toggleable-p';
import { ChevronDown, ChevronUp, EllipsisVertical, Heart } from 'lucide-react';
import CommentDropdownMenu from './CommentDropdownMenu';
import TextArea from '@/app/components/ui/textarea';
import dayjs from '@/app/utils/dayjs';
import { CommentModel } from './CommentSection';
import { getCommentReplies } from '../actions';
import { useQuery } from '@tanstack/react-query';
import Spinner from '@/app/components/ui/spinner';
import { useDropdown } from '@/app/components/hooks/useDropdown';

interface Props {
  comment: CommentModel;
  userId?: string;
  updateCommentId: string | null;
  replyingId: string | null;
  onLikeComment: (id: string, like: boolean) => void;
  onUpdateCommentToggle: (id: string) => void;
  onUpdateCommentSubmit: (id: string, newText: string) => void;
  onReplyCommentToggle: (id: string | null) => void;
  onReplyCommentSubmit: (replyText: string) => void;
  onOpenDeleteCommentModal: (id: string) => void;
}

const Comment = forwardRef<HTMLLIElement, Props>(function Comment(
  {
    comment,
    userId,
    updateCommentId,
    replyingId,
    onLikeComment,
    onUpdateCommentToggle,
    onUpdateCommentSubmit,
    onReplyCommentToggle,
    onReplyCommentSubmit,
    onOpenDeleteCommentModal,
  }: Props,
  ref,
) {
  const { dropdownId, toggleDropdown } = useDropdown();
  const [newText, setNewText] = useState(comment.text);
  const [replyText, setReplyText] = useState('');
  const [showReplies, setShowReplies] = useState(false);
  const [commentIdGetReplies, setCommentIdGetReplies] = useState<string | null>(null);
  const { data: replies, isFetching } = useQuery({
    queryKey: ['replies', { parentId: comment.id }],
    queryFn: () => getCommentReplies(comment.id, userId),
    enabled: !!commentIdGetReplies,
  });

  const handleGetReplies = async () => {
    setCommentIdGetReplies(comment.id);
  };

  return (
    <li key={comment.id}>
      <div className="flex justify-between">
        <div className="pt-2">
          <Avatar profilePath={comment.profilePath} size="small" alt={comment.nickname} />
        </div>
        <div className="w-full pl-2">
          <div className="mb-1">
            <span
              className={`mr-3 text-base font-semibold ${
                !comment.isAnonymous && comment.nickname ? 'text-slate-700' : 'text-gray-500'
              }`}
            >
              {comment.isAnonymous ? '익명' : comment.nickname ? comment.nickname : '탈퇴한 회원'}
            </span>
            {comment.voted ? (
              <span className="text-sm text-gray-500">
                {comment.voted}
                {'  -  '}
              </span>
            ) : null}
            <span
              className="text-sm text-gray-500"
              title={dayjs(comment.createdAt).format('YYYY년 MM월 DD일 HH시 MM분')}
            >
              {dayjs(comment.createdAt).fromNow()}
            </span>
          </div>
          {updateCommentId === comment.id ? (
            <>
              <TextArea
                id="editText"
                name="editText"
                value={newText}
                className={`mb-1 p-2`}
                onChange={(e) => setNewText(e.target.value)}
                autoFocus
                onFocus={(e) => {
                  const temp = newText;
                  e.target.value = '';
                  e.target.value = temp;
                }}
                rows={2}
              />
              <div className="flex w-full justify-end">
                <div className="flex w-[40%] gap-2">
                  <Button
                    type="button"
                    size="small"
                    onClick={() => {
                      onUpdateCommentToggle(comment.id);
                      setNewText(comment.text);
                    }}
                    variant="ghost"
                  >
                    취소
                  </Button>
                  <Button
                    type="button"
                    size="small"
                    variant="primary"
                    onClick={() => onUpdateCommentSubmit(comment.id, newText)}
                  >
                    확인
                  </Button>
                </div>
              </div>
            </>
          ) : null}
          {updateCommentId !== comment.id ? (
            <div>
              <ToggleableP className={'text-slate-700 lg:mb-1'} text={comment.text} numberOfLines={3} />
              <div className="flex -translate-x-1.5 items-center gap-1">
                <button
                  onClick={() => {
                    onLikeComment(comment.id, !comment.isLiked);
                  }}
                  className="flex h-8 w-8 items-center justify-center"
                  type="button"
                >
                  <Heart color={comment.isLiked ? '#f87171' : '#6b7280'} size="1.2rem" />
                </button>
                <span className="mr-2 text-base text-gray-500">{comment.likeCount}</span>
                <button
                  type="button"
                  className="text-sm text-slate-700"
                  onClick={() => onReplyCommentToggle(comment.id)}
                >
                  답글
                </button>
              </div>
            </div>
          ) : null}
          {comment.replyCount && comment.replyCount > 0 ? (
            <button
              onClick={() => {
                if (!showReplies) {
                  handleGetReplies();
                }
                setShowReplies((prev) => !prev);
              }}
              className="mb-1 flex gap-1 text-base text-blue-500 hover:text-blue-600 active:text-blue-700"
            >
              {showReplies ? <ChevronUp /> : <ChevronDown />} 답글 {comment.replyCount}개
            </button>
          ) : null}
          {replyingId === comment.id ? (
            <>
              <TextArea
                id="replyText"
                name="replyText"
                value={replyText}
                className={`mb-1 p-2`}
                onChange={(e) => setReplyText(e.target.value)}
                rows={1}
                autoFocus
              />
              <div className="flex w-full justify-end">
                <div className="flex w-[40%] gap-2">
                  <Button
                    type="button"
                    size="small"
                    onClick={() => {
                      setReplyText('');
                      onReplyCommentToggle(null);
                    }}
                    variant="ghost"
                  >
                    취소
                  </Button>
                  <Button
                    type="button"
                    size="small"
                    variant="primary"
                    onClick={() => {
                      onReplyCommentSubmit(replyText);
                      setReplyText('');
                    }}
                  >
                    확인
                  </Button>
                </div>
              </div>
            </>
          ) : null}
        </div>
        {comment.userId === userId ? (
          <div className="relative mt-2 h-10 w-10">
            <button
              type="button"
              className={`dropdown-menu-toggle flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-primary-50 active:bg-primary-200`}
              onClick={(e) => {
                e.stopPropagation();
                toggleDropdown(comment.id);
              }}
            >
              <EllipsisVertical size="1.2rem" />
            </button>
            <CommentDropdownMenu
              openDropdownMenu={dropdownId === comment.id}
              onOpenDeleteCommentModal={() => onOpenDeleteCommentModal(comment.id)}
              onUpdateCommentToggle={() => onUpdateCommentToggle(comment.id)}
            />
          </div>
        ) : null}
      </div>
      <ul className="flex justify-end">
        <ul className="flex w-[calc(100%-2.5rem)] flex-col">
          {showReplies && replies
            ? replies?.map((reply) => (
                <Comment
                  key={reply.id}
                  comment={reply}
                  userId={userId}
                  updateCommentId={updateCommentId}
                  replyingId={replyingId}
                  onLikeComment={onLikeComment}
                  onUpdateCommentToggle={onUpdateCommentToggle}
                  onUpdateCommentSubmit={onUpdateCommentSubmit}
                  onReplyCommentToggle={onReplyCommentToggle}
                  onReplyCommentSubmit={onReplyCommentSubmit}
                  onOpenDeleteCommentModal={onOpenDeleteCommentModal}
                />
              ))
            : null}
        </ul>
        {isFetching ? (
          <div className="relative mt-10 flex items-center justify-center">
            <div className="absolute">
              <Spinner />
            </div>
          </div>
        ) : null}
      </ul>
    </li>
  );
});

export default Comment;
