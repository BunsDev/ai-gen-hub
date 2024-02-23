import React, {useEffect} from "react";
import { ethers } from "ethers";
import {getSigner} from "@/utils";
import { Client } from "@xmtp/xmtp-js";

const Messages = ({
    msgs
}) => {
    console.log('msgs', msgs)
    return(<div>
        {msgs.map(e=>(<div>
            {console.log('e', e)}
            <p>{e.senderAddress}: {e.content}</p>
            </div>))}

            asdasd
    </div>)
}

export default Messages