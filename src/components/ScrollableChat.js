import React from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { isLastMessage, isSameSender, isSameSenderMargin } from '../config/ChatLogics'
import { ChatState } from '../context/ChatProvider'
import { Avatar, Tooltip } from '@mui/material';

export default function ScrollableChat({ messages }) {
    const { user } = ChatState();
    return (
        <ScrollableFeed>
            {messages && messages.map((m, i) => (
                <div style={{ display: 'flex', marginRight: '1rem', marginLeft: '1rem' }} key={m._id}>
                    {
                        (isSameSender(messages, m, i, user._id) || isLastMessage(messages, i, user._id)) &&
                        (
                            <Tooltip title={m.sender.name} placement="bottom-start" arrow>
                                <Avatar sx={{ marginRight: 1, cursor: 'pointer', alignSelf: 'flex-end' }} src={m.sender.pic}>{m.sender.name[0]}</Avatar>
                            </Tooltip>
                        )
                    }
                    <span style={{ marginTop: '0.3rem', borderRadius: '10px', padding: "8px 15px", maxWidth: '75%', backgroundColor: m.sender._id === user._id ? '#BEE3F8' : '#B9F5D0', marginLeft: isSameSenderMargin(messages, m, i, user._id) }}>
                        {m.content}
                    </span>
                </div>
            ))}
        </ScrollableFeed>
    )
}
