'use client';

import Input from '@/components/Input';
import InputError from '@/components/InputError';
import Label from '@/components/Label';
import Link from 'next/link';
import { useAuth } from '@/hooks/auth';
import { useState } from 'react';

const Page = () => {
    const { register } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/dashboard',
    })

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')
    const [errors, setErrors] = useState<any[]>([])

    const submitForm = (event: any) => {
        event.preventDefault()

        register({
            name,
            email,
            password,
            password_confirmation: passwordConfirmation,
            setErrors,
        })
    }

    return (
        <form onSubmit={submitForm}>
            {/* Name */}
            <div>
                <Label className=''>Name</Label>

                <Input
                  disabled
                  id="name"
                  type="text"
                  value={name}
                  className="block mt-1 w-full"
                  onChange={(event: any) => setName(event.target.value)}
                  required
                  autoFocus
                />

                <InputError messages={errors.name} className="mt-2" />
            </div>

            {/* Email Address */}
            <div className="mt-4">
                <Label className=''>Email</Label>

                <Input
                  disabled
                  id="email"
                  type="email"
                  value={email}
                  className="block mt-1 w-full"
                  onChange={event => setEmail(event.target.value)}
                  required
                />

                <InputError messages={errors.email} className="mt-2" />
            </div>

            {/* Password */}
            <div className="mt-4">
                <Label className=''>Password</Label>

                <Input
                  disabled
                  id="password"
                  type="password"
                  value={password}
                  className="block mt-1 w-full"
                  onChange={event => setPassword(event.target.value)}
                  required
                  autoComplete="new-password"
                />

                <InputError messages={errors.password} className="mt-2" />
            </div>

            {/* Confirm Password */}
            <div className="mt-4">
                <Label className=''>
                    Confirm Password
                </Label>

                <Input
                  disabled
                  id="passwordConfirmation"
                  type="password"
                  value={passwordConfirmation}
                  className="block mt-1 w-full"
                  onChange={(event: any) =>
                      setPasswordConfirmation(event.target.value)
                  }
                  required
                />

                <InputError
                    messages={errors.password_confirmation}
                    className="mt-2"
                />
            </div>

            <div className="flex items-center justify-end mt-4">
                <Link
                    href="/login"
                    className="underline text-sm text-gray-600 hover:text-gray-900">
                    Already registered?
                </Link>

                <button className="ml-4">Register</button>
            </div>
        </form>
    )
}

export default Page;
