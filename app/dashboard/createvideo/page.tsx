"use client";

import {
    callStaticContentGenAPI,
    createStaticContentGeneration,
    callFineTuneAPI,
    uploadToIPFS,
    callDynamicContentGenAPI,
} from "@/utils";
import NavBar from "@/components/NavBar";
import SideBar from "@/components/SideBar";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React from "react";
import ReactPlayer from "react-player/youtube";
import { saveAs } from "file-saver";

const CreateVideo = () => {
    const [loading, setLoading] = useState(false);
    const [formInput, setFormInput] = useState({
        name: "Mountain Dew",
        prompt: "a fizzy cold drink",
        tba: "0x7779DB07fb8C95bc3c58818a23D5d771DEB9c354",
        gender: "female",
    });
    const [imgLoading, setImgLoading] = useState(false);
    const [loaders, setLoaders] = useState({
        generateLoader: false,
        fineTuneLoader: false,
        createAccountLoader: false,
    });
    const [generatedVideo, setGeneratedVideo] = useState(
        ""
    );

    async function contentGenVideoGenerationCall() {
        setLoading(true);

        const video = await callDynamicContentGenAPI(
            formInput.name,
            formInput.prompt,
            formInput.tba,
            formInput.gender
        );

        setGeneratedVideo(video);
        setLoading(false);
    }

    async function contentGenCreationCall() {
        setLoaders((e) => ({ ...e, createAccountLoader: true }));
        await createStaticContentGeneration(
            null,
            formInput.prompt,
            generatedVideo,
            formInput.tba
        );

        // initialize xmtp
        toast.success("Content Published to TBA!", {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
        setLoaders((e) => ({ ...e, createAccountLoader: false }));
    }

    async function download(_fileUrl: any) {
        const name = "gen-video";
        const fileUrl = _fileUrl;
        saveAs(fileUrl, name);
    }

    return (
        <div>
            <NavBar />
            <div className="flex">
                {/* <div className="flex"> */}
                <SideBar />

                <div className="p-4 sm:ml-64 pt-20 bg-gray-900 w-full h-[100%]">
                    <div className="text-white">
                        <div className="mt-10">
                            <h1 className="font-bold text-3xl text-center">
                                Generate Content
                            </h1>
                        </div>

                        <div className="mt-8 w-3/4 mx-auto">
                            <div className="flex flex-col gap-4">
                                <div className="flex">
                                    <div className="w-[12%] justify-center flex-shrink-0 cursor-default z-10 inline-flex items-center py-4 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-l-lg focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700  dark:focus:ring-gray-700 dark:text-gray-400 dark:border-gray-600">
                                        <p>Name</p>
                                    </div>
                                    <div className="relative w-full">
                                        <input
                                            type="search"
                                            className="block p-4 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-r-lg border-l-gray-50 border-l-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-l-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
                                            placeholder="Product name"
                                            required
                                            value={formInput.name}
                                            onChange={(e) => {
                                                setFormInput({
                                                    ...formInput,
                                                    name: e.target.value,
                                                });
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="flex">
                                    <div className="w-[12%] justify-center flex-shrink-0 cursor-default z-10 inline-flex items-center py-4 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-l-lg focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700  dark:focus:ring-gray-700 dark:text-gray-400 dark:border-gray-600">
                                        <p>Prompt</p>
                                    </div>
                                    <div className="relative w-full">
                                        <input
                                            type="search"
                                            className="block p-4 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-r-lg border-l-gray-50 border-l-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-l-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
                                            placeholder="A male skinny brown boy.."
                                            required
                                            value={formInput.prompt}
                                            onChange={(e) => {
                                                setFormInput({
                                                    ...formInput,
                                                    prompt: e.target.value,
                                                });
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="flex">
                                    <div className="w-[12%] justify-center flex-shrink-0 cursor-default z-10 inline-flex items-center py-4 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-l-lg focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700  dark:focus:ring-gray-700 dark:text-gray-400 dark:border-gray-600">
                                        <p>TBA</p>
                                    </div>
                                    <div className="relative w-full">
                                        <input
                                            type="search"
                                            className="block p-4 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-r-lg border-l-gray-50 border-l-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-l-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
                                            placeholder="Enter your TBA Address"
                                            required
                                            value={formInput.tba}
                                            onChange={(e) => {
                                                setFormInput({
                                                    ...formInput,
                                                    tba: e.target.value,
                                                });
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="flex">
                                    <div className="w-[12%] justify-center flex-shrink-0 cursor-default z-10 inline-flex items-center py-4 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-l-lg focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700  dark:focus:ring-gray-700 dark:text-gray-400 dark:border-gray-600">
                                        <p>Gender</p>
                                    </div>
                                    <div className="relative w-full">
                                        <input
                                            type="search"
                                            className="block p-4 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-r-lg border-l-gray-50 border-l-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-l-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
                                            placeholder="Female"
                                            required
                                            value={formInput.gender}
                                            onChange={(e) => {
                                                setFormInput({
                                                    ...formInput,
                                                    gender: e.target.value,
                                                });
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        className="flex w-[14%] justify-center py-4 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                        onClick={contentGenVideoGenerationCall}
                                    >
                                        {/* <span className="sr-only">Search</span> */}

                                        {!loading ? (
                                            // <svg
                                            //     className="w-5 h-5"
                                            //     fill="currentColor"
                                            //     xmlns="http://www.w3.org/2000/svg"
                                            //     height="40"
                                            //     viewBox="0 96 960 960"
                                            //     width="40s"
                                            // >
                                            //     <path d="M450 856V606H200v-60h250V296h60v250h250v60H510v250h-60Z" />
                                            // </svg>
                                            <span>Generate</span>
                                        ) : (
                                            <svg
                                                aria-hidden="true"
                                                role="status"
                                                className="inline w-4 h-4 text-white animate-spin"
                                                viewBox="0 0 100 101"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                                    fill="#E5E7EB"
                                                />
                                                <path
                                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                                    fill="currentColor"
                                                />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mx-[12%] mt-[2%]">
                        <h1 className="font-bold text-xl ">AI Content</h1>
                        {generatedVideo ? (
                            <div className="flex flex-col justify-between">
                                <p className="mb-4">{generatedVideo}</p>

                                {/* <ReactPlayer url="https://replicate.delivery/pbxt/LtrMwI6yvMqaEVD8ZeiwTama7RcFYZqOeScCpcTPRCY6lWBSA/out.mp4" /> */}
                                <div className="flex w-[50%] flex-col gap-4">
                                    <div className="flex justify-end gap-4">
                                        <button
                                            className="flex w-[40%] justify-center py-4 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                            onClick={() => {
                                                download(generatedVideo);
                                            }}
                                        >
                                            Download Video
                                        </button>
                                        <button
                                            className="flex w-[40%] justify-center py-4 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                            onClick={contentGenCreationCall}
                                        >
                                            {!loaders.createAccountLoader ? (
                                                <span>Publish Content</span>
                                            ) : (
                                                <svg
                                                    aria-hidden="true"
                                                    role="status"
                                                    className="inline w-4 h-4 text-white animate-spin"
                                                    viewBox="0 0 100 101"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                                        fill="#E5E7EB"
                                                    />
                                                    <path
                                                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                                        fill="currentColor"
                                                    />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="font-normal text-gray-700 dark:text-gray-400 mt-2">
                                Not yet generated
                            </p>
                        )}
                    </div>
                </div>
            </div>
            <ToastContainer
                position="bottom-left"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
        </div>
    );
};

export default CreateVideo;
