import {io} from 'socket.io-client'

let socket = null

export const connectSocket = (token) =>{
    if(!token) return null
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000'
    socket = io(socketUrl,{
        auth:{token},
    })
    return socket
}


export const getSocket = () => socket

export const disconnectSocket = () =>{
    if(socket){
        socket.disconnect()
        socket = null
    }
}