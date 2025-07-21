import { ShipWheelIcon } from 'lucide-react';
import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router';
import { axiosInstance } from '../lib/axios';
import { useQueryClient } from '@tanstack/react-query';
import { QueryClient } from '@tanstack/react-query';
import { signup } from '../lib/api';
import { useMutation } from '@tanstack/react-query';
const SignUpPage = () => {
  const [signupData, setSignupData] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const queryClient=useQueryClient();


  const {mutate:signUpMutation, isPending, error } = useMutation({
    mutationFn:signup,
    onSuccess:()=>queryClient.invalidateQueries({queryKey:["authUser"]})
  })


  const handleSignup=(e)=>{
    e.preventDefault();
    // TODO: Send data to the server for signup
    console.log("Submitting signup data:", signupData); 
    signUpMutation(signupData);
  }

  return (
    <div className='min-h-screen flex item-center jusify-center p-4 sm:p-6 md:p-8' data-theme="forest">
       <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
         {/* SIGNUP FORM - LEFT SIDE  */}
         <div className='w-full lg:w-1/2 p-4 sm:p-8 flex-col'>
          {/* Logo */}
          <div className='mb-4 flex items-center justify-start gap-2'>
              <ShipWheelIcon className='size-9 text-primary'/>
              <span className='text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider'> StreamFlix</span>
          </div>
          
           {/* Error Message */}
           {error && <div className='alert alert-error mb-4'>
             <span>{error.response?.data?.message || error.message || "Something went wrong"}</span>
            </div>}

           {/* Signup Form */}
           <div className='w-full'>
             <form onSubmit={handleSignup}> 
              <div className='space-y-4'>
                <div>
                  <h2 className='text-xl font-semibold'>Create an Account</h2>
                  <p className='text-sm opacity-70'>Join StreamFlix and Enjoy Connecting Users From All Over The World</p>
                </div>
                <div className='space-y-3'>
                  {/* FULL-NAME */}
                   <div className='form-control w-full'>
                      <label className='label'>
                        <span className='label-text'>Full Name</span>
                      </label>
                      <input type='text'
                        placeholder='John Doe'
                        className='input input-bordered w-full'
                        value={signupData.fullName}
                        onChange={(e)=>setSignupData({...signupData,fullName:e.target.value})}
                        required
                      />
                   </div>
                   {/* EMAIL */}
                   <div className='form-control w-full'>
                      <label className='label'>
                        <span className='label-text'>Email</span>
                      </label>
                      <input type='email'
                        placeholder='John@Gmail.com'
                        className='input input-bordered w-full'
                        value={signupData.email}
                        onChange={(e)=>setSignupData({...signupData,email:e.target.value})}
                        required
                      />
                   </div>
                   {/* <PASSOWRD></PASSOWRD> */}
                   <div className='form-control w-full'>
                      <label className='label'>
                        <span className='label-text'>Password</span>
                      </label>
                      <input type='password'
                        placeholder='******'
                        className='input input-bordered w-full'
                        value={signupData.password}
                        onChange={(e)=>setSignupData({...signupData,password:e.target.value})}
                        required
                      />
                      <p className='text-xs opacity-70 mt-1'>Password must be at least 6 character long</p>
                   </div>
                   <div className="form-control">
                    <label className="label cursor-pointer justify-start gap-2">
                      <input type="checkbox" className="checkbox checkbox-sm" required />
                      <span className="text-xs leading-tight">
                        I agree to the{" "}
                        <span className="text-primary hover:underline">terms of service</span> and{" "}
                        <span className="text-primary hover:underline">privacy policy</span>
                      </span>
                     </label>
                    </div>

                </div>
                {/* SIGNUP BUTTON */}
                <button className='btn btn-primary w-full ' type='submit'>
                   {isPending? (
                    <>
                    <span className='loading loading-spinner loading-xs'>Loading...</span>
                    </>
                   ) : ("Sign Up" )}
                </button>
                {/* ALREADY HAVE AN ACCOUNT? */}
                <div className='text-center mt-4'>
                  <p className='text-sm'>
                     Already have an account?{" "}
                    <Link to='/login' className="text-primary hover:underline">Login</Link>
                  </p>

                </div>
              </div>
             </form>

           </div>
         </div>
         {/* RIGHT SIDE - CTA */}
         <div className='hidden lg:flex flex-col bg-base-200 w-1/2 p-4 sm:p-8'>
             <div className="max-w-md p-8">
                {/* Illustration */}
                  <div className="relative aspect-square max-w-sm mx-auto">
                      <img src="/I.png" alt="Language connection illustration" className="w-full h-full" />
                   </div>
                   <div className="text-center space-y-3 mt-6">
                        <h2 className="text-xl font-semibold">Connect with language partners worldwide</h2>
                        <p className="opacity-70">
                              Practice conversations, make friends, and improve your language skills together
                        </p>
                    </div>
             </div>
         </div>

       </div>
    </div>
  )
}

export default SignUpPage
