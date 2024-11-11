'use client;';

import { forwardRef, useState } from 'react';
import Button from '@/app/components/ui/button';
import Avatar from '@/app/components/ui/Avatar';
import ToggleableP from '@/app/components/ui/toggleable-p';
import { EllipsisVertical, Heart } from 'lucide-react';
import CommentDropdownMenu from './CommentDropdownMenu';
import TextArea from '@/app/components/ui/textarea';
import dayjs from '@/app/utils/dayjs';
import { CommentModel } from './CommentSection';

interface Props {
  comment: CommentModel;
  userId?: string;
  isOpenDropdownMenu: boolean;
  isUpdatingText: boolean;
  onUpdateCommentToggle: () => void;
  onUpdateCommentSubmit: (newText: string) => void;
  onLikeComment: () => void;
  onOpenDeleteCommentModal: () => void;
  onToggleDropdownMenu: () => void;
}

const Comment = forwardRef<HTMLLIElement, Props>(function Comment(
  {
    comment,
    isUpdatingText,
    onUpdateCommentToggle,
    userId,
    isOpenDropdownMenu,
    onOpenDeleteCommentModal,
    onLikeComment,
    onUpdateCommentSubmit,
    onToggleDropdownMenu,
  }: Props,
  ref
) {
  const [newText, setNewText] = useState(comment.text);

  return (
    <li key={comment.id}>
      <div className="flex justify-between">
        <div className="pt-2">
          <Avatar profilePath={comment.profilePath} size="small" alt={comment.nickname} />
        </div>
        <div className="w-full pl-2">
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
          {!isUpdatingText ? (
            <div>
              <ToggleableP className={'text-slate-700 mb-1'} text={comment.text} numberOfLines={3} />
              <div className="flex items-center -translate-x-1.5">
                <button
                  onClick={onLikeComment}
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
                  <Button
                    type="button"
                    size="small"
                    onClick={() => {
                      onUpdateCommentToggle();
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
                    onClick={() => onUpdateCommentSubmit(newText)}
                  >
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
                onToggleDropdownMenu();
              }}
            >
              <EllipsisVertical size="1.2rem" />
            </button>
            <CommentDropdownMenu
              openDropdownMenu={isOpenDropdownMenu}
              onOpenDeleteCommentModal={onOpenDeleteCommentModal}
              onUpdateCommentToggle={onUpdateCommentToggle}
            />
          </div>
        ) : null}
      </div>
    </li>
  );
});

export default Comment;
