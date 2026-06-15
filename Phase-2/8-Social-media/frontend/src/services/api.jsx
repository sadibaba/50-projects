
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export const registerUser = async (userData) => {
  try {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    return { success: res.ok, ...data };
  } catch (error) {
    throw new Error(error.message, { cause: error });
  }
};

export const loginUser = async (credentials) => {
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",

      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    throw new Error(error.message,{ cause: error});
  }
};


export const getCurrentUser = async() =>{
  try{
    const token = localStorage.getItem('token')
    const res = await fetch (`${BASE_URL}/auth/me`,{
      headers:{Authorization :`Bearer ${token}`},
    })
    const data = await res.json()
    return data 
  }catch(error){
    throw new Error (error.message, { cause: error })
  }
}


export const getAllUsers = async() =>{
  try{
    const token = localStorage.getItem('token')
    const res = await fetch(`${BASE_URL}/auth/users`,{
      headers:{Authorization : `Bearer ${token}`},
    })
    const data = await res.json()
    return data
  }catch(error){
    throw new Error(error.message,{cause:error})
  }
}

export const getChatUsers = async () =>{
  try{
    const token = localStorage.getItem('token')
    const res = await fetch(`${BASE_URL}/messages/chat-users`,{
      headers:{Authorization:`Bearer ${token}`},
    })
    const data = await res.json()
    return data 
  }catch(error){
    throw new Error(error.message,{cause:error})
  }
}

export const getMessage = async (userId) =>{
  try{
    const token = localStorage.getItem('token')
    const res = await fetch(`${BASE_URL}/message/${userId}/message`,{
      headers:{Authorization:`Bearer ${token}`}
    })
    const data = await res.json()
    return data
  }catch(error){
    throw new Error(error.message,{cause:error})
}
}
export const sendMessageAPI = async (receiverId,message) =>{
  try{
    const token = localStorage.getItem('token')
    const res = await fetch(`${BASE_URL}/message`,{
      method:'POST',
      headers:{
        'Content-type':'application/json',
        Authorization:`Bearer ${token}`,
      },
      body:JSON.stringify({receiverId,message}),
    })
    const data = await res.json()
    return data
  }catch(error){
    throw new Error(error.message,{cause:error})
}
}