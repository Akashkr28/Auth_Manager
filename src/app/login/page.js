'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const handleLogin = async () => {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) router.push('/dashboard');
      else alert('Login failed');
    };
  
    return (
        
        <div className="bg-sky-100 flex justify-center items-center h-screen">
            
        <div className="w-1/2 h-screen hidden lg:block">
          <img src="https://img.freepik.com/fotos-premium/imagen-fondo_910766-187.jpg?w=826" alt="Placeholder Image" className="object-cover w-full h-full" />
        </div>
        
        <div className= "lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2">
          <h1 className="text-2xl font-semibold mb-4">Login</h1>
          <form action="#" method="POST">
            
            <div className="mb-4 bg-sky-100">
              <label for="username" class="block text-gray-600">Username</label>
              <input type="text" id="username" name="username" class="w-full border text-black border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" autoComplete="off"/>
            </div>
            
            <div className="mb-4">
              <label for="password" class="block text-gray-800">Password</label>
              <input type="password" id="password" name="password" class="w-full border text-black border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" autoComplete="off"/>
            </div>
            
            <div className="mb-4 flex items-center">
              <input type="checkbox" id="remember" name="remember" class="text-red-500"/>
              <label for="remember" class="text-green-900 ml-2">Remember Me</label>
            </div>
            
            <div className="mb-6 text-blue-500">
              <a href="#" className="hover:underline">Forgot Password?</a>
            </div>
            
            <button type="submit" className="bg-red-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full">Login</button>
          </form>
          
          <div className="mt-6 text-green-500 text-center">
            <a href="#" className="hover:underline">Sign up Here</a>
          </div>
        </div>
        </div>
    );
  }
