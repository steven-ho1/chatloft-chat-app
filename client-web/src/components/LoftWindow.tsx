/* eslint-disable react-hooks/exhaustive-deps */
import { Send } from "@mui/icons-material";
import InfoIcon from "@mui/icons-material/Info";
import {
    AppBar,
    Avatar,
    Box,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    TextField,
    Toolbar,
    Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { Message, MessageGroup, MessageInput } from "../../../common/message";
import { useLoft } from "../hooks/loft";
import { useSocket } from "../hooks/socket";
import { LIMITS } from "../types/limits";

// Height in pixels where the user is still considered at the bottom
const AUTO_SCROLL_THRESHOLD = 300;

const LoftWindow = () => {
    const socket = useSocket();
    const { activeLoft } = useLoft();
    const [messageText, setMessageText] = useState<string>("");
    const [messageGroups, setMessageGroups] = useState<MessageGroup[]>([]);
    const [areMessagesFetched, setAreMessagesFetched] =
        useState<boolean>(false);

    const chatContainerRef = useRef<HTMLUListElement | null>(null);
    const chatEndRef = useRef<HTMLDivElement | null>(null);

    const isUserAtBottom = () => {
        const chatContainer = chatContainerRef.current;
        if (chatContainer) {
            return (
                chatContainer.scrollHeight -
                    chatContainer.scrollTop -
                    chatContainer.clientHeight <=
                AUTO_SCROLL_THRESHOLD
            );
        }
        return false;
    };

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            if (messageText.trim()) {
                sendMessage(event);
            }
        }
    };

    const sendMessage = (event: React.FormEvent) => {
        event.preventDefault();
        const messageInput: MessageInput = {
            loftId: activeLoft?.id as string,
            content: { text: messageText.trim(), imageUrl: null },
        };
        socket.emit("sendMessage", messageInput);
        setMessageText("");
    };

    useEffect(() => {
        socket.on("newMessage", (message: Message) => {
            setMessageGroups((prevMessageGroups: MessageGroup[]) => {
                const allButLast = prevMessageGroups.slice(0, -1);
                const last = prevMessageGroups[prevMessageGroups.length - 1];
                const updatedLastGroup = {
                    ...last,
                    messages: [...last.messages, message],
                };

                return [...allButLast, updatedLastGroup];
            });
        });

        socket.on("loftMessagesFetched", (messageGroups: MessageGroup[]) => {
            setAreMessagesFetched(true);
            setMessageGroups(messageGroups);
        });

        return () => {
            socket.off("newMessage");
            socket.off("loftMessagesFetched");
        };
    }, []);

    useEffect(() => {
        if (activeLoft?.id) {
            socket.emit("enterLoft", { loftId: activeLoft.id });
        }
    }, [activeLoft]);

    useEffect(() => {
        if (areMessagesFetched) {
            scrollToBottom();
            setAreMessagesFetched(false);
        }

        if (isUserAtBottom()) {
            scrollToBottom();
        }
    }, [messageGroups]);

    return activeLoft ? (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <AppBar position="static">
                <Toolbar>
                    <Avatar
                        alt="Profile pic"
                        src={activeLoft.profilePicUrl!}
                        sx={{ border: "1px solid #424242", mr: 1 }}
                    />
                    <Typography sx={{ flex: 1 }}>{activeLoft.name}</Typography>
                    <IconButton
                        color="inherit"
                        onClick={() => alert("Not implemented yet")}
                    >
                        <InfoIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <List
                ref={chatContainerRef}
                sx={{
                    flex: 1,
                    overflowY: "auto",
                    padding: 2,
                }}
            >
                {messageGroups.map(
                    (messageGroup: MessageGroup) =>
                        messageGroup.messages.length > 0 && (
                            <React.Fragment key={messageGroup.date}>
                                <Divider>
                                    <Typography
                                        variant="caption"
                                        color="textSecondary"
                                    >
                                        {messageGroup.date}
                                    </Typography>
                                </Divider>
                                {messageGroup.messages.map(
                                    (message: Message) => (
                                        <ListItem key={message.id}>
                                            <ListItemAvatar>
                                                <Avatar
                                                    src={
                                                        message.sender
                                                            .profilePicUrl
                                                    }
                                                />
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={
                                                    <>
                                                        {
                                                            message.sender
                                                                .fullName
                                                        }
                                                        <Typography
                                                            component="span"
                                                            variant="caption"
                                                            color="textSecondary"
                                                            sx={{ ml: 1 }}
                                                        >
                                                            {message.timestamp}
                                                        </Typography>
                                                    </>
                                                }
                                                secondary={
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            "word-wrap":
                                                                "break-word",
                                                        }}
                                                    >
                                                        {message.content.text}
                                                    </Typography>
                                                }
                                            />
                                        </ListItem>
                                    )
                                )}
                            </React.Fragment>
                        )
                )}
                <div ref={chatEndRef} />
            </List>
            <Divider flexItem />
            <Box
                component={"form"}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    padding: 2,
                }}
                onSubmit={sendMessage}
            >
                <TextField
                    variant="filled"
                    fullWidth
                    placeholder="Type a message..."
                    value={messageText}
                    multiline
                    maxRows={4}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    slotProps={{
                        input: {
                            inputProps: {
                                maxLength: LIMITS.MESSAGE_CONTENT_LENGTH,
                            },
                        },
                    }}
                    autoFocus
                />
                <IconButton
                    onClick={sendMessage}
                    color="primary"
                    type="submit"
                    disabled={!messageText.trim()}
                >
                    <Send />
                </IconButton>
            </Box>
        </Box>
    ) : (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
            }}
        >
            <Typography>Select a loft</Typography>
        </Box>
    );
};

export default LoftWindow;
