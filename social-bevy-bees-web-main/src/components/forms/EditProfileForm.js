'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Spinner from '@/components/shared/Spinner';
import { useUser, useEditUser } from '@/lib/auth/authConfig';

const validationSchema = yup.object({
  fName: yup.string().required('First Name is required'),
  lName: yup.string().required('Last Name is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
});

const EditProfileForm = () => {
  const { data: user, isLoading: loadingUser } = useUser({
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 30,
  });
  const { mutate: editUser, isLoading: updatingUser } = useEditUser();

  const formMethods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      fName: user?.fName || '',
      lName: user?.lName || '',
      email: user?.email || '',
    },
  });

  const { handleSubmit, formState, setValue, reset, control } = formMethods;

  const onSubmit = async (values) => {
    const formData = new FormData();
    for (const key in values) {
      formData.append(key, values[key]);
    }
    editUser({ id: user?.id, formData });
  };

  if (loadingUser) {
    return <Spinner />;
  }

  return (
    <div className="flex flex-col max-w-2xl">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-2">
        <div className="flex space-x-4">
          <div className="flex-1">
            <label htmlFor="fName" className="block text-sm font-medium text-gray-700">First Name</label>
            <Controller
              name="fName"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  id="fName"
                  className="mt-1 block w-full rounded-md bg-white text-gray-800 border border-gray-300 focus:ring-red-500 focus:border-red-500 px-3 py-2"
                  placeholder="ex: Alex"
                />
              )}
            />
            {formState.errors.fName && (
              <div className="text-red-500 text-xs mt-1 ml-1 min-h-[1rem]">{formState.errors.fName.message}</div>
            )}
          </div>
          <div className="flex-1">
            <label htmlFor="lName" className="block text-sm font-medium text-gray-700">Last Name</label>
            <Controller
              name="lName"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  id="lName"
                  className="mt-1 block w-full rounded-md bg-white text-gray-800 border border-gray-300 focus:ring-red-500 focus:border-red-500 px-3 py-2"
                  placeholder="ex: Smith"
                />
              )}
            />
            {formState.errors.lName && (
              <div className="text-red-500 text-xs mt-1 ml-1 min-h-[1rem]">{formState.errors.lName.message}</div>
            )}
          </div>
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="email"
                id="email"
                className="mt-1 block w-full rounded-md bg-white text-gray-800 border border-gray-300 focus:ring-red-500 focus:border-red-500 px-3 py-2"
                placeholder="ex: abc@gmail.com"
              />
            )}
          />
          {formState.errors.email && (
            <div className="text-red-500 text-xs mt-1 ml-1 min-h-[1rem]">{formState.errors.email.message}</div>
          )}
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-red-500 text-white font-bold rounded-md hover:bg-red-600 focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          disabled={updatingUser}
        >
          {updatingUser ? <Spinner /> : 'Save'}
        </button>
      </form>
    </div>
  );
};

export default EditProfileForm;
