import {useState} from 'react';
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";


function Login() {
const navigate = useNavigate()
const [credentials,setCredentials] = useState({
    email:'',
    password:''
})

const [message,setMessage]=useState('')
const [isLoading,setIsLoading]=useState(false)
const [errors, setErrors] = useState({})

const handleChange=(e) =>{
    setCredentials({
        ...credentials,
        [e.target.name]:e.target.value
    })
}

const validateForm =()=>{
  const newErrors = {}
  if(!credentials.email.trim()){
    newErrors.email = 'email is required'
  }else if (!credentials.email.includes('@')){
    newErrors.email = 'Enter a valid email'
  }
  if(!credentials.password){
    newErrors.password ='password is required'
  }else if (credentials.password.length < 6){
    newErrors.password = 'password must be atleast 6 characters'
  }
  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}

const handleLogin = async () =>{
    if(!validateForm())return
    
    setIsLoading(true)
    setMessage('')
    try{
      const response = await loginUser(credentials)
      console.log("🔴 Full response:", response)  
      console.log("🔴 Token:", response.token)  
      if(response.token){
        localStorage.setItem('token',response.token)
        console.log("✅ Token saved!") 
        setMessage('login successful redirecting...')
        setTimeout(() => navigate('/home'), 1500)
      }else{
        console.log("❌ No token in response") 
        setTimeout(() => setMessage(response.error  || 'login failed'), 1500)
      }
    }catch(error){
      console.log("❌ Catch error:", error)        
      setMessage('error' + error.error || error.message)
    }finally{
      setIsLoading(false)
    }

}

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-md p-8 border border-white/20">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
          <p className="text-gray-300 mt-2">Sign in to continue</p>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          
          {/* Email Field */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={credentials.email}
                onChange={handleChange}
                className={`w-full pl-10 pr-3 py-3 bg-white/10 border ${errors.email ? 'border-red-500': 'border-white/20'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200`}
              />
              {errors.email && (
                <p className='mt-1 text-red-400 text-sm'>
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={credentials.password}
                onChange={handleChange}
                className={`-full pl-10 pr-3 py-3 bg-white/10 border ${errors.password ? 'border-red-500':'border-white/20'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200`}
              />
              {errors.password && (
  <p className="mt-1 text-red-400 text-sm">{errors.password}</p>
)}
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-white/20 bg-white/10 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-300 text-sm">Remember me</span>
            </label>
            <button className="text-blue-400 hover:text-blue-300 text-sm transition duration-200">
              Forgot password?
            </button>
          </div>

          {/* Login Button */}
          <button 
  onClick={handleLogin}
  disabled={isLoading}  
  className="..."
>
  {isLoading ? (
    <div className="flex items-center justify-center space-x-2">
      <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin"></div>
      <span>Please wait...</span>
    </div>
  ) : (
    "Sign In"
  )}
</button>
          {message &&(
            <p className='mt-4 text-sm text-green-400'>
                {message}
            </p>
          )}

          {/* Demo Hint */}
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <p className="text-gray-400 text-xs">Demo: demo@example.com / password123</p>
          </div>

          {/* Switch to Register Link */}
          <div className="text-center">
            <p className="text-gray-300">
              Don't have an account?{" "}
              <button onClick={() => navigate('/register')} 
              className="text-blue-400 hover:text-blue-300 font-semibold transition duration-200">
                Create Account
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;