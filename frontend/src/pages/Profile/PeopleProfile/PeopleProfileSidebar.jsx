import React from "react";
import { motion as Motion } from "framer-motion";
import { UserPlus, MessageSquare, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../../../middleware/api";
async function acceptFriend(id){
  const response=await api.patch('friends/accept',{senderId:id})
  return response.data
}
async function declineFriend(id){
  const response = await api.delete('friends/reject', {
    data: { senderId: id }
  })
  return response.data
}

async function addFriend(id){
  const response=await api.post(`friends/request`,{receiverId:id})
  return response.data
}
export default function PeopleProfileSidebar({ user, progressRing, itemVariants, glassPanel,id,friendship,isOutgoingRequest,isIncomingRequest }) {
  const { t } = useTranslation("profile");

 
    const navigate = useNavigate();
    const queryClient = useQueryClient()
    const isFriendshipPending = friendship == null || friendship?.status === "pending";
    const isFriendsAccepted = friendship?.status === "accepted";
    const isOutgoingPending = friendship?.status === "pending" && isOutgoingRequest;
    const isIncomingPending = friendship?.status === "pending" && isIncomingRequest;
    const canSendRequest = !friendship && !isIncomingRequest;

    const acceptFriendMutation = useMutation({
      mutationFn: (id) => acceptFriend(id),
      onMutate: async (id) => {
        await queryClient.cancelQueries({ queryKey: ['user', id] })
        return queryClient.getQueryData(['user', id])
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['user', id] })
      }
    })

    const declineFriendMutation = useMutation({
      mutationFn: (id) => declineFriend(id),
      onMutate: async (id) => {
        await queryClient.cancelQueries({ queryKey: ['user', id] })
        return queryClient.getQueryData(['user', id])
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['user', id] })
      }
    })

    const addFriendMutation=useMutation({
        onMutate:async(id)=>{
            // cancel any query refetching happen while pressing the button
            await queryClient.cancelQueries({
                queryKey:['user',id]
            })
            // get original data 
            const prev=queryClient.getQueryData(['user',id])
            
            // optmistic ui fake update to update the data
            queryClient.setQueryData(["user",id],(old)=>{
                return {...old,user:{...old.user,requestAdded:true}}
            })
            return {prev}

        },
        mutationFn:(id)=>addFriend(id),
            //if request fails restore previous state
          onError: (err, id, context) => {
             queryClient.setQueryData(["user", id], context.prev);
            },
        // refetch data if requests succeeds
        onSuccess: (data, id) => {
            queryClient.invalidateQueries({ queryKey: ["user", id] });
        },
    })
    console.log(addFriendMutation.data)
  return (
    <Motion.div variants={itemVariants} className="lg:col-span-4">
      <div className={`${glassPanel} p-6 md:p-7 h-full`}>
        <div className="space-y-6">
          {!isFriendshipPending && (
          <div
            className="rounded-2xl border p-4 transition-all duration-300 hover:shadow-[0_20px_40px_rgba(16,12,29,0.45)]"
            style={{
              borderColor: "rgba(202,196,206,0.28)",
              background: "linear-gradient(150deg, rgba(141,134,201,0.23) 0%, rgba(36,32,56,0.58) 100%)",
            }}
          >
            <div className="mb-3 flex items-end justify-between">
              <span className="text-[10px] font-Inter font-black uppercase tracking-[0.22em] text-slate-200/90">
                {t("stats.currentLevel")}
              </span>
              <span className="text-4xl font-Inter font-black text-white">{user.level}</span>
            </div>

            <p className="mb-3 text-[11px] text-slate-200">{t("stats.xpToNext", { xp: user.xpToNext })}</p>

            <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/15">
              <Motion.div
                initial={{ width: 0 }}
                animate={{ width: progressRing + "%" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{
                  background: "linear-gradient(90deg, var(--color-primary-light) 0%, var(--color-secondary-light) 100%)",
                }}
              />
            </div>

            <div className="mt-2 flex justify-end">
              <span className="text-[11px] font-Inter font-bold text-white/90">{t("stats.complete", { value: Number(user.xpProgress).toFixed(1) })}</span>
            </div>
          </div>
          )}

          <div className="flex flex-wrap gap-2">
            {user.badges.map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-white/25 bg-white/12 px-3 py-1 text-[10px] font-Inter font-bold uppercase tracking-wider text-slate-100 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/20"
              >
                {badge}
              </span>
            ))}
          </div>


          {isFriendshipPending && (
            <div
              className="rounded-2xl border p-4 transition-all duration-300 hover:shadow-[0_20px_40px_rgba(16,12,29,0.45)]"
              style={{
                borderColor: "rgba(202,196,206,0.28)",
                background: "linear-gradient(150deg, rgba(141,134,201,0.23) 0%, rgba(36,32,56,0.58) 100%)",
              }}
            >
              <span className="text-[10px] font-Inter font-black uppercase tracking-[0.22em] text-slate-200/90">
                  {t("stats.subjects")}
              </span>
              <p className="mt-2 text-sm font-Inter font-bold text-white">
                  {user.subjects?.length
                    ? `${user.subjects.length} ${user.subjects.length === 1 ? t("stats.subject") : t("stats.subjects")}`
                    : t("fallback.unknown")}
              </p>
            </div>
          )}

          <div className="space-y-3 pt-2">
                {canSendRequest && (
                  <button 
                onClick={() => addFriendMutation.mutate(id)} 
                disabled={addFriendMutation.isPending}
                className={`w-full rounded-2xl border px-4 py-3.5 text-[11px] font-Inter font-black uppercase tracking-[0.2em] shadow-[0_14px_48px_rgba(255,255,255,0.22)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 ${
             addFriendMutation.isPending
              ? "border-white/40 bg-white/20 text-slate-300 cursor-not-allowed" 
              : "border-white/85 bg-white text-slate-900 hover:shadow-[0_18px_58px_rgba(255,255,255,0.28)] hover:bg-white/90"
             }`}
            >
            <span className="flex items-center justify-center gap-2">
             {addFriendMutation.isPending ? (
               <Loader2 size={16} strokeWidth={2.5} className="animate-spin" />
             ) : (
               <UserPlus size={16} strokeWidth={2.5} />
             )}
        {addFriendMutation.isPending 
      ? t("actions.sending") 
      : t("actions.sendFriendRequest")
    }
  </span>
    </button>)}
            {isOutgoingPending && (
                  <button 
                    disabled
                    className="w-full rounded-2xl border border-yellow-400/50 bg-yellow-400/20 px-4 py-3.5 text-[11px] font-Inter font-black uppercase tracking-[0.2em] text-yellow-200 cursor-not-allowed"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <UserPlus size={16} strokeWidth={2.5} />
                      {t("actions.requestSent")}
                    </span>
                  </button>
                )}
            {isFriendsAccepted && (
              <button
              onClick={() => {
                if (isFriendsAccepted) {
                  navigate('/dashboard/friends');
                }
              }}
              disabled={!isFriendsAccepted}
              className={`w-full rounded-2xl border px-4 py-3.5 text-[11px] font-Inter font-black uppercase tracking-[0.2em] text-white backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_34px_rgba(13,10,23,0.4)] ${!isFriendsAccepted ? 'opacity-50 cursor-not-allowed' : ''}`}
              style={{
                borderColor: "rgba(202,196,206,0.36)",
                background: "linear-gradient(130deg, rgba(144,103,198,0.36) 0%, rgba(36,32,56,0.64) 100%)",
              }}
            >
              <span className="flex items-center justify-center gap-2">
                <MessageSquare size={16} strokeWidth={2.5} />
                {t("actions.message")}
              </span>
            </button>)}
       {isIncomingPending && (
<>
         <button 
         onClick={() => acceptFriendMutation.mutate(id)}
         disabled={acceptFriendMutation.isPending}
         className={`w-full cursor-pointer rounded-2xl border px-4 py-3.5 text-[11px] font-Inter font-black uppercase tracking-[0.2em] shadow-[0_14px_48px_rgba(255,255,255,0.22)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 border-green-400/50 bg-green-400/20 text-green-200 ${acceptFriendMutation.isPending ? 'opacity-60 cursor-not-allowed' : ''}`}
         >
            <span className="flex items-center justify-center gap-2">
             {acceptFriendMutation.isPending ? (
               <Loader2 size={16} strokeWidth={2.5} className="animate-spin" />
             ) : (
               <UserPlus size={16} strokeWidth={2.5} />
             )}
             {acceptFriendMutation.isPending ? t("actions.accepting") : t("actions.acceptRequest")}
  </span>
    </button>
       <button   
       onClick={() => declineFriendMutation.mutate(id)}
       disabled={declineFriendMutation.isPending}
      className={`w-full cursor-pointer rounded-2xl border px-4 py-3.5 text-[11px] font-Inter font-black uppercase tracking-[0.2em] shadow-[0_14px_48px_rgba(255,255,255,0.22)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 border-red-700/50 bg-red-700/80 text-white ${declineFriendMutation.isPending ? 'opacity-60 cursor-not-allowed' : ''}`}
       >
            <span className="flex items-center justify-center gap-2">
             {declineFriendMutation.isPending ? (
               <Loader2 size={16} strokeWidth={2.5} className="animate-spin" />
             ) : null}
                          {declineFriendMutation.isPending ? t("actions.declining") : t("actions.declineRequest")}
  </span>
    </button>
    </>
  )}    
          </div>
          </div>
          </div>
          </Motion.div>
  );
}