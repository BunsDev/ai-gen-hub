"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import jwt from 'jsonwebtoken';
import {Client} from "@xmtp/xmtp-js"
import SideBar from "@/components/SideBar";
import NavBar from "@/components/NavBar";
import Messages from "@/components/Messages";
import { getSigner } from '@/utils';
import { Wallet } from 'ethers';

const ChatRoom = () => {

  const [sender, setSender] = useState('');
  const [receiver, setReceiver] = useState('');
  const [postMessage, setPostMessage] = useState('')
  const [signer, setSigner] = useState(null)
  const [msgs, setMsgs] = useState<any>([])
  const [xmtp, setXMTP] = useState<any>(null)
  const [conversation, setConversation] = useState<any>(null)

  var evnt = ''

  useEffect(() => {
    getData()
  }, []);

  const getXMTPandMessages = async () => {
    const signer = await getSigner();
    const sender = await signer.getAddress();
    const xmtpTMP = await Client.create(signer, {env: "dev"})
    setXMTP(xmtpTMP)
    const conversationTmp = await xmtpTMP.conversations.newConversation(
        receiver
      );
    setConversation(conversationTmp)
    const messages = await conversationTmp.messages();
    console.log('msgs', messages,  'values of messages', Object.values(messages))
    setMsgs(Object.values(messages))
  }

  const getData = async () => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const sndr = urlSearchParams.get('sender');
    const rcvr = urlSearchParams.get('receiver')
    setSender(sndr||'')
    setReceiver(rcvr||'')
    const s: any = await getSigner();
    setSigner(s)
    const signer = await getSigner();
    const sender = await signer.getAddress();
    const xmtpTMP = await Client.create(signer, {env: "dev"})
    setXMTP(xmtpTMP)
    const conversationTmp = await xmtpTMP.conversations.newConversation(
        rcvr||''
      );
    setConversation(conversationTmp)
    const messages = await conversationTmp.messages();
    console.log('msgs', messages,  'values of messages', Object.values(messages))
    setMsgs(Object.values(messages))
  }

  if (!sender || !receiver) {
    // Handle loading state or invalid token
    return <p>Loading...</p>;
  }

  const updateMessage = async () => {
    const messages = await conversation.messages();
    setMsgs(Object.values(messages))
  }

  const sendMessage = async () => {
    console.log('postMessage', postMessage)
    const xmtp = await Client.create(signer, { env: "dev" });
    const conversation =await xmtp.conversations.newConversation(receiver)
    await conversation.send(evnt);
    await updateMessage()
  }


  return (
    <div>
        <NavBar />
        <div className="flex">
            <SideBar />
            <div className="p-4 sm:ml-64 pt-20 bg-gray-900 w-full min-h-screen">
              {/* Hi, {sender} <br/>Chat with {receiver} */}
              HI, {sender}<br/>
              Chat with {receiver}
              <Messages msgs={msgs}/>
              <input className="text-black" onChange={(e)=> {evnt = (e.target.value)}}></input>
              <button onClick={sendMessage}>Send!</button>
            </div>
        </div>
    </div>
  );
};

export default ChatRoom;
