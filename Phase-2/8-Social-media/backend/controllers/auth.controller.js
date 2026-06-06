import {register,login} from '../services/auth.service.js'


export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await register({ username, email, password });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



export const loginUser = async(req, res)=>{
try{
    const user = await login(req.body)
    res.status(200).json(user)
    
}catch(error){
        res.status(400).json({
            error: error.message
        })
    }
}