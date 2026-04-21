
/* eslint-disable no-unused-vars */
import {useState} from 'react'
import { motion } from 'framer-motion'
import { SearchIcon, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import api from "@/middleware/api"
import useDebounce from '@/hooks/useDebounce';
import {useQuery} from "@tanstack/react-query"
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
    exit: { opacity: 0, scale: 0.95, y: 20 },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05, duration: 0.3 },
    }),
  };
  
 


  async function searchFriends({queryKey}){
      const[ , debouncedQuery,currentPage]=queryKey
      const response=await api.get(`/user?name=${debouncedQuery}&limit=5&page=${currentPage}`)
      return response.data  
      }
    



function SearchFriends({setIsAddFriendsOpen}) {
  const { t } = useTranslation("friends");
      const [searchQuery, setSearchQuery] = useState("");
      const [currentPage,setPage]=useState(1)
      const debouncedQuery=useDebounce(searchQuery,300)
      const navigate=useNavigate()

       const {data={people:[],currentPage:1,totalDocs:0,totalPages:1},isLoading,isError,error}=useQuery({
        queryKey:['friends',debouncedQuery,currentPage],
        queryFn:searchFriends,
        enabled:debouncedQuery.trim().length>0,
        staleTime:1000 * 60 * 5,
        retry:false
       })

       console.log(data)
      
       const totalDocs = data.totalDocs ?? data.people.length;
       const totalPages = data.totalPages ?? 1;
       const canGoPrev = currentPage > 1;
       const canGoNext = currentPage < totalPages;

       const friendSearchError = isError
         ? error?.response?.data?.message || error?.message || t("searchFriends.errors.generic")
         : null;

      

  return (
  <>
    <motion.div
                variants={backdropVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.2 }}
                onClick={() => setIsAddFriendsOpen(false)}
                className="fixed inset-0 bg-[#0D081A]/70 backdrop-blur-xl z-50"
              />
  
              <motion.div
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="fixed inset-x-0 top-1/2 z-50 mx-auto w-[95%] max-w-5xl -translate-y-1/2 transform"
              >
                <div className="relative overflow-hidden rounded-[28px] border border-[#9B7EDE]/30 bg-[#1A1530]/95 shadow-[0_35px_90px_rgba(10,7,20,0.75)]">
                  <div className="absolute -left-24 -top-20 h-56 w-56 rounded-full bg-[#9B7EDE]/30 blur-3xl" />
                  <div className="absolute -right-20 top-14 h-48 w-48 rounded-full bg-[#6B6AD4]/30 blur-3xl" />
  
                  <div className="relative border-b border-[#9B7EDE]/20 p-6 md:p-8">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-white font-Inter text-2xl md:text-3xl font-bold">
                          {t("searchFriends.title")}
                        </h2>
                        <p className="mt-2 text-sm font-poppins text-[#C6B5F0]">
                          {t("searchFriends.subtitle")}
                        </p>
                      </div>
                      <motion.button
                        onClick={() => setIsAddFriendsOpen(false)}
                        whileHover={{ scale: 1.08, rotate: 90 }}
                        whileTap={{ scale: 0.95 }}
                        className="h-10 w-10 rounded-full border border-[#9B7EDE]/35 bg-[#9B7EDE]/10 text-[#D8CCF7] transition hover:bg-[#9B7EDE]/25"
                      >
                        x
                      </motion.button>
                    </div>
  
                    <div className="mt-6 flex flex-col gap-3">
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B8A7E5]">
                          <SearchIcon size={18} />
                        </span>
                        <input
                          type="text"
                          placeholder={t("searchFriends.searchPlaceholder")}
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full rounded-2xl border border-[#9B7EDE]/35 bg-[#9B7EDE]/10 py-3 pl-11 pr-4 text-white placeholder-[#B8A7E5]/60 focus:border-[#C1A8FF] focus:outline-none focus:ring-2 focus:ring-[#9B7EDE]/20"
                        />
                      </div>
  
                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#C6B5F0]">
                        <span className="rounded-full border border-[#9B7EDE]/25 bg-[#9B7EDE]/10 px-3 py-1">
                          {t("searchFriends.matches", { count: data.people?.length || 0 })}
                        </span>
                        
                        <span className="rounded-full border border-[#9B7EDE]/25 bg-[#9B7EDE]/10 px-3 py-1">
                          {t("searchFriends.searchOnlyMode")}
                        </span>
                      </div>
                    </div>
                  </div>
  
                  <div className="relative p-4 md:p-6">
                    <motion.div
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.08 }}
                      className="relative rounded-2xl border border-[#9B7EDE]/25 bg-[#120D24]/65 p-3"
                    >
                      <div className="mb-3 px-2 text-xs font-blinker uppercase tracking-[0.2em] text-[#B8A7E5]">
                        {t("searchFriends.people")}
                      </div>
  
                      <div className="max-h-[48vh] space-y-3 overflow-y-auto pr-1 scrollbar-hide">
                        { data.people?.length > 0 ? (
                          data.people.map((friend, index) => (
                            <motion.div
                              onClick={()=>{navigate(`/dashboard/profile/${friend._id}`)}}
                              key={friend._id}
                              custom={index}
                              variants={itemVariants}
                              initial="hidden"
                              animate="visible"
                              whileHover={{ y: -2 }}
                              className="w-full rounded-2xl border border-[#9B7EDE]/20 bg-[#9B7EDE]/8 p-4 text-left transition-all duration-200 hover:border-[#B59EF7]/55 hover:bg-[#9B7EDE]/16"
                            >
                              <div className="flex items-center justify-between gap-3">
                                <div className="flex min-w-0 items-center gap-3">
                                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-[#9B7EDE] via-[#7F77DD] to-[#6B6AD4] text-sm font-bold text-white shadow-lg">
                                    {friend.fullName[0]}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="truncate text-sm font-blinker font-semibold text-white">
                                      {friend.fullName}
                                    </p>
                         
                                  </div>
                                </div>
  
                                <div className="flex items-center gap-2">
                                  <span
                                    className="h-2.5 w-2.5 rounded-full"
                                   
                                  />
                                  <span className="text-xs text-[#C6B5F0]">{t("searchFriends.levelShort", { level: friend.level })}</span>
                                </div>
                              </div>
                            </motion.div>
                          ))
                        ) : (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex min-h-55 flex-col items-center justify-center rounded-2xl border border-dashed border-[#9B7EDE]/30 bg-[#9B7EDE]/5 p-8 text-center"
                          >
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-[#9B7EDE]/20 text-white">
                              <SearchIcon size={28} />
                            </div>
                            <p className="text-base font-medium text-[#E5DBFF]">
                              {searchQuery ? t("searchFriends.noFriendsFound") : t("searchFriends.startSearching")}
                            </p>
                            <p className="mt-1 text-sm text-[#B8A7E5]/85">
                             {friendSearchError ? friendSearchError : t("searchFriends.tryDifferentName")}
                            </p>
                          </motion.div>
                        )}
                      </div>
                      {isLoading && (
                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-2xl bg-[#0B0718]/85 backdrop-blur-sm p-6 text-center">
                          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/10 shadow-lg">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                          </div>
                          <p className="mt-4 text-base font-semibold text-white">{t("searchFriends.searchingTitle")}</p>
                          <p className="mt-2 text-sm text-[#C6B5F0]">{t("searchFriends.searchingSubtitle")}</p>
                        </div>
                      )}

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#9B7EDE]/20 bg-[#16102a]/90 p-3 text-sm text-[#C6B5F0]">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                            disabled={!canGoPrev}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#1f1734] text-white transition hover:bg-[#2f214d] disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <ChevronLeft className="h-5 w-5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setPage((prev) => prev + 1)}
                            disabled={!canGoNext}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#1f1734] text-white transition hover:bg-[#2f214d] disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <ChevronRight className="h-5 w-5" />
                          </button>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-[#d3c6ff]">
                          <span>{t("searchFriends.page")}</span>
                          <span className="rounded-full bg-[#9B7EDE]/20 px-3 py-1 text-white">{currentPage} / {totalPages}</span>
                          <span>{totalDocs ? t("searchFriends.total", { count: totalDocs }) : t("searchFriends.noResults")}</span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
  </>
  )
}

export default SearchFriends
