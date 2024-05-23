import { useEffect } from "react";
import Chat from "./components/chat/Chat";
import Detail from "./components/details/Detail";
import List from "./components/list/List";
import Login from "./components/login/Login";
import Notification from "./components/notification/Notification";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
import { useUserStore } from "./lib/userStore";
import { useChatStore } from "./lib/chatStore";

const App = () => {
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();
  const { chatId } = useChatStore();

  console.log(currentUser);

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid);
    });

    return () => {
      unSub();
    };
  }, [fetchUserInfo]);

  if (isLoading)
    return (
      <div className="h-[100vh] flex items-center justify-end">
        <div className="p-12 text-[36px] rounded-lg bg-[#111928e6] text-white">
          Loading...
        </div>
      </div>
    );

  return (
    <div className="h-[100vh] flex items-center justify-end">
      <div className="flex w-[80vw] h-[90vh] bg-[#111928bf] backdrop-blur-md rounded-sm border-1 border-[#ffffff20] text-white">
        {!currentUser ? (
          <Login />
        ) : (
          <>
            <List />
            {chatId && <Chat />}
            {chatId && <Detail />}
          </>
        )}
        <Notification />
      </div>
    </div>
  );
};

export default App;
