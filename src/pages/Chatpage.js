import React, { useEffect, useState } from 'react'

export default function Chatpage() {
    const [chats, setChats] = useState([]);
    const fetchChats = async () => {
        const data = await fetch('http://localhost:5000/api/chats', {
            method: "GET",
        })
        const json = await data.json();
        setChats(json);
        console.log(json);
    }
    useEffect(() => {
        fetchChats();
        console.log("Hello");
    }, []);
    return (
        <div>
            {chats.map((chat) =>
                <div key={chat._id}>{chat.chatName}</div>
            )}
        </div>
    )
}
