'use client';

import { updateUser, UpdateUserState } from '@/app/lib/actions/auth/edit-user';
import { SessionData } from '@/app/lib/definitions';
import { IronSession } from 'iron-session';
import Link from 'next/link';
import { useState } from 'react';
import { useFormState } from 'react-dom';

interface Props {
  stringifiedSession: string;
}

export default function UpdateUserForm({ stringifiedSession }: Props) {
  const session: IronSession<SessionData> = JSON.parse(stringifiedSession);
  const initialState: UpdateUserState = { message: null, errors: {} };
  const [state, submitUpdateUserForm] = useFormState(updateUser, initialState);
  const [nickname, setNickname] = useState<string>(session.nickname);
  const [changePassword, setChangePassword] = useState<boolean>(false);

  const handleUpdateUserFormSubmit = (formData: FormData) => {
    formData.append('changePassword', String(changePassword));
    submitUpdateUserForm(formData);
  };

  return (
    <form action={handleUpdateUserFormSubmit}>
      <div className='rounded-md bg-gray-50 p-6'>
        <div className='text-center font-semibold mb-4 text-lg'>
          회원정보 수정
        </div>
        <label htmlFor='email' className='ml-2 mb-2 block font-semibold'>
          이메일
        </label>
        <input
          id='email'
          name='email'
          type='email'
          className={`block w-full rounded-md border mb-4 border-gray-200 py-2 pl-4 placeholder:text-gray-500 focus:outline-primary-500`}
          defaultValue={session.email}
          disabled
        />
        <label htmlFor='nickname' className='ml-2 mb-2 block font-semibold'>
          닉네임
        </label>
        <input
          id='nickname'
          name='nickname'
          type='text'
          className={`block w-full rounded-md border mb-4 border-gray-200 py-2 pl-4 placeholder:text-gray-500 focus:outline-primary-500 
              ${state.errors?.nickname && 'outline outline-1 outline-red-500'}`}
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          aria-describedby='nickname-error'
        />
        {state.errors?.nickname &&
          state.errors.nickname.map((error: string) => (
            <p className='m-2 mb-4 text-red-500' key={error}>
              {error}
            </p>
          ))}
        <label htmlFor='oldPassword' className='ml-2 mb-2 block font-semibold'>
          비밀번호
        </label>
        <input
          id='oldPassword'
          name='oldPassword'
          type='password'
          className={`block w-full rounded-md border mb-4 border-gray-200 py-2 pl-4 placeholder:text-gray-500 focus:outline-primary-500 
              ${
                state.errors?.oldPassword && 'outline outline-1 outline-red-500'
              }`}
          placeholder={`현재 비밀번호를 입력해주세요.`}
          aria-describedby='oldPassword-error'
        />
        {state.errors?.oldPassword &&
          state.errors.oldPassword.map((error: string) => (
            <p className='m-2 mb-4 text-red-500' key={error}>
              {error}
            </p>
          ))}
        <div className='flex gap-2 pl-2 mb-4'>
          <input
            type='checkbox'
            id='changePassword'
            name='changePassword'
            checked={changePassword}
            onChange={() => setChangePassword((prev) => !prev)}
          />
          <label htmlFor='changePassword' className='font-semibold'>
            비밀번호 변경
          </label>
        </div>
        {changePassword && <> </>}
        <label htmlFor='newPassword' className='ml-2 mb-2 block font-semibold'>
          새 비밀번호
        </label>
        <input
          id='newPassword'
          name='newPassword'
          type='password'
          disabled={!changePassword}
          className={`block w-full rounded-md border mb-4 border-gray-200 py-2 pl-4 placeholder:text-gray-500 focus:outline-primary-500 
              ${
                state.errors?.newPassword && 'outline outline-1 outline-red-500'
              }`}
          placeholder={`새 비밀번호를 입력해주세요.`}
          aria-describedby='newPassword-error'
        />

        {state.errors?.newPassword &&
          state.errors.newPassword.map((error: string) => (
            <p className='m-2 mb-4 text-red-500' key={error}>
              {error}
            </p>
          ))}
        <label
          htmlFor='confirmNewPassword'
          className='ml-2 mb-2 block font-semibold'
        >
          새 비밀번호 재입력
        </label>
        <input
          id='confirmNewPassword'
          name='confirmNewPassword'
          type='password'
          disabled={!changePassword}
          className={`block w-full rounded-md border mb-4 border-gray-200 py-2 pl-4 placeholder:text-gray-500 focus:outline-primary-500 
              ${
                state.errors?.confirmNewPassword &&
                'outline outline-1 outline-red-500'
              }`}
          placeholder={`새 비밀번호를 재입력해주세요.`}
          aria-describedby='confirmNewPassword-error'
        />
        {state.errors?.confirmNewPassword &&
          state.errors.confirmNewPassword.map((error: string) => (
            <p className='m-2 mb-4 text-red-500' key={error}>
              {error}
            </p>
          ))}
      </div>
      <div className='flex gap-4 m-4 justify-end'>
        <button className='bg-primary-500 px-4 flex h-12 items-center rounded-lg text-white font-semibold'>
          수정하기
        </button>
        <Link
          href={'/'}
          className='bg-gray-100 px-4 flex h-12 items-center rounded-lg font-semibold text-gray-600'
        >
          취소
        </Link>
      </div>
    </form>
  );
}
