import { signIn } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { homepage, logo } from 'assets'

import LoginLeftSide from 'components/DisplayText/LoginLeftSide'
import TopTitle from 'components/DisplayText/TopTitle'
import PasswordInput from 'components/Input/PasswordInput'
import Input from 'components/Input'

import useForm from 'hooks/useForm'

const LoginError = ({ error, ...props }) => {
  let errorString = error ? decodeURIComponent(error) : null
  return errorString ? <div {...props} className=''>{`${errorString.toUpperCase().slice(0, 1)}${errorString.slice(1)}`}.</div> : null
}

const Login = () => {
  const {
    Form,
  } = useForm()

  const router = useRouter()
  const onSubmit = async (data: any) => {
    signIn('credentials', {
      email: data.email,
      password: data.password,
      callbackUrl: '/',
    })
  }

  const errorMessage = router?.query?.error ? <LoginError className="mt-4" error={router.query.error} /> : null
  
  return (
    <div className="flex min-h-screen">
      <LoginLeftSide image={homepage} />
      <div className="flex-col relative !w-[50%] 2xl:py-12 py-5">
        <div className="2xl:w-[48%] w-[65%] mx-auto">
          <div className="mt-[2vh]">
            <Image
              className="w-auto h-10 mx-auto mt-12"
              src={logo}
              type="text"
              alt="Your Company"
            />
            <p className="mt-5 text-center text-gray-500">
              Made for business owners - by experts in payments
            </p>
          </div>
          <div className="mt-8 2xl:mt-12">
            <div className="flex justify-center w-[400px] 2xl:w-auto mx-auto border border-gray-300"></div>
            <div className="flex items-center flex-col justify-center mx-auto  mt-10 2xl:mt-20">
              <TopTitle
                blackText="Welcome"
                purpleText="back!"
                description="Please login to your account"
              />
              {errorMessage}

              <Form onSubmit={onSubmit}>
                <Input
                  className="mt-5 2xl:mt-10"
                  width="2xl:w-[470px] w-[400px]"
                  name="email"
                  required={true}
                  type="email"
                  placeholder="Enter your email"
                />

                <PasswordInput
                  name="password"
                  required={true}
                  width="2xl:w-[470px] w-[400px]"
                  className="mt-4 2xl:mt-6"
                  placeholder="Enter your password"
                />

                <div className="flex items-center justify-between 2xl:w-[470px] w-[400px] mt-6 px-2">
                  <div className="flex items-center justify-between">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded cursor-pointer focus:ring-indigo-500"
                    />
                    <label
                      htmlFor="remember-me"
                      className="block ml-2 text-sm text-gray-900"
                    >
                      Remember me
                    </label>
                  </div>
                  <div className="text-sm">
                    <Link
                      href="/forget-password"
                      className="poppins-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>

                <button className="bg-primaryPurple focus:outline-none 2xl:w-[470px] w-[400px] flex items-center justify-center cursor-pointer py-4 rounded-full text-white mt-10">
                  Login
                </button>
              </Form>

              <p className="mt-12 mb-12 text-center text-black">
                Not registered yet?{' '}
                <span className="poppins-semibold cursor-pointer text-primaryPurple">
                  Create an account
                </span>
              </p>
              <p className="absolute left-[50%] translate-x-[-50%] bottom-[4%] text-center text-[#606060]">
                &copy; {new Date().getFullYear()} {process.env.NEXT_PUBLIC_NAME}{' '}
                ApS. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login