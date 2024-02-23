"use client";

import React from "react";
import { PushAPI, CONSTANTS } from "@pushprotocol/restapi";
import { ethers } from "ethers";
import web3modal from "web3modal";
import styled from "styled-components";
import NavBar from "@/components/NavBar";
import SideBar from "@/components/SideBar";

const Logout = () => {
    
    const logout = async () => {
        console.log("logout")
    }

    return (
        <div>
            <NavBar/>
                <SideBar/>
                <p>Logout</p><br/>
                <button onClick={logout}>Become Boring</button>
        </div>
    );
};

export default Logout;
