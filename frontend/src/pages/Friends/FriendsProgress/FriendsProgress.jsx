import React from 'react'
import Leaderboard from './Leaderboard/Leaderboard';
import FriendsComparison from './FriendsComparison/FriendsComparison';
const FriendsProgress = () => {
  return (
  <div className="font-Inter min-h-screen mt-2 flex-col  flex items-start justify-center">
    <Leaderboard/>
    <FriendsComparison/>
    </div>
  )
}

export default FriendsProgress
