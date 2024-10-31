'use client';

import {
  updateUser,
  UpdateUserState,
} from '@/app/lib/actions/auth/update-user';
import { SessionData } from '@/app/lib/definitions';
import { IronSession } from 'iron-session';
import Link from 'next/link';
import { useState } from 'react';
import { useFormState } from 'react-dom';
import Input from '../ui/input';
import InputErrorMessage from '../ui/input-error-message';
import Button from '../ui/button';
import { useRouter } from 'next/navigation';

// TODO:가지고 있는 토큰으로 확인하지말고 서버에 세션 확인 후 => 정보 새로 받기
interface Props {
  stringifiedSession: string;
}

export default function UpdateUserForm({ stringifiedSession }: Props) {
  const session: IronSession<SessionData> = JSON.parse(stringifiedSession);
  const initialState: UpdateUserState = { message: null, errors: {} };
  const [state, submitUpdateUserForm] = useFormState(updateUser, initialState);
  const [nickname, setNickname] = useState<string>(session.nickname);
  const [changePassword, setChangePassword] = useState<boolean>(false);
  const router = useRouter();

  const handleUpdateUserFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append('changePassword', String(changePassword));
    submitUpdateUserForm(formData);
  };

  const handleFormKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter') e.preventDefault();
  };

  return (
    <form
      onSubmit={handleUpdateUserFormSubmit}
      className='rounded-md flex flex-col w-full mb-28'
      onKeyDown={handleFormKeyDown}
    >
      <Link
        href='/'
        className='text-primary-500 text-5xl text-center mb-8 font-extrabold'
      >
        NaePick
      </Link>
      <Input
        id='email'
        name='email'
        type='email'
        className={`p-4 mb-2`}
        defaultValue={session.email}
        placeholder={'이메일 주소'}
        disabled
        readOnly
      />
      <Input
        id='nickname'
        name='nickname'
        type='text'
        className={`p-4 mb-2`}
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        placeholder={'닉네임'}
      />
      <InputErrorMessage className='mb-2' errors={state.errors?.nickname} />
      <Input
        id='oldPassword'
        name='oldPassword'
        type='password'
        className={`p-4 mb-2`}
        placeholder={`비밀번호`}
      />
      <InputErrorMessage className='mb-2' errors={state.errors?.oldPassword} />
      <div className='flex gap-2 pl-2 mb-4'>
        <input
          type='checkbox'
          id='changePassword'
          name='changePassword'
          checked={changePassword}
          className='cursor-pointer accent-primary-500'
          onChange={() => setChangePassword((prev) => !prev)}
        />
        <label
          htmlFor='changePassword'
          className='font-semibold text-base text-slate-700 cursor-pointer'
        >
          비밀번호 변경
        </label>
      </div>
      <Input
        id='newPassword'
        name='newPassword'
        type='password'
        disabled={!changePassword}
        className={`p-4 mb-2`}
        placeholder={`새로운 비밀번호`}
      />
      <InputErrorMessage className='mb-2' errors={state.errors?.newPassword} />
      <Input
        id='confirmNewPassword'
        name='confirmNewPassword'
        type='password'
        disabled={!changePassword}
        className={`p-4 mb-2`}
        placeholder={`새로운 비밀번호 재입력`}
      />
      <InputErrorMessage
        className='mb-2'
        errors={state.errors?.confirmNewPassword}
      />
      <Button className='mt-4' variant='primary'>
        수정 완료
      </Button>
      <Button
        type='button'
        onClick={() => router.back()}
        variant='outline'
        className='mt-2'
        aria-label='Go back'
        role='link'
      >
        돌아가기
      </Button>
    </form>
  );
}
