import { Pencil, Trash } from 'lucide-react';

interface Props {
  openDropdownMenu: boolean;
  onOpenDeleteCommentModal: () => void;
  startEditComment: () => void;
}

export default function CommentDropdownMenu({
  openDropdownMenu,
  onOpenDeleteCommentModal,
  startEditComment,
}: Props) {
  return (
    <>
      {openDropdownMenu && (
        <div className='dropdown-menu' onClick={(e) => e.stopPropagation()}>
          <ul className='absolute right-0 top-full border bg-white rounded-lg flex flex-col w-28 text-left text-base shadow cursor-pointer text-slate-700 p-2 z-50 animate-modalTransition'>
            <button
              className='dropdown-button p-2 hover:bg-primary-100 text-left flex items-center gap-2 rounded active:bg-primary-200'
              onClick={startEditComment}
            >
              <Pencil color='#334155' size='1.2rem' />
              수정
            </button>
            <button
              className='dropdown-button p-2 hover:bg-primary-100 text-left flex items-center gap-2 rounded active:bg-primary-200'
              onClick={onOpenDeleteCommentModal}
            >
              <Trash color='#334155' size='1.2rem' /> 삭제
            </button>
          </ul>
        </div>
      )}
    </>
  );
}
