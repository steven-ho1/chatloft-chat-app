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
import { useEffect, useRef, useState } from "react";
import { Message, MessageInput } from "../../../common/message";
import { useLoft } from "../hooks/loft";
import { useSocket } from "../hooks/socket";

// Height in pixels where the user is still considered at the bottom
const AUTO_SCROLL_THRESHOLD = 300;

const LoftWindow = () => {
    const socket = useSocket();
    const { activeLoft } = useLoft();
    const [messageText, setMessageText] = useState<string>("");
    const [messages, setMessages] = useState<Message[]>([]);
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

    const sendMessage = () => {
        const messageInput: MessageInput = {
            loftId: activeLoft?.id as string,
            content: { text: messageText.trim(), imageUrl: null },
        };
        socket.emit("sendMessage", messageInput);
        setMessageText("");
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Enter") {
            sendMessage();
        }
    };

    useEffect(() => {
        socket.on("newMessage", (message: Message) => {
            setMessages((prevMessages: Message[]) => [
                ...prevMessages,
                message,
            ]);
        });

        socket.on("loftMessagesFetched", (messages: Message[]) => {
            setAreMessagesFetched(true);
            setMessages(messages);
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
    }, [messages]);

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
                    <IconButton color="inherit">
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
                {messages.map((message: Message) => (
                    <ListItem key={message.id}>
                        <ListItemAvatar>
                            <Avatar src={message.sender.profilePicUrl} />
                        </ListItemAvatar>
                        <ListItemText
                            primary={
                                <>
                                    {message.sender.fullName}
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
                                <Typography variant="body2">
                                    {message.content.text}
                                </Typography>
                            }
                        />
                    </ListItem>
                ))}
                <div ref={chatEndRef} />
            </List>
            <Divider flexItem />
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    padding: 2,
                }}
            >
                <TextField
                    variant="filled"
                    fullWidth
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={handleKeyPress}
                />
                <IconButton onClick={sendMessage} color="primary">
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
