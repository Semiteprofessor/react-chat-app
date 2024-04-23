import React from "react";
import { auth, db } from "../../lib/firebase";
import { useUserStore } from "../../lib/userStore";
import { useChatStore } from "../../lib/chatStore";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";

const Detail = () => {
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock } =
    useChatStore();

  const { currentUser } = useUserStore();

  const handleBlock = async (block) => {
    if (!user) return;

    const userDocRef = doc(db, "users", currentUser.id);

    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });
      changeBlock(block);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex-[1]">
      <div className="p-5 flex flex-col items-center gap-4 border-b border-[#dddddd35]">
        <img
          src={user?.avatar || "./avatar.png"}
          alt=""
          className="w-[100px] h-[100px] object-cover rounded-full"
        />
        <h2>{user?.username}</h2>
        <p>Lorem, ipsum dolor sit amet.</p>
      </div>
      <div className="p-5 flex flex-col gap-6">
        <div className="">
          <div className="flex items-center justify-between">
            <span>Chat Settings</span>
            <img
              src="./arrowUp.png"
              alt=""
              className="w-8 h-8 bg-[#1119284d] p-3 rounded-full cursor-pointer"
            />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between">
            <span>Privacy & help</span>
            <img
              src="./arrowUp.png"
              alt=""
              className="w-8 h-8 bg-[#1119284d] p-3 rounded-full cursor-pointer"
            />
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <span>Shared photos</span>
            <img
              src="./arrowDown.png"
              alt=""
              className="w-8 h-8 bg-[#1119284d] p-3 rounded-full cursor-pointer"
            />
          </div>
          <div className="flex flex-col gap-5 mt-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                <img
                  src="https://i.postimg.cc/mDd5cBV2/k-law.jpg"
                  alt=""
                  className="w-10 h-10 rounded-sm object-cover"
                />
                <span className="text-md text-gray-50 font-light">
                  photo_2024_2.png
                </span>
              </div>
              <img
                src="./download.png"
                alt=""
                className="w-8 h-8 bg-[#1119284d] p-[10px] rounded-full cursor-pointer"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                <img
                  src="https://i.postimg.cc/mDd5cBV2/k-law.jpg"
                  alt=""
                  className="w-10 h-10 rounded-sm object-cover"
                />
                <span className="text-md text-gray-50 font-light">
                  photo_2024_2.png
                </span>
              </div>
              <img
                src="./download.png"
                alt=""
                className="w-8 h-8 bg-[#1119284d] p-[10px] rounded-full cursor-pointer"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                <img
                  src="https://i.postimg.cc/mDd5cBV2/k-law.jpg"
                  alt=""
                  className="w-10 h-10 rounded-sm object-cover"
                />
                <span className="text-md text-gray-50 font-light">
                  photo_2024_2.png
                </span>
              </div>
              <img
                src="./download.png"
                alt=""
                className="w-8 h-8 bg-[#1119284d] p-[10px] rounded-full cursor-pointer"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                <img
                  src="https://i.postimg.cc/mDd5cBV2/k-law.jpg"
                  alt=""
                  className="w-10 h-10 rounded-sm object-cover"
                />
                <span className="text-md text-gray-50 font-light">
                  photo_2024_2.png
                </span>
              </div>
              <img
                src="./download.png"
                alt=""
                className="w-8 h-8 bg-[#1119284d] p-[10px] rounded-full cursor-pointer"
              />
            </div>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between">
            <span>Shared Files</span>
            <img
              src="./arrowUp.png"
              alt=""
              className="w-8 h-8 bg-[#1119284d] p-3 rounded-full cursor-pointer"
            />
          </div>
        </div>
        <button
          className="py-2 px-5 bg-[#e64a698d] text-white border-none rounded-s cursor-pointer hover:bg-pink-800"
          onClick={handleBlock}
        >
          {isCurrentUserBlocked
            ? "You are Blocked!"
            : isReceiverBlocked
            ? "User Blocked"
            : "Block User"}
        </button>
        <button
          onClick={() => auth.signOut()}
          className="py-2 px-5 bg-[#1e73e8] text-white border-none rounded-s cursor-pointer hover:bg-blue-900"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Detail;
