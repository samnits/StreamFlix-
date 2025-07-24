
import { useThemeStore } from '../store/useThemeStore';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { getUserFriends, getRecommendedUsers } from '../lib/api';
import { sendFriendRequest } from '../lib/api';
import { getOutgoingFriendReqs } from '../lib/api';
import {Link} from "react-router"
import { useQuery, useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import FriendCard, { getLanguageFlag } from "../components/FriendCard";
import NoFriendsFound from '../components/NoFriendsFound';
import { CheckCircleIcon, MapPinIcon, UserPlusIcon, UsersIcon } from "lucide-react";
import { searchUserByEmail } from "../lib/api";


const HomePage = () => {
  const   queryClient=useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds]=useState(new Set());
  const {theme,setTheme}=useThemeStore();
  const  {data:friends=[], isLoading: loadingFriends}=useQuery({
    queryKey:["friends"],
    queryFn:getUserFriends,
  })

  const  {data:recommendedUsers=[], isLoading:loadingUsers}=useQuery({
    queryKey:["users"],
    queryFn:getRecommendedUsers,
  })

  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] }),
  });

   // new part for search functionality
  const [searchEmail, setSearchEmail] = useState("");
const {
  data: userResult,
  refetch,
  isFetching,
} = useQuery({
  queryKey: ["searchUser", searchEmail],
  queryFn: () => searchUserByEmail(searchEmail),
  enabled: false, // only run on manual trigger
});


  useEffect(() => {
      const outgoingIds=new Set();
      if(outgoingFriendReqs && outgoingFriendReqs.length>0) {
        outgoingFriendReqs.forEach((req)=>{
          outgoingIds.add(req.recipient._id);
        })
        setOutgoingRequestsIds(outgoingIds);
      }
  },[outgoingFriendReqs])


    return (
    <div className='p-4 sm:p-6 lg:p-8'>
      <div className='container mx-auto space-y-6'>
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
          <h2 className='text-2xl sm:text-3xl font-bold tracking-tight'>Your Friends</h2>
          <Link to="/notifications" className="btn btn-outline btn-sm">
            <UsersIcon className="mr-2 size-4" />
            Friend Requests
          </Link>
        </div> 
        {loadingFriends?(
          <div className='flex justify-center py-12'>
            <span className='loading loading-spinner loading-lg'/>

          </div>
        ):friends.length===0?(
          <NoFriendsFound />
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
            {friends.map((friend)=>(
                  <FriendCard key={friend._id} friend={friend}/>
            ))}

          </div>
        )
        }
        
      </div>
      <section>
  <div className="mb-6 sm:mb-8">
    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Search by Email</h2>
    <p className="opacity-70 mb-4">Find someone by their registered email</p>
    <div className="flex gap-2">
      <input
        type="email"
        placeholder="Enter email..."
        className="input input-bordered w-full max-w-sm"
        value={searchEmail}
        onChange={(e) => setSearchEmail(e.target.value)}
      />
      <button
        className="btn btn-primary"
        onClick={() => refetch()}
        disabled={!searchEmail}
      >
        Search
      </button>
    </div>
  </div>

  {isFetching ? (
    <div className="flex justify-center py-12">
      <span className="loading loading-spinner loading-lg" />
    </div>
  ) : userResult ? (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      <div className="card bg-base-200 hover:shadow-lg transition-all duration-300">
        <div className="card-body p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="avatar size-16 rounded-full">
              <img src={userResult.profilePic} alt={userResult.fullName} />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{userResult.fullName}</h3>
              {userResult.location && (
                <div className="flex items-center text-xs opacity-70 mt-1">
                  <MapPinIcon className="size-3 mr-1" />
                  {userResult.location}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            <span className="badge badge-secondary">
              {getLanguageFlag(userResult.nativeLanguage)}
              Native: {capitialize(userResult.nativeLanguage)}
            </span>
            <span className="badge badge-outline">
              {getLanguageFlag(userResult.learningLanguage)}
              Learning: {capitialize(userResult.learningLanguage)}
            </span>
          </div>

          {userResult.bio && <p className="text-sm opacity-70">{userResult.bio}</p>}

          <button
            className={`btn w-full mt-2 ${
              outgoingRequestsIds.has(userResult._id) ? "btn-disabled" : "btn-primary"
            }`}
            onClick={() => sendRequestMutation(userResult._id)}
            disabled={outgoingRequestsIds.has(userResult._id) || isPending}
          >
            {outgoingRequestsIds.has(userResult._id) ? (
              <>
                <CheckCircleIcon className="size-4 mr-2" />
                Request Sent
              </>
            ) : (
              <>
                <UserPlusIcon className="size-4 mr-2" />
                Send Friend Request
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  ) : null}
</section>
    </div>
  )
}

export default HomePage

export const capitialize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
