import { gql, useQuery } from "@apollo/client";
import { useState } from "react";
import "tailwindcss/tailwind.css";

const Card = (props) => {
  const [currentCursor, setCursor] = useState();

  return (
    <div>
      <div key={user.id}>
        <div class="card min-w-sm border px-4 m-4  rounded border-gray-700 bg-gray-700 text-gray-50 transition-shadow shadow-xl hover:shadow-xl min-w-max">
          <a href={user.url}>
            <div class="flex items-center p-4">
              <div class="relative flex flex-col items-center w-full">
                <div class="h-24 w-24 md rounded-full relative avatar flex items-end justify-end text-purple-400 min-w-max flex bg-purple-200 text-purple-100 row-start-1 row-end-3 text-purple-650 ring-1 ring-white">
                  <img
                    class=" flex h-24 w-24 md rounded-full relative"
                    src={user.avatarUrl}
                    alt="space"
                  />
                  <div class="absolute"></div>
                </div>

                <p class="py-4 text-sm text-gray-200">{user.name}</p>
                <p class="text-sm text-gray-200">
                  Followers: {user.followerCount}
                </p>
                <p class="text-sm text-gray-200">Stars: {user.starCount}</p>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Card;
