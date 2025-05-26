// "use client";
// import { useGetUserInfo } from '@/app/hooks/useUserInfo';
// import { logout } from '@/app/services/auth';
// import { StopIcon } from '@radix-ui/react-icons';
// import { User } from 'lucide-react';
// import Link from 'next/link';
// import Image from 'next/image';
// import { usePathname } from 'next/navigation';
// import React, { useEffect } from 'react'

// const TopButtons = () => {
//   const page = usePathname().split('/')[1];

//   const { data: userInfo } = useGetUserInfo();

//   // useEffect(() => {
//   //   const fetchAllUserInfo = async () => {
//   //     try {
//   //       if (!userInfo) {
//   //         return null;
//   //       }
//   //       const userData = await useUserInfo();
//   //       setUser(userData);

//   //     } catch (error) {
//   //       console.error("Erreur lors de la récupération des infos user", error);
//   //       return null

//   //     }
//   //   }

//   //   fetchAllUserInfo();

//   // }, [userInfo])

//   useEffect(() => {
//     console.log("userInfo (topbuttons) : ", userInfo);

//   }, [userInfo])

//   const handleLogout = async () => {
//     await logout();
//   }

//   if (page === "sign") {
//     return null;
//   }
//   return (
//     <div className="z-50 p-4 flex items-center justify-end gap-4">
//         {/* {userInfo?.avatar ? <Image src={userInfo?.avatar} alt="User avatar" width={24} height={24} className="rounded-full text-gray-600" /> : <User className="w-6 h-6 text-gray-600" />} */}
//         <Link href="/profile">{userInfo?.avatar ? <Image src={userInfo?.avatar} width={40} height={40} alt="User avatar" className="rounded-full text-gray-600 w-10 h-10 bg-cover bg-center border-2 shadow-md hover:filter hover:brightness-125 active:filter active:brightness-90 transition-all duration-300 border-[#e2007c]" /> : <User className="w-6 h-6 text-gray-600" />}</Link>

//       {userInfo !== null && <StopIcon onClick={handleLogout} className=' hover:brightness-125 hover:filter hover:shadow-md transition-all duration-300 w-6 h-6 bg-[#e2007c]' />}
//      {!userInfo && <Link href="/sign"><button className="bg-indigo-600 text-white px-6 py-2 rounded-lg">S&apos;inscrire
//       </button>
//       </Link>}

//     </div>
//   )
// }

// export default TopButtons

"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { User, LogOut } from "lucide-react"; // More standard icons
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"; // Import Radix Dropdown

import { useGetUserInfo } from "@/app/hooks/useUserInfo";
import { useLogout } from "@/app/hooks/useAuth";

const TopButtons = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: userInfo } = useGetUserInfo();
  const logoutMutation = useLogout();

  const handleLogout = async () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        router.push("/jobs");
      },
    });
  };

  useEffect(() => {
    console.log("userInfo (topbuttons) : ", userInfo);
  }, [userInfo]);

  if (pathname.startsWith("/sign")) {
    return null;
  }

  return (
    <div className="z-50 p-4 md:p-6">
      <div className="flex items-center justify-end gap-4">
        {userInfo ? (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button
                aria-label="User menu"
                className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full transition-all duration-200 ease-in-out hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" // Added focus ring, standard size
              >
                {userInfo.avatar ? (
                  <Image
                    src={userInfo.avatar}
                    alt="User avatar"
                    width={40}
                    height={40}
                    className="h-full w-full object-cover" // Ensure image covers the circle
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-500">
                    {" "}
                    {/* Placeholder background */}
                    <User className="h-6 w-6" />
                  </div>
                )}
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content
                align="end" // Align dropdown to the right edge of the trigger
                sideOffset={8} // Space between trigger and dropdown
                className="// Added animations z-50 w-48 rounded-md border border-gray-200 bg-gradient-to-b from-white/80 to-gray-100/80 shadow-lg backdrop-blur-sm animate-in fade-in-0 zoom-in-95 focus:outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2" // Added slide-in animations
              >
                {/* Optional: Display user name/email if available */}
                <DropdownMenu.Label className="border-b border-gray-200 px-3 py-2 text-sm font-medium text-gray-500">
                  {userInfo.username || userInfo.email || "Account"}
                </DropdownMenu.Label>

                <DropdownMenu.Item
                  asChild
                  className="cursor-pointer focus:bg-gray-100 focus:outline-none"
                >
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700"
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenu.Item>

                {/* Add more items here if needed (e.g., Settings) */}
                {/* <DropdownMenu.Item asChild className="focus:bg-gray-100 focus:outline-none cursor-pointer">
                   <Link href="/settings" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700">
                     <Settings className="w-4 h-4" /> Settings
                   </Link>
                 </DropdownMenu.Item> */}

                <DropdownMenu.Separator className="my-1 h-px bg-gray-200" />

                <DropdownMenu.Item
                  onSelect={handleLogout} // Use onSelect for better accessibility & event handling
                  className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-red-600 focus:bg-red-50 focus:outline-none" // Destructive action color
                >
                  <LogOut className="h-4 w-4" />
                  Déconnexon
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        ) : (
          // --- Logged Out State: Login and Sign Up Buttons ---
          <div className="flex items-center gap-3">
            <Link href="/sign">
              {" "}
              {/* Assuming /sign/in for login */}
              <button className="rounded-md border border-indigo-600 bg-white px-4 py-2 text-sm font-medium text-indigo-600 transition duration-150 ease-in-out hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                Connexion
              </button>
            </Link>
            {/* <Link href="/sign">
              {" "}
              <button className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition duration-150 ease-in-out hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                Sign Up
              </button>
            </Link> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopButtons;
