import React from "react";
import { useUserStore } from "../../../lib/userStore";

const UserInfo = () => {
  const { currentUser } = useUserStore();
  return (
    <div className="flex p-4 items-center justify-between">
      <div className="flex items-center gap-5">
        <img
          src={currentUser.avatar || "./avatar.png"}
          alt=""
          className="w-12 h-12 rounded-full"
        />
        <h2 className="font-bold">{currentUser.username}</h2>
      </div>
      <div className="flex gap-5">
        <img src="./more.png" alt="" className="w-4" />
        <img src="./video.png" alt="" className="w-4" />
        <img src="./edit.png" alt="" className="w-4" />
      </div>
    </div>
  );
};

export default UserInfo;
