'use client';

import { sortDate } from '@/app/utils/date';
import React, { useEffect, useRef, useState } from 'react';
import { Pencil } from 'lucide-react';
import toast from 'react-hot-toast';
import TextArea from '@/app/components/ui/textarea';
import InputErrorMessage from '@/app/components/ui/input-error-message';
import DeleteConfirmModal from '@/app/components/modal/delete-confirm-modal';
import {
  cancelLikeCommentAction,
  createCommentAction,
  CreateCommentState,
  deleteCommentAction,
  getComments,
  getCommentsCount,
  likeCommentAction,
  updateCommentAction,
} from '../actions';
import { InferSelectModel } from 'drizzle-orm';
import { comments } from '@/app/lib/database/schema';
import Comment from './Comment';
import Button from '@/app/components/ui/button';
import { COMMENT_TEXT_MAX_LENGTH } from '@/app/constants';

export type CommentModel = InferSelectModel<typeof comments> & {
  nickname: string | null;
  profilePath: string | null;
  voted: string | null;
  likeCount: number;
  isLiked?: boolean;
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
  const [isFetchingComment, setIsFetchingComment] = useState(false);
  const [comments, setComments] = useState<CommentModel[]>([]);
  const [numberOfNewComments, setNumberOfNewComments] = useState(0);
  const [cursor, setCursor] = useState<string>();
  const [dropdownMenuIndex, setDropdownMenuIndex] = useState<number | null>(null);
  const [deleteConfirmModalIndex, setDeleteConfirmModalIndex] = useState<number | null>(null);
  const [isLikeCommentLoading, setIsLikeCommentLoading] = useState(false);
  const [updateCommentIndex, setUpdateCommentIndex] = useState<number | null>(null);

  const ref = useRef(null);

  const handleToggleDropdownMenu = (index: number) => {
    setDropdownMenuIndex((prev) => (prev == index ? null : index));
  };

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (
      !target.closest('.dropdown-menu') &&
      !target.closest('.dropdown-menu-toggle') &&
      !target.closest('.modal')
    ) {
      setDropdownMenuIndex(null);
    }
  };

  useEffect(() => {
    if (dropdownMenuIndex !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownMenuIndex]);

  useEffect(() => {
    if (commentsCount === undefined) {
      getCommentsCount(worldcupId).then((resutlt) => setCommentsCount(resutlt));
    }
  }, []);

  useEffect(() => {
    getComments(worldcupId, userId).then((result) => {
      if (result) {
        setComments(result.data);
        setCursor(result.nextCursor);
      }
    });
  }, [worldcupId, userId]);

  useEffect(() => {
    const handleIntersect = async (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      if (entries[0].isIntersecting && !isFetchingComment && cursor) {
        observer.unobserve(entries[0].target);
        setIsFetchingComment(true);
        const result = await getComments(worldcupId, userId, cursor);
        if (!result) {
          throw new Error();
        }
        const { data, nextCursor } = result;
        if (data) {
          setComments((prev) => [...prev, ...data]);
        }
        setCursor(nextCursor);
        setIsFetchingComment(false);
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
  }, [cursor, isFetchingComment, worldcupId, userId]);

  const sortedComments = comments?.sort((a, b) => sortDate(a.createdAt, b.createdAt, 'newest'));

  const handleDeleteComment = async () => {
    if (deleteConfirmModalIndex === null) return;
    const targetCommentId = sortedComments[deleteConfirmModalIndex].id;
    try {
      await deleteCommentAction(targetCommentId);
      const newComments = comments.filter((comment) => comment.id != targetCommentId);
      setComments(newComments);
      toast.success('댓글이 삭제되었습니다.');
    } catch (error) {
      console.error(error);
      toast.error('댓글을 삭제하지 못했습니다.');
    } finally {
      setDeleteConfirmModalIndex(null);
      setDropdownMenuIndex(null);
    }
  };

  const handleDeleteCommentModal = (index: number) => {
    setDeleteConfirmModalIndex(index);
  };

  const handleUpdateCommentToggle = (index: number) => {
    if (index === updateCommentIndex) {
      setUpdateCommentIndex(null);
    } else {
      setDropdownMenuIndex(null);
      setUpdateCommentIndex(index);
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

  const handleUpdateCommentSubmit = async (index: number, newText: string) => {
    try {
      if (newText.length <= 0) {
        toast.error('최소 0자 이상이어야 합니다.');
        return;
      }
      if (newText.length > COMMENT_TEXT_MAX_LENGTH) {
        toast.error(`최소 ${COMMENT_TEXT_MAX_LENGTH}자 이하여야 합니다.`);
        return;
      }
      const targetComment = sortedComments[index];

      await updateCommentAction(targetComment.id, newText);
      setComments(
        comments.map((comment) =>
          comment.id === targetComment.id ? { ...comment, text: newText } : comment,
        ),
      );
      setUpdateCommentIndex(null);
      toast.success('댓글이 수정되었습니다.');
    } catch (error) {
      console.error(error);
      toast.error('댓글을 수정하지 못했습니다.');
    }
  };

  const handleLikeComment = async (index: number) => {
    try {
      if (!userId) {
        toast.error('로그인이 필요합니다!');
        return;
      }
      if (isLikeCommentLoading) return;
      setIsLikeCommentLoading(true);
      const targetComment = sortedComments[index];

      if (targetComment.isLiked) {
        await cancelLikeCommentAction(targetComment.id, userId);
      } else {
        await likeCommentAction(targetComment.id, userId);
      }
      const isLiked = !targetComment.isLiked;
      setComments(
        comments.map((comment) =>
          comment.id === targetComment.id
            ? { ...comment, likeCount: isLiked ? comment.likeCount + 1 : comment.likeCount - 1, isLiked }
            : comment,
        ),
      );
    } catch (error) {
      console.error(error);
      toast.error('좋아요에 실패했습니다.');
    } finally {
      setIsLikeCommentLoading(false);
    }
  };

  const totalNumberOfComments = (commentsCount || 0) + numberOfNewComments;

  return (
    <section className={`${className} bg-white`}>
      <div className="my-4 text-base font-semibold text-slate-700">
        {totalNumberOfComments > 0 ? `댓글 ${totalNumberOfComments}개` : `댓글을 남겨주세요.`}
      </div>
      <form onSubmit={handleCommentFormSubmit}>
        <TextArea
          id="text"
          name="text"
          value={text}
          error={state.errors?.text}
          className={`mb-1 p-2`}
          onChange={(e) => setText(e.target.value)}
          placeholder="댓글 내용"
          rows={2}
        />
        <InputErrorMessage className="mb-1" errors={state.errors?.text} />
        <Button variant="primary" className="mb-4 mt-1 flex items-center justify-center gap-1">
          <Pencil color="#FFFFFF" size="1.2rem" />
          댓글 추가하기
        </Button>
      </form>
      {comments ? (
        <ul>
          {sortedComments?.map((comment, index) => (
            <Comment
              key={comment.id}
              ref={index === sortedComments.length - 1 ? ref : null}
              comment={comment}
              userId={userId}
              isOpenDropdownMenu={dropdownMenuIndex === index}
              isUpdatingText={updateCommentIndex === index}
              onUpdateCommentToggle={() => handleUpdateCommentToggle(index)}
              onLikeComment={() => handleLikeComment(index)}
              onUpdateCommentSubmit={(newText) => handleUpdateCommentSubmit(index, newText)}
              onToggleDropdownMenu={() => handleToggleDropdownMenu(index)}
              onOpenDeleteCommentModal={() => handleDeleteCommentModal(index)}
            />
          ))}
        </ul>
      ) : null}
      <DeleteConfirmModal
        title={'해당 댓글을 정말로 삭제하시겠습니까?'}
        description={''}
        open={deleteConfirmModalIndex !== null}
        onClose={() => {
          setDeleteConfirmModalIndex(null);
          setDropdownMenuIndex(null);
        }}
        onConfirm={handleDeleteComment}
      />
    </section>
  );
}
