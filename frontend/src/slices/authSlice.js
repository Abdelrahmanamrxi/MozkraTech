import { createSlice } from "@reduxjs/toolkit";

 const authSlice=createSlice({
    name:'auth',
    initialState:{accessToken:null ,isLoading:false,isRefreshing:false},
    reducers:{
        setAccessToken:(state,action)=>{
            state.accessToken=action.payload
            state.isLoading=false
        
        },
        removeAccessToken:(state)=>{
            state.accessToken=null
            state.isLoading=false
        },
        
        setLoading:(state)=>{
            state.isLoading=true
        },
        setRefreshing:(state,action)=>{
            state.isRefreshing=action.payload
        }
       
    }
})
export const {setAccessToken,removeAccessToken,setLoading,setRefreshing} = authSlice.actions
export default authSlice.reducer