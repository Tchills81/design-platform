'use client';
import { useSession } from "next-auth/react";

export default function ProfileCard() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="p-4 text-sm text-neutral-500 animate-pulse">
        Loading profile...
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="p-4 text-sm text-neutral-500">
        Not signed in. Please log in to view your profile.
      </div>
    );
  }

  const { username, avatar, bio, email } = session.user;

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm border border-neutral-200">
      {avatar && (
        <img
          src={avatar}
          alt="GitHub avatar"
          className="w-12 h-12 rounded-full border border-neutral-300"
        />
      )}
      <div>
        <p className="text-lg font-semibold text-neutral-800">
          {username ?? "Unnamed user"}
        </p>
        {bio && (
          <p className="text-sm text-neutral-600 mt-1">{bio}</p>
        )}
        {email && (
          <p className="text-xs text-neutral-500 mt-1">{email}</p>
        )}
      </div>
    </div>
  );
}
