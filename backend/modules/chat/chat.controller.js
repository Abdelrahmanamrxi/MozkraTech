import { response } from "express";
import conversationModel from "../../DB/models/Conversation.model.js";
import messageModel from "../../DB/models/message.model.js";
import { asyncHandler } from "../../utils/asyncHandler/index.js";
import HttpException from "../../utils/HttpException.js";

export const getChat = asyncHandler(async (req, res) => {
  const { conversationId, cursor } = req.query; // Use Cursor To Load 20 Messages Before That
  const query = { conversationId };
  const userId = req.user?._id;

  if (!conversationId) {
    return res.status(200).json({ message: "No chat found", chat: null });
  }

  if (cursor) {
    const parsedCursor = new Date(cursor);
    if (!Number.isNaN(parsedCursor.getTime())) {
      query.createdAt = { $lt: parsedCursor };
    }
  }

  if (userId) {
    query.deletedFor = { $ne: userId };
  }

  const messages = await messageModel
    .find(query)
    .populate(
      "senderId",
      "fullName email profileImage image lastActivityDate",
    )
    .sort({ createdAt: -1 })
    .limit(20);
  let unreadCount;
  const formattedChat = {
    messages: messages.map((msg) => ({
      _id: msg._id,
      message: msg.isDeletedForAll ? "" : msg.content,
      senderId: msg.senderId,
      senderProfileImage: msg.senderId?.profileImage ?? null,
      createdAt: msg.createdAt,
      isRead: msg.isRead,
      isDeletedForAll: msg.isDeletedForAll,
      deletedAt: msg.deletedAt,
      deletedBy: msg.deletedBy,
    })),
  };
  console.log(formattedChat);
  return res
    .status(200)
    .json({ message: "Chat retrieved successfully", chat: formattedChat });
});


export const sendMessageToAi=asyncHandler(async(req,res,next)=>{
  const {message,conversationId}=req.body
  const file=req.file
  const userId=req.user._id

  let conversation,isNew=false

  if(conversationId){
    conversation=await conversationModel.findOne({_id:conversationId})
    if(!conversation){
      return next(new HttpException("We couldn't find the conversation that you are looking for.",400))
    }
  }
  else{
    conversation=await conversationModel.create({
      participantType:'user-to-ai',
      participants:[{
        user:userId
      }],
      lastMessageAt:Date.now(),
      subject:message
    })
    isNew=true
  }
  
  let fileRes;
  if(file){
    const form=new FormData()
    form.append("file",new Blob([file.buffer]),file.originalname)
    form.append("conversationId", conversation._id.toString())
    const response=await fetch(`${process.env.AI_URL}/upload`,{
      method:'POST',
      body:form
    })
    fileRes=await response.json()
  }

  const aiMessageResponse=await fetch(`${process.env.AI_URL}/chat`,{
    headers: { "Content-Type": "application/json" }, 
    method:'POST',
    body:JSON.stringify({message,conversationId:conversation._id.toString()})
   })

  const aiMessage=await aiMessageResponse.json()
  if(!aiMessage.response){
    return next(new HttpException("Could not generate a response. Please try again.",500))
  }
  await messageModel.insertMany([
    {
      conversationId:conversation._id,
      senderId:userId,
      senderType:"user",
      messageType:file? "file" : "text",
      content:message,
      attachments:file ? {
        filename:file.originalname,
        mimeType:file.mimeType,
        size:file.size
      }:{}
    },
    {
      conversationId:conversation._id,
      senderId:userId,
      senderType:"ai-assistant",
      content:aiMessage.response,
      messageType:"text",
      aiContext:{
        model:"llama-3.1-8b-instant"
      }

    }
  ])
      res.status(200).json({
        conversationId:conversation._id,
        response:aiMessage.response,
        isNew
      })

})

export const getAIChat=asyncHandler(async(req,res,next)=>{
  const {conversationId}=req.params
  const userId=req.user._id

  const messages=await messageModel.find({
    conversationId,
    senderId:userId
  }).sort({createdAt:-1})

  if(!messages){
    return next(new HttpException("Couldn't find any messages matching your criteria",500))
  }
  res.status(200).json({response:"Messages Sent Successfully",messages})

})
export const getAllAIConversations=asyncHandler(async(req,res,next)=>{
   const userId=req.user._id

   const conversations=await conversationModel.find({
    "participants.user":userId,
    participantType:"user-to-ai"
   }).sort({createdAt:-1})

  res.status(200).json({conversations})
})
