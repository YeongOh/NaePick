'use client;';

import { forwardRef, useState } from 'react';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ChevronDown, ChevronUp, EllipsisVertical, Heart } from 'lucide-react';
import toast from 'react-hot-toast';

import ExpandableText from '@/app/components/ui/ExpandableText';
import OldAvatar from '@/app/components/ui/OldAvatar/OldAvatar';
import OldButton from '@/app/components/ui/OldButton/OldButton';
import Spinner from '@/app/components/ui/oldSpinner';
import TextArea from '@/app/components/ui/textarea';
import { COMMENT_TEXT_MAX_LENGTH } from '@/app/constants';
import dayjs from '@/app/utils/dayjs';
import { useDropdown } from '@/hooks/useDropdown';

import CommentDropdownMenu from './CommentDropdownMenu';
import { getCommentReplies, replyCommentAction } from '../actions';
import { WorldcupComment } from '../types';

interface Props {
  comment: WorldcupComment;
  userId?: string;
  updateCommentId: string | null;
  finalWinnerCandidateId?: string;
  worldcupId: string;
  onLikeComment: (id: string, like: boolean) => void;
  onUpdateCommentToggle: (id: string) => void;
  onUpdateCommentSubmit: (id: string, newText: string) => void;
  onOpenDeleteCommentModal: (id: string) => void;
}

const Comment = forwardRef<HTMLLIElement, Props>(function Comment(
  {
    comment,
    userId,
    updateCommentId,
    finalWinnerCandidateId,
    worldcupId,
    onLikeComment,
    onUpdateCommentToggle,
    onUpdateCommentSubmit,
    onOpenDeleteCommentModal,
  }: Props,
  ref,
) {
  const { dropdownId, toggleDropdown } = useDropdown();
  const [newText, setNewText] = useState(comment.text);
  const [replyText, setReplyText] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [fetchForNewReplyComment, setFetchForNewReplyComment] = useState(false);
  const { data: replies, isLoading: isLoadingReplies } = useQuery({
    queryKey: ['replies', { parentId: comment.id }],
    queryFn: () => getCommentReplies(comment.id, userId),
    enabled: !!showReplies || fetchForNewReplyComment,
  });
  const queryClient = useQueryClient();
  const replyCommentMutation = useMutation({
    mutationFn: ({
      parentId,
      text,
      worldcupId,
      votedCandidateId,
    }: {
      text: string;
      votedCandidateId?: string;
      parentId: string;
      worldcupId: string;
    }) => {
      return replyCommentAction({
        text,
        votedCandidateId,
        parentId,
        worldcupId,
      });
    },

    onSuccess: (data, { worldcupId, parentId }) => {
      queryClient.setQueryData(['comment-count', { worldcupId }], (oldCount: number) => oldCount + 1);
      queryClient.invalidateQueries({
        queryKey: ['replies', { parentId }],
      });
      queryClient.invalidateQueries({
        queryKey: ['comments', { worldcupId }],
      });
      setFetchForNewReplyComment(true);
    },

    onError: (error, data, variables) => {
      console.error(error);
      toast.error(error.message);
    },
  });

  const handleReplyCommentSubmit = (parentId: string, replyText: string) => {
    if (replyText.length <= 0) {
      toast.error('최소 0자 이상이어야 합니다.');
      return;
    }
    if (replyText.length > COMMENT_TEXT_MAX_LENGTH) {
      toast.error(`최소 ${COMMENT_TEXT_MAX_LENGTH}자 이하여야 합니다.`);
      return;
    }

    replyCommentMutation.mutate({
      text: replyText,
      votedCandidateId: finalWinnerCandidateId,
      parentId,
      worldcupId,
    });
    setIsReplying(false);
  };

  return (
    <li key={comment.id}>
      <div className="flex justify-between">
        <div className="pt-2">
          <OldAvatar profilePath={comment.profilePath} size="small" alt={comment.nickname} />
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
                  <OldButton
                    type="button"
                    size="small"
                    onClick={() => {
                      onUpdateCommentToggle(comment.id);
                      setNewText(comment.text);
                    }}
                    variant="ghost"
                  >
                    취소
                  </OldButton>
                  <OldButton
                    type="button"
                    size="small"
                    variant="primary"
                    onClick={() => onUpdateCommentSubmit(comment.id, newText)}
                  >
                    확인
                  </OldButton>
                </div>
              </div>
            </>
          ) : null}
          {updateCommentId !== comment.id ? (
            <div>
              <ExpandableText className={'text-slate-700 lg:mb-1'} text={comment.text} numberOfLines={3} />
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
                <button type="button" className="text-sm text-slate-700" onClick={() => setIsReplying(true)}>
                  답글
                </button>
              </div>
            </div>
          ) : null}
          {comment.replyCount && comment.replyCount > 0 ? (
            <button
              onClick={() => {
                if (!showReplies) {
                  setFetchForNewReplyComment(false);
                }
                setShowReplies((prev) => !prev);
              }}
              className="mb-1 flex gap-1 text-base text-blue-500 hover:text-blue-600 active:text-blue-700"
            >
              {showReplies ? <ChevronUp /> : <ChevronDown />} 답글 {comment.replyCount}개
            </button>
          ) : null}
          {isReplying ? (
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
                  <OldButton
                    type="button"
                    size="small"
                    onClick={() => {
                      setReplyText('');
                      setIsReplying(false);
                    }}
                    variant="ghost"
                  >
                    취소
                  </OldButton>
                  <OldButton
                    type="button"
                    size="small"
                    variant="primary"
                    onClick={() => {
                      handleReplyCommentSubmit(comment.parentId ?? comment.id, replyText);
                      setReplyText('');
                    }}
                  >
                    확인
                  </OldButton>
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
      {replyCommentMutation.isPending && (
        <div className="flex justify-center">
          <Spinner />
        </div>
      )}
      <div className="flex justify-end">
        <ul className="relative flex w-[calc(100%-2.5rem)] flex-col">
          {showReplies && replies
            ? replies?.map((reply) => (
                <Comment
                  key={reply.id}
                  comment={reply}
                  userId={userId}
                  worldcupId={worldcupId}
                  finalWinnerCandidateId={finalWinnerCandidateId}
                  updateCommentId={updateCommentId}
                  onLikeComment={onLikeComment}
                  onUpdateCommentToggle={onUpdateCommentToggle}
                  onUpdateCommentSubmit={onUpdateCommentSubmit}
                  onOpenDeleteCommentModal={onOpenDeleteCommentModal}
                />
              ))
            : null}
          {!showReplies && fetchForNewReplyComment && !isLoadingReplies && replies && (
            <Comment
              key={replies[replies.length - 1].id}
              comment={replies[replies.length - 1]}
              userId={userId}
              worldcupId={worldcupId}
              finalWinnerCandidateId={finalWinnerCandidateId}
              updateCommentId={updateCommentId}
              onLikeComment={onLikeComment}
              onUpdateCommentToggle={onUpdateCommentToggle}
              onUpdateCommentSubmit={onUpdateCommentSubmit}
              onOpenDeleteCommentModal={onOpenDeleteCommentModal}
            />
          )}
        </ul>
      </div>
      {isLoadingReplies && (
        <div className="flex justify-center">
          <Spinner />
        </div>
      )}
    </li>
  );
});

export default Comment;
