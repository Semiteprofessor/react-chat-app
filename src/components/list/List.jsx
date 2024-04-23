import React from "react";
import UserInfo from "./userInfo/UserInfo";
import ChatList from "./chatList/ChatList";

const List = () => {
  return (
    <div className="flex flex-[1] flex-col">
      <UserInfo />
      <ChatList />
    </div>
  );
};

export default List;
