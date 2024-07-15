import { useEffect, useRef, useState } from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
  Avatar,
} from "@chatscope/chat-ui-kit-react";
import * as XLSX from "xlsx";
import {
  Box,
  Modal,
  Button,
  LinearProgress,
  TextField,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useWindowSize } from "react-use";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});
import "../App.css";

function ChatBox() {
  const [typing, setTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [fileMessage, setFileMessage] = useState("");
  const [fileData, setFileData] = useState(null);
  const [fileName, setFileName] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadModal, setUploadModal] = useState(false);
  const [apiKeyModal, setApiKeyModal] = useState(false);
  const [apiKey, setApiKey] = useState("")
  const navigate = useNavigate();
  const { width } = useWindowSize();

  useEffect(() => {
    if(!localStorage.getItem("api_key")) {
      setApiKeyModal(true)
    }

  },[])

  // Function to handle sending chat data to the server
  const handleChats = async (data) => {
    await axios.post(
      `http://localhost:3000/api/chats/`,
      {
        ...data,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      }
    );
  };

  // Function to fetch all chat history
  const fetchAllChats = async (data) => {
    await axios
      .get(`http://localhost:3000/api/chats/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })
      .then((response) => {
        setMessages(response.data.slice(-25)); // Set the latest 25 messages
      });
  };

  // Function to handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setFileName(file.name); // Set the file name
    const reader = new FileReader();

    // Track upload progress
    reader.onprogress = (e) => {
      if (e.lengthComputable) {
        const progress = Math.round((e.loaded * 100) / e.total);
        setUploadProgress(progress);
      }
    };

    // Process the file after upload
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      setFileData(jsonData); // Set the file data
      setUploadProgress(100);
    };

    reader.readAsArrayBuffer(file);
  };

  // Function to handle sending file messages
  const handleFile = async (data) => {
    const newMessages = [
      ...messages,
      {
        message: data.message,
        sender: "user",
        direction: "outgoing",
        type: "file",
        fileName: data.fileName,
      },
    ];

    const chatData = {
      message: `${data.message.split(",")[0]} \n FILE: ${data.fileName}`,
      sender: "user",
      direction: "outgoing",
    };

    setMessages(newMessages);

    // Process message with ChatGPT and update chat
    await handleChats(chatData);
    await processMessage(newMessages);
  };

  // Function to handle sending text messages
  const handleSend = async (message) => {
    console.log({ message });
    const newMessages = [
      ...messages,
      {
        message: message.split("<br>")[0],
        sender: "user",
        direction: "outgoing",
        type: "text",
        fileName: null,
      },
    ];

    const chatData = {
      message: message.split("<br>")[0],
      sender: "user",
      direction: "outgoing",
    };

    setMessages(newMessages);

    // Process message with ChatGPT and update chat
    await handleChats(chatData);
    await processMessage(newMessages);
  };

  // Function to process messages with ChatGPT
  const processMessage = async (chatMessages) => {
    const apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }

      return {
        role,
        content: messageObject.message,
        direction: messageObject.direction,
      };
    });

    const systemMessage = {
      role: "system",
      content:
        "Explain all concepts like I am 10 years old. and format the answer and apart from that improve writing style",
    };

    const apiResponseBody = {
      model: "gpt-3.5-turbo",
      messages: [systemMessage, ...apiMessages],
    };

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("api_key")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiResponseBody),
    })
      .then((data) => {
        return data.json();
      })
      .then(async (data) => {
        const chatData = {
          message: data.choices[0].message.content,
          sender: "ChatGPT",
          direction: "incoming",
        };
        await handleChats(chatData);
        setMessages([...chatMessages, chatData]);
      })
      .finally(() => {
        setTyping(false);
        setUploadModal(false);
      });
  };

  // Fetch all chats on component mount
  useEffect(() => {
    fetchAllChats();
  }, []);

  return (
    <>
      <div className="chat-header">
        <div className="chat-bot">AI ChatBot</div>
        <div className="chat-action">
          <Button
            variant="outlined"
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
          >
            Logout
          </Button>
          <div className="user-name">
            {localStorage.getItem("userName").split("")[0]}
          </div>
        </div>
      </div>
      <MainContainer>
        <ChatContainer>
          <MessageList
            typingIndicator={
              typing ? <TypingIndicator content="ChatGPT is typing" /> : null
            }
          >
            {messages.map((message, index) => (
              <Message
                key={index}
                model={
                  message.type === "file"
                    ? {
                        message: `${message.message.split(",")[0]} \n FILE: ${
                          message.fileName
                        }`,
                        sender: "user",
                        direction: "outgoing",
                      }
                    : message
                }
                avatarPosition={message.sender === "user" ? "br" : "tl"}
              >
                <Avatar
                  size={width < 400 ? "sm" : "md"}
                  name="Zoe"
                  src="https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"
                  status="available"
                />
              </Message>
            ))}
          </MessageList>
          <MessageInput
            placeholder="type Message Here"
            onSend={handleSend}
            onAttachClick={() => {
              setUploadProgress(0);
              setFileName("");
              setUploadModal(true);
            }}
          />
        </ChatContainer>
      </MainContainer>
      <Modal
        className="upload-modal"
        keepMounted
        open={uploadModal}
        onClose={() => setUploadModal(false)}
      >
        <Box>
          <div className="header">Upload Files</div>
          <Divider className="divider" />
          {!fileName && (
            <p>Please Check on upload file button to upload files</p>
          )}
          {uploadProgress > 0 && uploadProgress < 100 && (
            <LinearProgress variant="determinate" value={uploadProgress} />
          )}
          {uploadProgress === 100 && (
            <div className="file-text">
              <div className="file-name">{fileName}</div>
              <div className="successfully-upload">
                File uploaded successfully
              </div>
            </div>
          )}

          {fileName ? (
            <>
              <TextField
                placeholder="type your message here"
                onChange={(event) => setFileMessage(event.target.value)}
              />
              <Button
                variant="contained"
                loading={loading}
                onClick={() => {
                  setLoading(true);
                  const data = {
                    message: `MESSAGE : ${fileMessage}, FILE DATA : ${JSON.stringify(
                      fileData
                    )}`,
                    fileName: fileName,
                  };
                  handleFile(data);
                }}
              >
                Send File
                <VisuallyHiddenInput type="file" />
              </Button>
            </>
          ) : (
            <Button
              component="label"
              role={undefined}
              variant="contained"
              startIcon={<CloudUploadIcon />}
            >
              Upload file
              <VisuallyHiddenInput type="file" onChange={handleFileUpload} />
            </Button>
          )}
        </Box>
      </Modal>
      <Modal
        className="upload-modal"
        keepMounted
        open={apiKeyModal}
      >
        <Box>
          <div className="header">CHATGPT API_KEY</div>
          <Divider className="divider" />

            <TextField
              placeholder="Enter you chat GPT api key here"
              onChange={(event) => setApiKey(event.target.value)}
            />
            <Button
              variant="contained"
              disabled={!apiKey}
              onClick={()=> {
                localStorage.setItem("api_key", apiKey)
                setApiKeyModal(false)
              }}
            >
              Set Key
            </Button>
        </Box>
      </Modal>
    </>
  );
}

export default ChatBox;

