import EmojiPicker from "emoji-picker-react";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import upload from "../../lib/upload";

const Chat = () => {
  const [chat, setChat] = useState([]);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [img, setImg] = useState({
    file: null,
    imageUrl: "",
  });

  const { chatId, user } = useChatStore();
  const { currentUser } = useUserStore();

  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data());
    });

    return () => {
      unSub();
    };
  }, [chatId]);

  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };

  const handleImg = (e) => {
    if (e.target.files[0]) {
      setImg({
        file: e.target.files[0],
        imageUrl: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleSend = async () => {
    if (text === "") return;

    let imgUrl = null;

    try {
      if (img.file) {
        imgUrl = await upload(img.file);
      }
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          text,
          senderId: currentUser.id,
          createdAt: new Date(),
          ...(imgUrl && { img: imgUrl }),
        }),
      });

      const userIDs = [currentUser.id, user.id];

      userIDs.forEach(async (id) => {
        const userChatsRef = doc(db, "userchats", id);

        const userChatsSnapshot = await getDoc(userChatsRef);

        if (userChatsSnapshot.exists()) {
          const userChatsData = userChatsSnapshot.data();

          const chatIndex = userChatsData.chats.findIndex(
            (c) => c.chatId === chatId
          );

          userChatsData.chats[chatIndex].lastMessage = text;
          userChatsData.chats[chatIndex].isSeen =
            id === currentUser.id ? true : false;
          userChatsData.chats[chatIndex].updatedAt = Date.now();

          await updateDoc(userChatsRef, { chats: userChatsData.chats });
        }
      });
    } catch (error) {
      console.log(error);
    }

    setImg({
      file: null,
      imageUrl: "",
    });

    setText("");
  };
  return (
    <div className="flex flex-col flex-[2] border-l border-r border-[#dddddd35] h-[100%]">
      <div className="flex p-5 items-center justify-between ">
        <div className="flex items-center gap-5">
          <img
            src="./avatar.png"
            alt=""
            className="w-14 h-14 rounded-full object-cover"
          />
          <div className="flex flex-col gap-1">
            <span className="text-lg font-bold">Jane Doe</span>
            <p className="text-sm font-light text-gray-400">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit.
            </p>
          </div>
        </div>
        <div className="flex gap-5">
          <img src="./phone.png" alt="" className="w-5 h-5" />
          <img src="./video.png" alt="" className="w-5 h-5" />
          <img src="./info.png" alt="" className="w-5 h-5" />
        </div>
      </div>
      <div className="p-5 flex-[1] overflow-y-auto flex flex-col gap-5">
        {chat?.messages?.map((message) => (
          <div
            className={
              message.senderId === currentUser?.id
                ? "max-w-[70%] flex gap-5 self-end"
                : "max-w-[70%] flex gap-5"
            }
            key={message?.createdAt}
          >
            <div className="flex-[1] flex flex-col gap-1">
              {message.img && (
                <img
                  src={message.img}
                  alt=""
                  className="w-[100%] h-80 rounded-md object-cover"
                />
              )}
              <p
                className={
                  message.senderId === currentUser?.id
                    ? "p-5 bg-[#5183fe] rounded-tr-xl rounded-br-xl rounded-bl-xl"
                    : "p-5 bg-[#1119284d] rounded-tl-xl rounded-bl-xl rounded-br-xl"
                }
              >
                {message.text}
              </p>
              <span className="text-sm">1 min ago</span>
            </div>
          </div>
        ))}
        {img.imageUrl && (
          <div className="">
            <div>
              <img src={img.imageUrl} alt="" />
            </div>
          </div>
        )}
        <div ref={endRef}></div>
      </div>
      <div className="p-5 flex items-center justify-between border-t border-[#dddddd35] gap-5 mt-auto">
        <div className="flex gap-5">
          <label htmlFor="file">
            <img src="./img.png" alt="" className="w-5 h-5 cursor-pointer" />
          </label>
          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={handleImg}
          />
          <img src="./camera.png" alt="" className="w-5 h-5 cursor-pointer" />
          <img src="./mic.png" alt="" className="w-5 h-5 cursor-pointer" />
        </div>
        <input
          type="text"
          placeholder="Type a message..."
          value={text}
          className="flex-[1] bg-[#11192880] border-none outline-none text-white p-5 rounded-md text-lg"
          onChange={(e) => setText(e.target.value)}
        />
        <div className="relative">
          <img
            src="./emoji.png"
            alt=""
            className="w-5 h-5 cursor-pointer"
            onClick={() => setOpen(!open)}
          />
          <div className="absolute bottom-12 left-0">
            <EmojiPicker open={open} onEmojiClick={handleEmoji} />
          </div>
        </div>
        <button
          className="bg-[#5183fe] text-white px-5 py-2 border-none rounded-md cursor-pointer"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
