'use client;';

import { forwardRef, useState } from 'react';
import Button from '@/app/components/ui/button';
import Avatar from '@/app/components/ui/Avatar';
import ToggleableP from '@/app/components/ui/toggleable-p';
import { EllipsisVertical, Heart } from 'lucide-react';
import CommentDropdownMenu from './CommentDropdownMenu';
import TextArea from '@/app/components/ui/textarea';
import dayjs from '@/app/utils/dayjs';
import toast from 'react-hot-toast';
import { COMMENT_TEXT_MAX_LENGTH } from '@/app/constants';
import { cancelLikeCommentAction, likeCommentAction, updateCommentAction } from '../actions';
import { CommentModel } from './CommentSection';

interface Props {
  comment: CommentModel;
  userId?: string;
  dropdownMenuId: string | null;
  onUpdateComment: (commentId: string, newText: string) => void;
  onLikeComment: (commentId: string, isLiked: boolean) => void;
  setOpenDeleteConfirmModal: React.Dispatch<React.SetStateAction<boolean>>;
  setDropdownMenuId: React.Dispatch<React.SetStateAction<string | null>>;
}

const Comment = forwardRef<HTMLLIElement, Props>(function Comment(
  {
    comment,
    onUpdateComment,
    userId,
    setDropdownMenuId,
    dropdownMenuId,
    setOpenDeleteConfirmModal,
    onLikeComment,
  }: Props,
  ref
) {
  const [updateCommentId, setUpdateCommentId] = useState<string | null>(null);
  const [newText, setNewText] = useState('');
  const [isLikeCommentLoading, setIsLikeCommentLoading] = useState(false);

  const handleEditSubmit = async () => {
    try {
      if (!updateCommentId) return;
      if (newText.length <= 0) {
        toast.error('최소 0자 이상이어야 합니다.');
        return;
      }
      if (newText.length > COMMENT_TEXT_MAX_LENGTH) {
        toast.error(`최소 ${COMMENT_TEXT_MAX_LENGTH}자 이하여야 합니다.`);
        return;
      }

      await updateCommentAction(updateCommentId, newText);
      onUpdateComment(updateCommentId, newText);
      setNewText('');
      setUpdateCommentId(null);
      toast.success('댓글이 수정되었습니다.');
    } catch (error) {
      console.error(error);
      toast.error('댓글을 수정하지 못했습니다.');
    }
  };

  const handleLikeComment = async (commentId: string) => {
    try {
      if (!userId) {
        toast.error('로그인이 필요합니다!');
        return;
      }
      if (isLikeCommentLoading) return;
      setIsLikeCommentLoading(true);

      if (comment.isLiked) {
        await cancelLikeCommentAction(commentId, userId);
      } else {
        await likeCommentAction(commentId, userId);
      }
      onLikeComment(commentId, !comment.isLiked);
    } catch (error) {
      console.error(error);
      toast.error('좋아요에 실패했습니다.');
    } finally {
      setIsLikeCommentLoading(false);
    }
  };

  return (
    <li className="mb-1" key={comment.id}>
      <div className="flex justify-between">
        <div className="mt-2 mr-3">
          <Avatar profilePath={comment.profilePath} size="small" alt={comment.nickname} />
        </div>
        <div className="w-full">
          <div className="mb-1">
            <span
              className={`mr-3 font-semibold text-base ${
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
          {updateCommentId !== comment.id ? (
            <div>
              <ToggleableP className={'text-slate-700 mb-1'} text={comment.text} numberOfLines={3} />
              <div className="flex items-center -translate-x-1.5">
                <button
                  onClick={() => handleLikeComment(comment.id)}
                  className="w-8 h-8 flex justify-center items-center"
                  type="button"
                >
                  <Heart color={comment.isLiked ? '#f87171' : '#6b7280'} size="1.2rem" />
                </button>
                <span className="text-base text-gray-500">{comment.likeCount}</span>
              </div>
            </div>
          ) : (
            <>
              <TextArea
                id="editText"
                name="editText"
                value={newText}
                className={`p-2 mb-1`}
                onChange={(e) => setNewText(e.target.value)}
                rows={2}
              />
              <div className="flex w-full justify-end">
                <div className="w-[40%] flex gap-2">
                  <Button type="button" size="small" onClick={() => setUpdateCommentId(null)} variant="ghost">
                    취소
                  </Button>
                  <Button type="button" size="small" variant="primary" onClick={handleEditSubmit}>
                    확인
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
        {comment.userId === userId ? (
          <div className="relative w-10 h-10 mt-2">
            <button
              type="button"
              className={`dropdown-menu-toggle transition-colors hover:bg-primary-50 active:bg-primary-200 rounded-full w-10 h-10 flex justify-center items-center`}
              onClick={(e) => {
                e.stopPropagation();
                if (comment.id !== dropdownMenuId) {
                  setDropdownMenuId(comment.id);
                } else {
                  setDropdownMenuId(null);
                }
              }}
            >
              <EllipsisVertical size="1.2rem" />
            </button>
            <CommentDropdownMenu
              openDropdownMenu={comment.id === dropdownMenuId}
              onOpenDeleteCommentModal={() => setOpenDeleteConfirmModal(true)}
              startEditComment={() => {
                setNewText(comment.text);
                setUpdateCommentId(comment.id);
                setDropdownMenuId(null);
              }}
            />
          </div>
        ) : null}
      </div>
    </li>
  );
});

export default Comment;
