import React from 'react'
import { useEffect } from 'react'
import axios from "axios"
import { serverUrl } from '../App'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/user_slice'
function useGetCurrentUSer() {
    const dispatch=useDispatch()
 useEffect(()=>{
    const getCurrentUser=async ()=>{
        try {
              const res=await axios.get(`${serverUrl}/api/user/get-current-user`,{withCredentials:true})
              dispatch(setUserData(res.data))
        } catch (error) {
            console.log(error)
        }
      
    }
    getCurrentUser()
 },[])
}

export default useGetCurrentUSer
