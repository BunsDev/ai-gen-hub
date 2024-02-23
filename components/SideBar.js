import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SideBar() {
    const pathname = usePathname();
    const id = pathname.split("/")[1];

    const isActive = (_pathname) => {
        return id === _pathname;
    };

    return (
        <aside
            id="logo-sidebar"
            className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
            aria-label="Sidebar"
        >
            <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
                <ul className="space-y-2 font-medium">
                    <li>
                        <Link
                            href="/dashboard/createmodel"
                            className={
                                "flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 " +
                                (isActive("/dashboard/createmodel")
                                    ? "bg-gray-700"
                                    : "")
                            }
                        >
                            <path d="M453 776h60V610h167v-60H513V376h-60v174H280v60h173v166Zm27.266 200q-82.734 0-155.5-31.5t-127.266-86q-54.5-54.5-86-127.341Q80 658.319 80 575.5q0-82.819 31.5-155.659Q143 347 197.5 293t127.341-85.5Q397.681 176 480.5 176q82.819 0 155.659 31.5Q709 239 763 293t85.5 127Q880 493 880 575.734q0 82.734-31.5 155.5T763 858.316q-54 54.316-127 86Q563 976 480.266 976Zm.234-60Q622 916 721 816.5t99-241Q820 434 721.188 335 622.375 236 480 236q-141 0-240.5 98.812Q140 433.625 140 576q0 141 99.5 240.5t241 99.5Zm-.5-340Z" />
                            <span className="flex-1 ml-3 whitespace-nowrap">
                                Create Account
                            </span>
                        </Link>
                    </li>

                    <li>
                        <Link
                            href="/dashboard/createcontent"
                            className={
                                "flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 " +
                                (isActive("/dashboard/createcontent")
                                    ? "bg-gray-700"
                                    : "")
                            }
                        >
                            <path d="M453 776h60V610h167v-60H513V376h-60v174H280v60h173v166Zm27.266 200q-82.734 0-155.5-31.5t-127.266-86q-54.5-54.5-86-127.341Q80 658.319 80 575.5q0-82.819 31.5-155.659Q143 347 197.5 293t127.341-85.5Q397.681 176 480.5 176q82.819 0 155.659 31.5Q709 239 763 293t85.5 127Q880 493 880 575.734q0 82.734-31.5 155.5T763 858.316q-54 54.316-127 86Q563 976 480.266 976Zm.234-60Q622 916 721 816.5t99-241Q820 434 721.188 335 622.375 236 480 236q-141 0-240.5 98.812Q140 433.625 140 576q0 141 99.5 240.5t241 99.5Zm-.5-340Z" />

                            <span className="flex-1 ml-3 whitespace-nowrap">
                                Create Post
                            </span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/dashboard/createvideo"
                            className={
                                "flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 " +
                                (isActive("/dashboard/nfts")
                                    ? "bg-gray-700"
                                    : "")
                            }
                        >
                            <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                            <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                            <span className="flex-1 ml-3 whitespace-nowrap">
                                Create Video
                            </span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/dashboard/fetchmodels"
                            className={
                                "flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 " +
                                (isActive("/dashboard/nfts")
                                    ? "bg-gray-700"
                                    : "")
                            }
                        >
                            <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                            <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                            <span className="flex-1 ml-3 whitespace-nowrap">
                                All Accounts
                            </span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/dashboard/fetchcontentbyId"
                            className={
                                "flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 " +
                                (isActive("/dashboard/nfts")
                                    ? "bg-gray-700"
                                    : "")
                            }
                        >
                            <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                            <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                            <span className="flex-1 ml-3 whitespace-nowrap">
                                Content
                            </span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/dashboard/analytics"
                            className={
                                "flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 " +
                                (isActive("/dashboard/nfts")
                                    ? "bg-gray-700"
                                    : "")
                            }
                        >
                            <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                            <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                            <span className="flex-1 ml-3 whitespace-nowrap">
                                Analytics
                            </span>
                        </Link>
                    </li>
                </ul>
            </div>
        </aside>
    );
}
