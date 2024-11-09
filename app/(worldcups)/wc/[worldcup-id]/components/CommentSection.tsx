'use client';

// import { deleteComment, updateComment } from '@/app/lib/comment/service';
import { getRelativeDate, sortDate } from '@/app/utils/date';
import React, { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';
import { EllipsisVertical, Pencil } from 'lucide-react';
import CommentDropdownMenu from './CommentDropdownMenu';
import toast from 'react-hot-toast';
import { COMMENT_TEXT_MAX_LENGTH } from '@/app/constants';
import TextArea from '@/app/components/ui/textarea';
import InputErrorMessage from '@/app/components/ui/input-error-message';
import Button from '@/app/components/ui/button';
import Avatar from '@/app/components/ui/Avatar';
import ToggleableP from '@/app/components/ui/toggleable-p';
import DeleteConfirmModal from '@/app/components/modal/delete-confirm-modal';
import {
  createCommentAction,
  CreateCommentState,
  deleteCommentAction,
  getComments,
  getCommentsCount,
  updateCommentAction,
} from '../actions';
import { InferSelectModel } from 'drizzle-orm';
import { candidates, comments } from '@/app/lib/database/schema';

type CommentModel = InferSelectModel<typeof comments> & {
  nickname: string | null;
  profilePath: string | null;
  voted: string | null;
};

interface Props {
  worldcupId: string;
  className?: string;
  finalWinnerCandidateId?: string;
  userId?: string;
}

export default function CommentSection({ worldcupId, className, userId, finalWinnerCandidateId }: Props) {
  const [state, setState] = useState<CreateCommentState>({ errors: {} });
  const [commentsCount, setCommentsCount] = useState<number>();
  const [text, setText] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [comments, setComments] = useState<CommentModel[]>([]);
  const [numberOfNewComments, setNumberOfNewComments] = useState(0);
  const [cursor, setCursor] = useState<string>();
  const ref = useRef(null);
  const [dropdownMenuId, setDropdownMenuId] = useState<string | null>(null);
  const [openDeleteConfirmModal, setOpenDeleteConfirmModal] = useState<boolean>(false);
  const [updateCommentId, setUpdateCommentId] = useState<string | null>(null);
  const [newText, setNewText] = useState('');

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (
      !target.closest('.dropdown-menu') &&
      !target.closest('.dropdown-menu-toggle') &&
      !target.closest('.modal')
    ) {
      setDropdownMenuId(null);
    }
  };

  useEffect(() => {
    if (dropdownMenuId !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownMenuId]);

  useEffect(() => {
    getComments(worldcupId).then((result) => {
      if (result) {
        setComments(result.data);
        setCursor(result.nextCursor);
      }
    });
  }, [worldcupId]);

  const sortedComments = comments?.sort((a, b) => sortDate(a.createdAt, b.createdAt, 'newest'));

  dayjs.extend(relativeTime);
  dayjs.locale('ko');

  const handleDeleteComment = async () => {
    const targetCommentId = dropdownMenuId;
    try {
      if (!targetCommentId) return;

      await deleteCommentAction(targetCommentId);
      const newComments = comments.filter((comment) => comment.id != targetCommentId);
      setComments(newComments);
      toast.success('댓글이 삭제되었습니다.');
    } catch (error) {
      console.error(error);
      toast.error('댓글을 삭제하지 못했습니다.');
    } finally {
      setOpenDeleteConfirmModal(false);
      setDropdownMenuId(null);
    }
  };

  const handleEditTextSubmit = async () => {
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
      const newComments = comments.map((comment) =>
        comment.id === updateCommentId ? { ...comment, text: newText } : comment
      );
      setComments(newComments);
      setNewText('');
      setUpdateCommentId(null);
      toast.success('댓글이 수정되었습니다.');
    } catch (error) {
      console.error(error);
      toast.error('댓글을 수정하지 못했습니다.');
    }
  };

  const handleCommentFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const result = await createCommentAction({
        text,
        worldcupId,
        votedCandidateId: finalWinnerCandidateId,
      });
      const { data: newComment, errors } = result;
      if (errors) {
        setState({ errors });
      } else {
        setState({ errors: {} });
      }
      if (newComment) {
        setComments((prev) => [...prev, newComment]);
        setNumberOfNewComments((prev) => prev + 1);
      }
      setText('');
    } catch (error) {
      console.error(error);
      toast.error('업로드에 실패했습니다.');
    }
  };

  useEffect(() => {
    if (commentsCount === undefined) {
      getCommentsCount(worldcupId).then((resutlt) => setCommentsCount(resutlt));
    }
  }, []);

  useEffect(() => {
    const handleIntersect = async (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      if (entries[0].isIntersecting && !isFetching && cursor) {
        observer.unobserve(entries[0].target);
        setIsFetching(true);
        const result = await getComments(worldcupId, cursor);
        if (!result) {
          throw new Error();
        }
        const { data, nextCursor } = result;
        if (data) {
          setComments((prev) => [...prev, ...data]);
        }
        setCursor(nextCursor);
        setIsFetching(false);
      }
    };

    const observer = new IntersectionObserver(handleIntersect, {
      threshold: 0.5,
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [cursor, isFetching, worldcupId]);

  const totalNumberOfComments = (commentsCount || 0) + numberOfNewComments;

  return (
    <section className={`${className} bg-white`}>
      <div className="my-4 text-base text-slate-700 font-semibold">
        {totalNumberOfComments > 0 ? `댓글 ${totalNumberOfComments}개` : `댓글을 남겨주세요.`}
      </div>
      <form onSubmit={handleCommentFormSubmit}>
        <TextArea
          id="text"
          name="text"
          value={text}
          error={state.errors?.text}
          className={`p-2 mb-1`}
          onChange={(e) => setText(e.target.value)}
          placeholder="댓글 내용"
          rows={2}
          autoFocus
        />
        <InputErrorMessage className="mb-1" errors={state.errors?.text} />
        <Button variant="primary" className="flex justify-center items-center gap-1 mt-1 mb-4">
          <Pencil color="#FFFFFF" size="1.2rem" />
          댓글 추가하기
        </Button>
      </form>
      {comments ? (
        <ul>
          {sortedComments?.map((comment, index) => (
            <li className="mb-4" key={comment.id} ref={index === sortedComments.length - 1 ? ref : null}>
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
                      {getRelativeDate(comment.createdAt)}
                    </span>
                  </div>
                  {updateCommentId !== comment.id ? (
                    <ToggleableP className={'text-slate-700'} text={comment.text} numberOfLines={3} />
                  ) : (
                    <>
                      <TextArea
                        id="editText"
                        name="editText"
                        value={newText}
                        error={state.errors?.text}
                        className={`p-2 mb-1`}
                        onChange={(e) => setNewText(e.target.value)}
                        rows={2}
                      />
                      <div className="flex w-full justify-end">
                        <div className="w-[40%] flex gap-2">
                          <Button
                            type="button"
                            size="small"
                            onClick={() => setUpdateCommentId(null)}
                            variant="ghost"
                          >
                            취소
                          </Button>
                          <Button type="button" size="small" variant="primary" onClick={handleEditTextSubmit}>
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
          ))}
        </ul>
      ) : null}
      <DeleteConfirmModal
        title={'해당 댓글을 정말로 삭제하시겠습니까?'}
        description={''}
        open={!!openDeleteConfirmModal}
        onClose={() => {
          setOpenDeleteConfirmModal(false);
          setDropdownMenuId(null);
        }}
        onConfirm={handleDeleteComment}
      />
    </section>
  );
}
