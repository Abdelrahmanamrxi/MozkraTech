import React from "react";
import { motion as Motion } from "framer-motion";
import { UserPlus, MessageSquare } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "../../../middleware/api";

async function addFriend(id){
  const response=await api.post(`friends/request`,{receiverId:id})
  return response.data
}
export default function PeopleProfileSidebar({ user, progressRing, itemVariants, glassPanel,id,friendship }) {
    const navigate = useNavigate();
    const queryClient=useQueryClient()
    const isFriendshipPending = friendship == null || friendship?.status === "pending";
    const isFriendsAccepted = friendship?.status === "accepted";
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
                Current Level
              </span>
              <span className="text-4xl font-Inter font-black text-white">{user.level}</span>
            </div>

            <p className="mb-3 text-[11px] text-slate-200">{user.xpToNext} XP to unlock the next level.</p>

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
              <span className="text-[11px] font-Inter font-bold text-white/90">{Number(user.xpProgress).toFixed(1)}% complete</span>
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
                Subjects
              </span>
              <p className="mt-2 text-sm font-Inter font-bold text-white">
                {user.subjects?.length || "Unknown" } {user.subjects?.length === 1 ? 'Subject' : 'Subjects'}
              </p>
            </div>
          )}

          <div className="space-y-3 pt-2">
                <button 
                onClick={()=>{!friendship && addFriendMutation.mutate(id)}} 
                disabled={!!friendship || addFriendMutation.isPending}
                className={`w-full rounded-2xl border px-4 py-3.5 text-[11px] font-Inter font-black uppercase tracking-[0.2em] shadow-[0_14px_48px_rgba(255,255,255,0.22)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 ${
             !friendship 
              ? "border-white/85 bg-white text-slate-900 hover:shadow-[0_18px_58px_rgba(255,255,255,0.28)] hover:bg-white/90" 
              : friendship.status === "pending"
             ? "border-yellow-400/50 bg-yellow-400/20 text-yellow-200 cursor-not-allowed"
             : "border-green-400/50 bg-green-400/20 text-green-200 cursor-not-allowed"
             }`}
            >
            <span className="flex items-center justify-center gap-2">
             <UserPlus size={16} strokeWidth={2.5} />
        {addFriendMutation.isPending 
      ? "Sending..." 
      : !friendship 
      ? "Connect" 
      : friendship.status === "pending"
      ? "Pending Approval"
      : "Friends"
    }
  </span>
    </button>
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
                Message
              </span>
            </button>
          </div>
        </div>
      </div>
    </Motion.div>
  );
}
