import React from 'react'
import { useCallback } from 'react'
import { useState,useEffect,useRef } from 'react'
import {useSelector} from 'react-redux'
import { io } from 'socket.io-client'
import { useQuery } from '@tanstack/react-query'
import api from '../middleware/api'

async function getChat(selected,cursor){
  try{

    const response=await api.get(`/chat?conversationId=${selected.conversationId}&cursor=${cursor}`)
    return response.data
  }
  catch(err){
    throw new Error(err.response.data.message || err.message || "Failed to Retrieve Chat")
  }
    
}


function normalizeChat(messages,selected){
  return messages.map((message)=>{
    const senderId=message.senderId._id
    const isFromThem=selected._id===senderId
    return{
      ...message,
      conversationId:selected.conversationId,
      friendId:selected._id,
      senderId:senderId,
      sentAt:message.createdAt,
      from:isFromThem?'them':'me',

    }
  }).reverse()
}

function useFriendsMessages(selected) {
    const socketRef = useRef(null)
    const [messages, setMessages] = useState([])
    const [userStatus, setUserStatus] = useState("offline")
    const accessToken=useSelector((state)=>state.auth.accessToken)
    const[status,setStatus]=useState("idle")

    // Clear messages when conversation changes
    useEffect(() => {
      requestAnimationFrame(() => {
        setMessages([]);
      });
    }, [selected?.conversationId]);

    const{data,isLoading,error}=useQuery({
    queryKey:["chat",selected?.conversationId],
    queryFn:()=>getChat(selected),
    enabled:!!selected?.conversationId,
    retry:1,
    select:(response)=>normalizeChat(response.chat?.messages ?? [],selected),
  })

    // Update messages when API data arrives
    useEffect(() => {
      if(data){
        requestAnimationFrame(() => {
          setMessages(data);
        });
      }
    }, [data]);
    useEffect(() => {
      const socket = io(import.meta.env.VITE_SOCKET_URL, {
        auth: {
          authorization: `Bearer ${accessToken}`
        }
      });

      socketRef.current = socket;

      socket.on("connect", () => {
        setStatus("connected");
      });

      socket.on("connect_error", () => {
        setStatus("connect_error");
      });

      socket.on("receiveMessage", (payload) => {
        const senderId = payload.senderId?._id?.toString() ?? payload.senderId?.toString();
        const receiverId = payload.receiverId?.toString();
        const friendId = senderId;

        setMessages((prev) => {
          // Check if message already exists by _id or fallback key
          const msgKey = payload._id?.toString() ?? `${payload.conversationId}-${senderId}-${payload.createdAt}`;
          const exists = prev.some((msg)=>{
            const key = msg._id?.toString() ?? `${msg.conversationId}-${msg.senderId}-${msg.sentAt}`;
            return key === msgKey;
          });
          
          if(exists) return prev;
          
          return [
            ...prev,
            {
              ...payload,
              conversationId: payload.conversationId,
              from: "them",
              friendId,
              senderId,
              receiverId,
              sentAt:payload.createdAt,
            },
          ];
        });
      });

      socket.on("successMessage", (payload) => {
        const senderId = payload.senderId?._id?.toString() ?? payload.senderId?.toString();
        const receiverId = payload.receiverId?.toString();
        const friendId = receiverId;
        
        if (payload.status) {
          setUserStatus(payload.status);
        }
        
        setMessages((prev) => {
          // Check if message already exists by _id or fallback key
          const msgKey = payload._id?.toString() ?? `${payload.conversationId}-${senderId}-${payload.createdAt}`;
          const exists = prev.some((msg)=>{
            const key = msg._id?.toString() ?? `${msg.conversationId}-${msg.senderId}-${msg.sentAt}`;
            return key === msgKey;
          });
          
          if(exists) return prev;
          
          return [
            ...prev,
            {
              ...payload,
              conversationId: payload.conversationId,
              from: "me",
              friendId,
              senderId,
              receiverId,
              sentAt:payload.createdAt,
            },
          ];
        });
      });
      

      socket.on("authError", (payload) => {
        console.warn("Socket auth error:", payload);
        setStatus("authError");
      });

      socket.on("sendError", (payload) => {
        console.warn("Socket send error:", payload);
        setStatus("sendError");
      });
      socket.on("messagesMarkedAsRead", ({ conversationId, status }) => {
        if (status) {
          setUserStatus(status);
        }
        
        setMessages((prev) =>
          prev.map((msg) =>
            msg.conversationId?.toString() === conversationId?.toString() && msg.from === "me"
              ? { ...msg, isRead: true }
              : msg,
          ),
        );
      });

      socket.on("userOnline", ({ userId }) => {
        if(selected?._id?.toString() === userId?.toString()){
          setUserStatus("online");
        }
      });

      socket.on("userOffline", ({ userId }) => {
        if(selected?._id?.toString() === userId?.toString()){
          setUserStatus("offline");
        }
      });

      return () => {
        socket.disconnect();
      };
    }, [accessToken, selected?._id]);
    
    const sendMessage = useCallback(({ destId, message }) => {
      const socket = socketRef.current;
      if (!socket) {
        setStatus('sendError')
        return;
      }
      socket.emit("sendMessage", { destId, message });
    }, []);

    const markAsRead = useCallback(({ conversationId }) => {
      const socket = socketRef.current;
      if (!socket) {
        setStatus('sendError')
        return;
      }
      if (!conversationId) {
        return;
      }

      // Local read action: mark incoming messages in this chat as read immediately.
      setMessages((prev) =>
        prev.map((msg) =>
          msg.conversationId?.toString() === conversationId?.toString() && msg.from === "them"
            ? { ...msg, isRead: true }
            : msg,
        ),
      );

      socket.emit("markAsRead", { conversationId });
    }, []);


    
    console.log(messages)
    return { 
      status,
      socketConnectionStatus: status,
      userStatus,
      messages, 
      sendMessage, 
      markAsRead, 
      isLoading, 
      error 
    };

}

export default useFriendsMessages
