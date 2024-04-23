import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { auth, db } from "../../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import upload from "../../lib/upload";

const Login = () => {
  const [avatar, setAvatar] = useState({
    file: null,
    imageUrl: "",
  });

  const [loading, setLoading] = useState(false);

  const handleAvatar = (e) => {
    if (e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        imageUrl: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);

    const { username, email, password } = Object.fromEntries(formData);

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      const imgUrl = await upload(avatar.file);

      await setDoc(doc(db, "users", res.user.uid), {
        username,
        email,
        avatar: imgUrl,
        id: res.user.uid,
        blocked: [],
      });

      await setDoc(doc(db, "userchats", res.user.uid), {
        chats: [],
      });

      toast.success("User created successfully! You can now login");
    } catch (error) {
      console.log(error);
      toast.error("User registration failed! ❌ " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);

    const { email, password } = Object.fromEntries(formData);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("User logged in successfully!");
    } catch (error) {
      console.log(error);
      toast.error("User login failed! ❌ " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[100%] h-[100%] flex items-center gap-24">
      <div className="flex flex-[1] flex-col items-center gap-5">
        <h2>Welcome back.</h2>
        <form className="flex flex-col gap-5" onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Email"
            name="email"
            className="p-5 border-none outline-none bg-[#11192899] text-white rounded-md"
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            className="p-5 border-none outline-none bg-[#11192899] text-white rounded-md"
          />
          <button
            disabled={loading}
            className="w-[100%] p-5 border-none bg-[#1f8ef1] text-white rounded-sm cursor-pointer font-bold"
          >
            {loading ? "Loading..." : "Sign In"}
          </button>
        </form>
      </div>
      <div className="h-[80%] w-[2px] bg-[#dddddd35]"></div>
      <div className="flex flex-[1] flex-col items-center gap-5">
        <h2>Create an account</h2>
        <form
          onSubmit={handleRegister}
          className="flex flex-col items-center justify-center gap-5"
        >
          <label
            htmlFor="file"
            className="w-[100%] flex items-center justify-between cursor-pointer underline"
          >
            <img
              src={avatar.imageUrl || "./avatar.png"}
              alt=""
              className="w-12 h-12 rounded-lg object-cover opacity-60"
            />
            Upload an image
          </label>
          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={handleAvatar}
            className="p-5 border-none outline-none bg-[#11192899] text-white rounded-md"
          />
          <input
            type="text"
            placeholder="Username"
            name="username"
            className="p-5 border-none outline-none bg-[#11192899] text-white rounded-md"
          />
          <input
            type="text"
            placeholder="Email"
            name="email"
            className="p-5 border-none outline-none bg-[#11192899] text-white rounded-md"
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            className="p-5 border-none outline-none bg-[#11192899] text-white rounded-md"
          />
          <button
            disabled={loading}
            className="w-[100%] p-5 border-none bg-[#1f8ef1] text-white rounded-sm cursor-pointer font-bold 
              
          "
          >
            {loading ? "Loading..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
