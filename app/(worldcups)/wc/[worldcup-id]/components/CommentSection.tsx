'use client';

import { sortDate } from '@/app/utils/date';
import React, { useEffect, useRef, useState } from 'react';

import 'dayjs/locale/ko';
import { Pencil } from 'lucide-react';
import toast from 'react-hot-toast';
import TextArea from '@/app/components/ui/textarea';
import InputErrorMessage from '@/app/components/ui/input-error-message';
import DeleteConfirmModal from '@/app/components/modal/delete-confirm-modal';
import {
  createCommentAction,
  CreateCommentState,
  deleteCommentAction,
  getComments,
  getCommentsCount,
} from '../actions';
import { InferSelectModel } from 'drizzle-orm';
import { comments } from '@/app/lib/database/schema';
import Comment from './Comment';
import Button from '@/app/components/ui/button';

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
  const [isFetching, setIsFetching] = useState(false);
  const [comments, setComments] = useState<CommentModel[]>([]);
  const [numberOfNewComments, setNumberOfNewComments] = useState(0);
  const [cursor, setCursor] = useState<string>();
  const [dropdownMenuId, setDropdownMenuId] = useState<string | null>(null);
  const [openDeleteConfirmModal, setOpenDeleteConfirmModal] = useState<boolean>(false);
  const ref = useRef(null);

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
    if (commentsCount === undefined) {
      getCommentsCount(worldcupId).then((resutlt) => setCommentsCount(resutlt));
    }
  }, []);

  useEffect(() => {
    getComments(worldcupId, userId).then((result) => {
      if (result) {
        console.log(result);
        setComments(result.data);
        setCursor(result.nextCursor);
      }
    });
  }, [worldcupId, userId]);

  useEffect(() => {
    const handleIntersect = async (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      if (entries[0].isIntersecting && !isFetching && cursor) {
        observer.unobserve(entries[0].target);
        setIsFetching(true);
        const result = await getComments(worldcupId, userId, cursor);
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
  }, [cursor, isFetching, worldcupId, userId]);

  const sortedComments = comments?.sort((a, b) => sortDate(a.createdAt, b.createdAt, 'newest'));

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

  const handleUpdateComment = (commentId: string, newText: string) => {
    setComments(
      comments.map((comment) => (comment.id === commentId ? { ...comment, text: newText } : comment))
    );
  };

  const handleLikeComment = (commentId: string, isLiked: boolean) => {
    setComments(
      comments.map((comment) =>
        comment.id === commentId
          ? { ...comment, likeCount: isLiked ? comment.likeCount + 1 : comment.likeCount - 1, isLiked }
          : comment
      )
    );
  };

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
            <Comment
              key={comment.id}
              ref={index === sortedComments.length - 1 ? ref : null}
              comment={comment}
              userId={userId}
              dropdownMenuId={dropdownMenuId}
              onUpdateComment={handleUpdateComment}
              onLikeComment={handleLikeComment}
              setDropdownMenuId={setDropdownMenuId}
              setOpenDeleteConfirmModal={setOpenDeleteConfirmModal}
            />
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
