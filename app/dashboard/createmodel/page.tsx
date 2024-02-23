"use client";
import {
    createModelGenImage,
    createModelGenAccountCreation,
    callFineTuneAPI,
    fetchDeadLink,
} from "@/utils";
import NavBar from "@/components/NavBar";
import SideBar from "@/components/SideBar";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateModel = () => {
    const [formInput, setFormInput] = useState({
        modelName: "test-name",
        modelPrompt: "schoolgirl in a white t-shirt",
        fineTunePrompt: "change the girl's hairstyle",
        fineTuned: false,
    });

    // const [loading, setLoading] = useState(false);
    const [loaders, setLoaders] = useState({
        generateLoader: false,
        fineTuneLoader: false,
        createAccountLoader: false,
    });

    const [generatedImage, setGeneratedImage] = useState("");

    const [fineTuneResults, setFineTuneResults] = useState({
        img1: "https://bucketforadgen.s3.amazonaws.com/schoolgirl_in_a_white_t-shirt_model_img.png",
        img2: "",
        img3: "",
        img4: "",
    });

    async function modelGenImageGenerationCall() {
        setLoaders((e) => ({ ...e, generateLoader: true }));
        const image = await createModelGenImage(formInput.modelPrompt);
        setGeneratedImage(image);
        setLoaders((e) => ({ ...e, generateLoader: false }));
    }

    async function modelGenAccountCreationCall() {
        setLoaders((e) => ({ ...e, createAccountLoader: true }));
        await createModelGenAccountCreation(
            formInput.modelName,
            formInput.modelPrompt,
            generatedImage
        );
        // initialize xmtp
        toast.success("TBAI Account Created!", {
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

    async function fineTuneCall() {
        setLoaders((e) => ({ ...e, fineTuneLoader: true }));

        const results = await callFineTuneAPI(
            generatedImage,
            formInput.fineTunePrompt
        );

        toast.success("Tuned Output Generated!", {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });

        setLoaders((e) => ({ ...e, fineTuneLoader: false }));
    }

    return (
        <div>
            <NavBar />
            <div className="flex">
                <SideBar />
                <div className="p-4 sm:ml-64 pt-20 bg-gray-900 w-full h-[100%]">
                    <div className="text-white">
                        <div className="mt-10">
                            <h1 className="font-bold text-3xl text-center">
                                Generate Account
                            </h1>
                        </div>

                        <div className="mt-8 w-3/4 mx-auto">
                            <div className="flex flex-col gap-4">
                                <div className="flex">
                                    <div className="w-[10%] justify-center flex-shrink-0 cursor-default z-10 inline-flex items-center py-4 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-l-lg focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700  dark:focus:ring-gray-700 dark:text-gray-400 dark:border-gray-600">
                                        <p>Name</p>
                                    </div>
                                    <div className="relative w-full">
                                        <input
                                            type="search"
                                            className="block p-4 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-r-lg border-l-gray-50 border-l-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-l-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
                                            placeholder="Model Name"
                                            required
                                            value={formInput.modelName}
                                            onChange={(e) => {
                                                setFormInput({
                                                    ...formInput,
                                                    modelName: e.target.value,
                                                });
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="flex">
                                    <div className="w-[10%] justify-center flex-shrink-0 cursor-default z-10 inline-flex items-center py-4 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-l-lg focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700  dark:focus:ring-gray-700 dark:text-gray-400 dark:border-gray-600">
                                        <p>Prompt</p>
                                    </div>
                                    <div className="relative w-full">
                                        <input
                                            type="search"
                                            className="block p-4 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-r-lg border-l-gray-50 border-l-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-l-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
                                            placeholder="A muscular brown guy.."
                                            required
                                            value={formInput.modelPrompt}
                                            onChange={(e) => {
                                                setFormInput({
                                                    ...formInput,
                                                    modelPrompt: e.target.value,
                                                });
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        className="flex w-[14%] justify-center py-4 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                        onClick={modelGenImageGenerationCall}
                                    >
                                        {!loaders.generateLoader ? (
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
                        <h1 className="font-bold text-xl ">Model Looks</h1>
                        <div className="text-white w-[100%] px-4 box-background pt-4 pb-5 rounded-xl">
                            {generatedImage ? (
                                <div className="flex justify-between">
                                    <img src={generatedImage} width="300px" />
                                    <div className="flex w-[50%] flex-col gap-4">
                                        <input
                                            type="search"
                                            className="block p-4 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-lg border-l-gray-50 border-l-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-l-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
                                            placeholder="Model Name"
                                            required
                                            value={formInput.fineTunePrompt}
                                            onChange={(e) => {
                                                setFormInput({
                                                    ...formInput,
                                                    fineTunePrompt:
                                                        e.target.value,
                                                });
                                            }}
                                        />
                                        <div className="flex justify-end">
                                            <button
                                                className="flex w-[40%] justify-center py-4 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                                onClick={fineTuneCall}
                                            >
                                                {!loaders.fineTuneLoader ? (
                                                    <span>Fine Tune</span>
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
                                        <div className="flex justify-end">
                                            <button
                                                className="flex w-[40%] justify-center py-4 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                                onClick={
                                                    modelGenAccountCreationCall
                                                }
                                            >
                                                {!loaders.createAccountLoader ? (
                                                    <span>Create Account</span>
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

                    {/* fine tune outputs */}
                    {/* <div className="mx-[12%] mt-[2%]">
                        <h1 className="font-bold text-xl ">
                            Fine Tune Outputs
                        </h1>
                        <div className="flex gap-4 text-white w-[100%] px-4 box-background pt-4 pb-5 rounded-xl">
                        <div className="flex flex-col items-center">
                                <img src={fineTuneResults.img1} width="300px" />
                                <button className="flex mt-2 w-[50%] justify-center py-4 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                    Select
                                </button>
                            </div>
                            <div className="flex flex-col items-center">
                                <img src={fineTuneResults.img1} width="300px" />
                                <button className="flex mt-2 w-[50%] justify-center py-4 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                    Select
                                </button>
                            </div>
                            <div className="flex flex-col items-center">
                                <img src={fineTuneResults.img1} width="300px" />
                                <button className="flex mt-2 w-[50%] justify-center py-4 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                    Select
                                </button>
                            </div>
                            <div className="flex flex-col items-center">
                                <img src={fineTuneResults.img1} width="300px" />
                                <button className="flex mt-2 w-[50%] justify-center py-4 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                    Select
                                </button>
                            </div>
                        </div>
                    </div> */}

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

export default CreateModel;
