import React, { useEffect, useState } from "react";
import AddUser from "../../addUser/AddUser";
import { useUserStore } from "../../../lib/userStore";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useChatStore } from "../../../lib/chatStore";

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const [addMode, setAddMode] = useState(false);
  const [input, setInput] = useState("");

  const { currentUser } = useUserStore();
  const { chatId, changeChat } = useChatStore();

  useEffect(() => {
    const unSub = onSnapshot(
      doc(db, "userchats", currentUser.id),
      async (res) => {
        const items = res.data().chats;

        const promises = items.map(async (item) => {
          const userDocRef = doc(db, "users", item.receiverId);
          const userDocSnap = await getDoc(userDocRef);

          const user = userDocSnap.data();

          return { ...item, user };
        });

        const chatData = await Promise.all(promises);

        setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
      }
    );

    return () => {
      unSub();
    };
  }, [currentUser.id]);

  const handleSelect = async (chat) => {
    const userChats = chats.map((chat) => {
      const { user, ...rest } = chat;
      return rest;
    });

    const chatIndex = userChats.findIndex(
      (item) => item.chatId === chat.chatId
    );

    userChats[chatIndex].isSeen = true;

    const userChatsRef = doc(db, "userchats", currentUser.id);

    try {
      await updateDoc(userChatsRef, {
        chats: userChats,
      });
      changeChat(chat.chatId, chat.user);
    } catch (error) {
      console.log(error);
    }
  };

  const filteredChats = chats.filter((c) =>
    c.user.username.toLowerCase().includes(input.toLowerCase())
  );

  return (
    <div className="flex-[1] overflow-y-auto">
      <div className="flex items-center gap-4 p-4">
        <div className="flex flex[1] bg-[#11192880] items-center gap-4 rounded-md">
          <img src="./search.png" alt="" className="h-5 w-5" />
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent text-white outline-none border-none flex[1]"
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <img
          src={addMode ? "./minus.png" : "./plus.png"}
          alt=""
          className="h-6 w-6 bg-[#11192880] p-1 rounded-md cursor-pointer"
          onClick={() => setAddMode(!addMode)}
        />
      </div>
      {filteredChats.map((ch) => (
        <div
          className="flex items-center gap-4 p-4 cursor-pointer border-b border-[#dddddd35]"
          key={ch.chatId}
          onClick={() => handleSelect(ch)}
          style={{
            // backgroundColor: ch?.isSeen ? "transparent" : "#5183fe",
            backgroundColor: ch.chatId === chatId ? "#11192880" : "transparent",
          }}
        >
          <img
            src={
              ch.user.blocked.includes(currentUser.id)
                ? "./avatar.png"
                : ch.user.avatar || "./avatar.png"
            }
            alt=""
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="flex flex-col gap-3">
            <span className="font-500">
              {ch.user.blocked.includes(currentUser.id)
                ? "User"
                : ch.user.username}
            </span>
            <p className="text-[14px] italic font-300">{ch.lastMessage}</p>
          </div>
        </div>
      ))}
      {addMode && <AddUser />}
    </div>
  );
};

export default ChatList;
