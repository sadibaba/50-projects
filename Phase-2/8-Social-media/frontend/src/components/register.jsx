import {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import {registerUser} from '../services/api'

function Register() {
  const navigate = useNavigate()
  const [formData ,setFormData] = useState({
username:'',
email:'',
password:''
})
const [message , setMessage]=useState('')
//eslint-disable-next-line
const [isLoading,setIsLoading]=useState(false)
const [errors,setErrors] = useState({})
const handleChange=(e)=>{
  setFormData({
  ...formData,
  [e.target.name]:e.target.value
})
}
const validateForm = ()=>{
  const newErrors = {}

  if(!formData.username.trim()){
    newErrors.username = 'Username is required'
  }
  if(!formData.email.trim()){
    newErrors.email = 'email is required'
  }
  if(!formData.password.trim()){
    newErrors.password = 'password is required'
  }else if(formData.password.length < 8){
    newErrors.password = 'password must be at least 8 characters'
  }
  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}

const handleRegister = async ()=>{
  if(!validateForm())return
   console.log(" Sending:", formData)
  console.log('registering user with data:',JSON.stringify(formData,null,2))
  setIsLoading(true)
  setMessage('')
  try{
    const response = await registerUser(formData)
    if(response.token){
       localStorage.setItem('token', response.token)
      setMessage('regsiter successfull redirecting')
       navigate('/home')
    }else{
      setMessage((response.error  || 'registeration failed'))
    }
  }catch(error){
    setMessage('error:' + error.error || error.message    )
  }finally{
    setIsLoading(false)
  }
}
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-md p-8 border border-white/20">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white">Create Account</h2>
          <p className="text-gray-300 mt-2">Join us and start your journey</p>
        </div>

        {/* Form Fields - Static, no state binding yet */}
        <div className="space-y-4">
          
          {/* Username Field */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                className={`w-full pl-10 pr-3 py-3 bg-white/10 border ${errors.username ? 'border-red-500' : 'border-white/20'} border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200`}
              />
            </div>
          </div>

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
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-10 pr-3 py-3 bg-white/10 border ${errors.email ? 'border-red-500' : 'border-white/20'} border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200`}
              />
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
                value={formData.password}
                onChange={handleChange}
                className={`w-full pl-10 pr-3 py-3 bg-white/10 border ${errors.password ? 'border-red-500' : 'border-white/20'} border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200`}
              />
            </div>
          </div>

          {/* Register Button */}
          <button onClick={handleRegister} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 rounded-xl transition duration-200 transform hover:scale-[1.02] shadow-lg">
            Create Account
          </button>
{message &&(
  <p className='mt-4 text-sm text-green-400'>
    {message}
  </p>
)}
          {/* Switch to Login Link */}
          <div className="text-center">
            <p className="text-gray-300">
              Already have an account?{" "}
              <button
              onClick={() => navigate('/login')}
               className="text-purple-400 hover:text-purple-300 font-semibold transition duration-200">
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;