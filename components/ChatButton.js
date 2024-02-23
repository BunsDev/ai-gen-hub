import { useRouter } from 'next/router';
import jwt from 'jsonwebtoken';
import { usePathname } from "next/navigation";

const ChatButton = ({ sender, receiver }) => {
  const pathname = usePathname();
  const id = pathname.split("/")[1];

  console.log('id', id)

  const createChatroom = () => {
    console.log('abt to sign using jwt', 'sender', sender, 'receiver', receiver)
    // Create a token by signing the sender and receiver information
    //JWT integration pending 
    // Navigate to the chatroom using the generated tokenconst currentPathname = usePathname();

    const token = '?sender=' + encodeURIComponent(sender) + '&receiver=' + encodeURIComponent(receiver);
    console.log('token', token)
    // Use the current pathname to construct the new pathname
    const newPathname = '/chats' + `/${token}`;

    // If you want to navigate to the new pathname, you can use window.location.replace
    window.location.replace(newPathname);
  };

  return (
    <button
      onClick={createChatroom}
      className="h-[40px] inline-flex items-center px-[6%] py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
    >
      Chat
    </button>
  );
};

export default ChatButton;
