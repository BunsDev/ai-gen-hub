"use client";

import { getContentByTBA, getTokensURI } from "@/utils";
import { useEffect, useState } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import NavBar from "@/components/NavBar";
import SideBar from "@/components/SideBar";

const FetchContentByTBA = () => {


    const [data, setData] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const [formInput, setFormInput] = useState({
        tba: "",
    });

    async function fetchDataCall() {
        setLoading(true);
        const results = await getContentByTBA(formInput.tba);
        setData(results);
        setLoading(false);
    }

    async function download(_fileName: any, _fileUrl: any) {
        const name = _fileName;
        const fileUrl = _fileUrl;
        saveAs(fileUrl, name);
    }

    function LinkoCard({
        address,
        id,
        image,
    }: {
        address: any;
        id: any;
        image: any;
    }) {
        const [fetchedURI, setFetchedURI] = useState<any>({});

        useEffect(() => {
            fetchUri();
        }, []);

        console.log("mounted")

        async function fetchUri() {
            const res1 = await getTokensURI(address, id);
            const res2 = await axios.get(res1);
            console.log(address, id)
            console.log("URI: ", res2.data)
            setFetchedURI(res2.data);
        }

        return (
            <div className="mt-10 relative">
                <div className="flex gap-5 w-3/4 relative p-6 mx-auto cursor-pointer bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                    <img src={fetchedURI.image} width="100px" />
                    {/* <p>Model Id: {prop.tba}</p> */}
                    <div className="flex justify-between">
                        <div>
                            <p className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                                Asset Address: {address}
                            </p>

                            <p className="font-normal text-gray-700 dark:text-gray-400 mt-2">
                                Prompt Used: {fetchedURI._prompt}
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-between">
                        <button
                            onClick={() => {
                                download("output", fetchedURI.image);
                            }}
                            className="h-[50px] w-[140px] inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                            Download Model
                        </button>
                    </div>
                </div>
            </div>
        );
    }


    return (
        <div>
            <NavBar />
            <div className="flex">
                <SideBar />
                <div className="p-4 sm:ml-64 pt-20 bg-gray-900 w-full min-h-screen">
                    <div className="flex mt-4">
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
                        <button
                            className="flex ml-3 w-[14%] justify-center py-4 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            onClick={fetchDataCall}
                        >
                            Fetch
                        </button>
                    </div>
                    {data.map((e: any, i: number) => (
                        <LinkoCard
                            key={i}
                            address={e.token_address}
                            id={e.token_id}
                            image={e.modelImg}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FetchContentByTBA;
