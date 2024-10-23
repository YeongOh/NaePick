'use client';

import { COMMENT_TEXT_MAX_LENGTH } from '@/app/constants';
import { CommentState, createComment } from '@/app/lib/actions/comments/create';
import { deleteComment } from '@/app/lib/actions/comments/delete';
import { updateComment } from '@/app/lib/actions/comments/update';
import { Comment, SessionData } from '@/app/lib/definitions';
import { getRelativeDate, sortDate } from '@/app/utils/date';
import { useState } from 'react';
import { useFormState } from 'react-dom';
import toast from 'react-hot-toast';
import DeleteConfirmModal from '../modal/delete-confirm-modal';

interface Props {
  worldcupId: string;
  session?: SessionData;
  comments?: Comment[];
}

export default function CommentSection({
  session,
  worldcupId,
  comments,
}: Props) {
  const initialState: CommentState = { message: null, errors: {} };
  const [state, submitCommentForm] = useFormState(createComment, initialState);
  const [text, setText] = useState<string>('');
  const [updateCommentIndex, setUpdateCommentIndex] = useState<number | null>(
    null
  );
  const [updateCommentText, setUpdateCommentText] = useState<string>('');
  const [showDeleteCommentConfirmModal, setShowDeleteConfirmModal] =
    useState<boolean>(false);
  const [selectedCommentToDelete, setSelectedCommentToDelete] =
    useState<Comment | null>(null);
  const isAuth = !!session?.userId;

  const sortedComments = comments?.sort((a, b) =>
    sortDate(a.createdAt, b.createdAt, 'newest')
  );

  const handleCommentFormSubmit = (formData: FormData) => {
    if (!session?.userId) {
      toast.error('로그인 세션이 만료되었습니다.');
      return;
    }
    formData.append('worldcupId', worldcupId);
    submitCommentForm(formData);
    setText('');
  };

  const handleDeleteConfirm = async () => {
    try {
      if (!selectedCommentToDelete) {
        throw new Error('선택된 댓글이 없습니다.');
      }
      await deleteComment(selectedCommentToDelete);
      setSelectedCommentToDelete(null);
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setShowDeleteConfirmModal(false);
    }
  };

  const handleUpdateCommentSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    commentId: string
  ) => {
    e.preventDefault();
    try {
      await updateComment(commentId, updateCommentText);
      setUpdateCommentIndex(null);
      setUpdateCommentText('');
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <section className='p-8'>
      <div className='my-4 text-lg font-semibold'>
        {comments && comments.length > 0
          ? `댓글 ${comments.length}개`
          : `댓글을 추가해보세요.`}
      </div>
      <form action={handleCommentFormSubmit}>
        <input
          id='text'
          name='text'
          value={text}
          onChange={(e) => setText(e.target.value)}
          className={`text-lg block w-full rounded-md border mb-4 border-gray-200 py-2 pl-4 placeholder:text-gray-500 focus:outline-primary-500 
              ${state.errors?.text && 'outline outline-1 outline-red-500'}`}
          placeholder={
            isAuth ? `댓글 추가... ` : '로그인이 필요한 서비스입니다.'
          }
          aria-describedby='text-error'
          autoComplete='off'
          maxLength={COMMENT_TEXT_MAX_LENGTH}
          disabled={!isAuth || updateCommentIndex !== null}
        />
        {state.errors?.text &&
          state.errors.text.map((error: string) => (
            <p className='m-2 mb-4 text-red-500' key={error}>
              {error}
            </p>
          ))}
        {isAuth && (
          <div className='flex gap-4 m-4 justify-end'>
            <button className='bg-primary-500 px-3 flex h-10 items-center rounded-lg text-white font-semibold text-base'>
              댓글
            </button>
            <button
              type='button'
              className='bg-gray-100 px-3 flex h-10 items-center rounded-lg font-semibold text-gray-600 text-base'
            >
              취소
            </button>
          </div>
        )}
      </form>
      {comments ? (
        <ul>
          {sortedComments?.map((comment, index) => (
            <li className='mb-6' key={comment.commentId}>
              <div className='mb-2'>
                <span className='text-gray-500 mr-4'>
                  {comment.nickname ? comment.nickname : '탈퇴한 회원'}
                </span>
                <span className='text-base'>
                  {getRelativeDate(comment.createdAt)}
                </span>
                {comment.userId === session?.userId && (
                  <>
                    <button
                      type='button'
                      onClick={() => {
                        setUpdateCommentIndex(index);
                        setUpdateCommentText(comment.text);
                      }}
                      className='text-primary-500 text-base ml-4'
                    >
                      수정
                    </button>
                    <button
                      type='button'
                      className='text-red-500 text-base ml-2'
                      onClick={() => {
                        setSelectedCommentToDelete(comment);
                        setShowDeleteConfirmModal(true);
                      }}
                    >
                      삭제
                    </button>
                  </>
                )}
              </div>
              {updateCommentIndex === index ? (
                <form
                  onSubmit={(e) =>
                    handleUpdateCommentSubmit(e, comment.commentId)
                  }
                >
                  <input
                    name='updateText'
                    value={updateCommentText}
                    onChange={(e) => setUpdateCommentText(e.target.value)}
                    className={`text-base block w-[80%] rounded-md border mb-4 border-gray-200 py-2 pl-4 placeholder:text-gray-500 focus:outline-primary-500`}
                    placeholder={comment.text}
                    autoComplete='off'
                    maxLength={COMMENT_TEXT_MAX_LENGTH}
                  />
                  <div className='w-[80%]'>
                    <div className='flex gap-4 m-4 justify-end'>
                      <button
                        type='submit'
                        className='bg-primary-500 px-3 flex h-9 items-center rounded-lg text-white font-semibold text-base'
                      >
                        수정
                      </button>
                      <button
                        type='button'
                        onClick={() => setUpdateCommentIndex(null)}
                        className='bg-gray-100 px-3 flex h-9 items-center rounded-lg font-semibold text-gray-600 text-base'
                      >
                        취소
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className='text-base'>{comment.text}</div>
              )}
            </li>
          ))}
        </ul>
      ) : null}
      <DeleteConfirmModal
        open={showDeleteCommentConfirmModal}
        onClose={() => {
          setShowDeleteConfirmModal(false);
          setSelectedCommentToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
      >
        댓글을 삭제하시겠습니까?
      </DeleteConfirmModal>
    </section>
  );
}
