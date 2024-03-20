"use client";
import React, { ChangeEvent } from "react";
import { useState, useEffect } from "react";
import Navbar from "../_components/Navbar";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface FormData {
  email: string;
  password: string;
}

function Page() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Handle login logic here
    handleLogin();
  };

  const handleLogin = async () => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const res = await response.json();

      if (response.status == 404) {
        toast.warning("No User Found!", {
          autoClose: 3000,
        });
      } else if (response.status == 200) {
        toast.success("Login Successful!", {
          autoClose: 3000,
        });

        if (res.workspaceResult) {
          router.push("/workspace/" + res.workspaceResult.workspace_id);
        } else {
          router.push("/workspace");
        }
      } else {
        toast.error("Failed to Login", {
          autoClose: 3000,
        });
      }
      // Redirect Now as Login Successfull
    } catch (error) {}
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md">
          <h2 className="text-2xl text-center font-bold mb-4">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Page;
