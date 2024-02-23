"use client";

import React from "react";
import { PushAPI, CONSTANTS } from "@pushprotocol/restapi";
import { ethers } from "ethers";
import web3modal from "web3modal";
import styled from "styled-components";
import NavBar from "../../components/NavBar";
import SideBar from "../../components/SideBar";


const Test = () => {
    async function callPush() {
        const modal = new web3modal();
        const connection = await modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);

        const signer = provider.getSigner();
        const address = await signer.getAddress();

        console.log("Sending notification from Wallet address: ", address);

        const userAlice = await PushAPI.initialize(signer, {
            env: CONSTANTS.ENV.STAGING,
        });

        console.log("initialize")

        const stream = await userAlice.initStream([CONSTANTS.STREAM.NOTIF]);

        console.log("init")

        stream.on(CONSTANTS.STREAM.CONNECT, async () => {
            console.log("Stream Connected");

            await userAlice.channel.send(["*"], {
                notification: {
                    title: "GM",
                    body: "test test",
                },
            });

            console.log("sent");
        });

        // const signer = ethers.Wallet.createRandom();

        // const inboxNotifications = await userAlice.notification.list("INBOX");

        // const spamNotifications = await userAlice.notification.list("SPAM");

        // const pushChannelAddress = "0x48e6a467852Fa29710AaaCDB275F85db4Fa420eB";

        // await userAlice.notification.subscribe(
        //     `eip155:11155111:${pushChannelAddress}` // channel address in CAIP format
        // );

        // stream.on(CONSTANTS.STREAM.NOTIF, (data) => {
        //     console.log(data);
        // });
        // stream.connect();

        // const response = await userAlice.channel.send([signer.address], {
        //     notification: {
        //         title: "You awesome notification",
        //         body: "from your amazing protocol",
        //     },
        // });

        // const response = await userAlice.channel.create({
        //     name: "Test Channel",
        //     description: "Test Description",
        //     icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAz0lEQVR4AcXBsU0EQQyG0e+saWJ7oACiKYDMEZVs6GgSpC2BIhzRwAS0sgk9HKn3gpFOAv3v3V4/3+4U4Z1q5KTy42Ql940qvFONnFSGmCFmiN2+fj7uCBlihpgh1ngwcvKfwjuVIWaIGWKNB+GdauSk8uNkJfeNKryzYogZYoZY40m5b/wlQ8wQM8TayMlKeKcaOVkJ71QjJyuGmCFmiDUe+HFy4VyEd57hx0mV+0ZliBlihlgL71w4FyMnVXhnZeSkiu93qheuDDFDzBD7BcCyMAOfy204AAAAAElFTkSuQmCC",
        //     url: "https://push.org",
        //   });

        // console.log("res", response);
    }

    return (
        <div>
            <NavBar/>
                <SideBar/>
                <p>PUSH</p>
                <button onClick={callPush}>sendBtn</button>
        </div>
    );
};

export default Test;
