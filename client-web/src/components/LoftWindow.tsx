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
import { useEffect, useState } from "react";
import { Message } from "../../../common/message";
import { useLoft } from "../hooks/loft";
import { useSocket } from "../hooks/socket";
import { useUser } from "../hooks/user";

const LoftWindow = () => {
    const socket = useSocket();
    const { activeLoft } = useLoft();
    const [messageContent, setMessageContent] = useState("");
    const { user } = useUser();
    const [messages, setMessages] = useState<Message[]>([]);

    const sendMessage = () => {
        const message: Message = {
            loftId: activeLoft?.id as string,
            senderId: user!.id,
            content: messageContent.trim(),
            imageUrl: null,
        };
        socket.emit("sendMessage", message);
        setMessageContent("");
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
                sx={{
                    flex: 1,
                    overflowY: "auto",
                    padding: 2,
                }}
            >
                {messages.map((message: Message) => (
                    <ListItem key={message.id}>
                        <ListItemAvatar>
                            <Avatar />
                        </ListItemAvatar>
                        <ListItemText
                            primary={
                                <>
                                    Temporary name
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
                                    {message.content}
                                </Typography>
                            }
                        />
                    </ListItem>
                ))}
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
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
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
