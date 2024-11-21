import { Pencil, Trash } from 'lucide-react';

interface Props {
  openDropdownMenu: boolean;
  onOpenDeleteCommentModal: () => void;
  onUpdateCommentToggle: () => void;
}

export default function CommentDropdownMenu({
  openDropdownMenu,
  onOpenDeleteCommentModal,
  onUpdateCommentToggle,
}: Props) {
  return (
    <>
      {openDropdownMenu && (
        <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
          <ul className="absolute right-0 top-full z-50 flex w-28 animate-modalTransition cursor-pointer flex-col rounded-lg border bg-white p-2 text-left text-base shadow">
            <button
              className="dropdown-button hover:bg-secondary-50 active:bg-secondary-100 flex items-center gap-2 rounded p-2 text-left text-slate-700"
              onClick={onUpdateCommentToggle}
            >
              <Pencil color="#334155" size="1.2rem" />
              수정
            </button>
            <button
              className="dropdown-button hover:bg-secondary-50 active:bg-secondary-100 flex items-center gap-2 rounded p-2 text-left text-red-500"
              onClick={onOpenDeleteCommentModal}
            >
              <Trash size="1.2rem" /> 삭제
            </button>
          </ul>
        </div>
      )}
    </>
  );
}
