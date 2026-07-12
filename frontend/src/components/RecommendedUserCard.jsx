import { UserPlusIcon, CheckCircleIcon, MapPinIcon } from "lucide-react";
import AvatarImage from "./AvatarImage";
import { getLanguageFlag } from "./FriendCard";

const RecommendedUserCard = ({ user, onSendRequest, isRequestSent, isPending }) => {
  return (
    <div className="card bg-base-200 hover:shadow-lg transition-all duration-300 border border-base-300/50">
      <div className="card-body p-5 space-y-4">
        <div className="flex items-center gap-3">
          <AvatarImage
            src={user.profilePic}
            alt={user.fullName}
            name={user.fullName}
            className="avatar size-14 rounded-full"
            imgClassName="w-14 h-14 rounded-full object-cover"
          />
          <div className="min-w-0">
            <h3 className="font-semibold text-lg truncate">{user.fullName}</h3>
            {user.location && (
              <div className="flex items-center text-xs opacity-70 mt-1">
                <MapPinIcon className="size-3 mr-1" />
                {user.location}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <span className="badge badge-secondary">
            {getLanguageFlag(user.nativeLanguage)}
            Native: {user.nativeLanguage}
          </span>
          <span className="badge badge-outline">
            {getLanguageFlag(user.learningLanguage)}
            Learning: {user.learningLanguage}
          </span>
        </div>

        {user.bio && <p className="text-sm opacity-70 line-clamp-3">{user.bio}</p>}

        <button
          className={`btn w-full mt-2 ${isRequestSent ? "btn-disabled" : "btn-primary"}`}
          onClick={() => onSendRequest(user._id)}
          disabled={isRequestSent || isPending}
        >
          {isRequestSent ? (
            <>
              <CheckCircleIcon className="size-4 mr-2" />
              Request Sent
            </>
          ) : (
            <>
              <UserPlusIcon className="size-4 mr-2" />
              Follow / Add Friend
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default RecommendedUserCard;
