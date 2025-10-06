'use client';

import { useSession } from 'next-auth/react';
import { ChevronDownIcon } from 'lucide-react'; // optional accent icon
import { useState } from 'react';

export default function AvatarDropdown() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const avatar = session?.user?.avatar;
  const username = session?.user?.username;
  const email = session?.user?.email;

  if (!avatar) return null;

  return (
    <div
      className="relative group flex items-center"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <img
        src={avatar}
        alt="User avatar"
        className="w-6 h-6 rounded-full border border-neutral-300 cursor-pointer"
      />
      <ChevronDownIcon className="w-4 h-4 text-neutral-500 ml-1" />

      {isOpen && (
        <div className="absolute right-0 top-8 z-50 w-64 bg-white border border-neutral-200 rounded-lg shadow-lg p-4 text-sm fade-in">
          <p className="text-neutral-700 font-medium mb-1">Logged in as</p>
          <p className="text-neutral-900 font-semibold">{username}</p>
          <p className="text-neutral-500">{email}</p>
        </div>
      )}
    </div>
  );
}
