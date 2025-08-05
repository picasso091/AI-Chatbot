import { ActionIcon, Button, Group, ScrollArea, Container, Stack, Flex } from "@mantine/core";
import { useContext, useEffect, useRef, useState } from "react";
import { TbArrowNarrowUp, TbChevronDown } from "react-icons/tb";

import NavBar from "../layout/Navbar";
import MessageBox from "./MessageBox";
import UserMessage from "./UserMessage";
import BotMessage from "./BotMessage";
import { getTokenOrRefresh } from "../../utils/azure/azureToken";
import { errorNotification } from "../../utils/showNotification";
import axiosInstance from "../../utils/axiosInstance";
import { AuthContext } from "../../context/AuthContext";
const speechsdk = window.SpeechSDK;

const ChatRoom = () => {
  const [userMessages, setUserMessages] = useState(null);
  const [currentIntent, setCurrentIntent] = useState(null);
  const { userInfo } = useContext(AuthContext);
  const [userInput, setUserInput] = useState("");
  const [messageValue, setMessageValue] = useState("");
  const [micStarted, setMicStarted] = useState(false);
  const [botSpeaking, setBotSpeaking] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showMessagePageDiv, setShowMessagePageDiv] = useState(false);

  const dummy = useRef(null);

  // For adding a voice input text
  useEffect(() => {
    if (userInput && userMessages) {
      const sendRequest = async () => {
        try {
          const newUserMessages = [...userMessages];
          const newMessage = {
            message: userInput,
            fromBot: false,
            createdAt: Date.now(),
            user: userInfo._id,
            _id: Math.random(),
            type: "DEFAULT",
          };
          newUserMessages.push(newMessage);
          setUserMessages(newUserMessages);
          setMessageValue("");
          const response = await axiosInstance.post("/intent", { userInput });
          setUserMessages(response.data.userMessages);
          setCurrentIntent(response.data.intent);

          // For voice output
          const tokenObj = await getTokenOrRefresh();
          const player = new SpeechSDK.SpeakerAudioDestination();
          const audioConfig = SpeechSDK.AudioConfig.fromSpeakerOutput(player);
          const speechConfig = speechsdk.SpeechConfig.fromAuthorizationToken(tokenObj.authToken, tokenObj.region);
          setBotSpeaking(true);
          let synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig, audioConfig);
          synthesizer.speakTextAsync(
            response.data.message,
            function (result) {
              if (result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
              } else if (result.reason === SpeechSDK.ResultReason.Canceled) {
                throw result.errorDetails;
              }

              synthesizer.close();
              player.onAudioEnd = function () {
                setBotSpeaking(false);
              };
              synthesizer = undefined;
            },
            function (err) {
              setBotSpeaking(false);
              errorNotification({ message: "Error while playing audio" });
            }
          );
          setUserInput("");
          if (response.data.intent === "CreateSR") {
            setCurrentIntent(response.data.intent);
            const newUserMessages = [...userMessages];
            const newMessage = {
              message: userInput,
              type: "CREATE_NEW_SR",
              fromBot: false,
              createdAt: Date.now(),
              user: userInfo._id,
              _id: Math.random(),
            };
            newUserMessages.push(newMessage);
            setUserMessages(newUserMessages);
          }
          setMicStarted(false);
        } catch (err) {
          setUserInput("");
          setMicStarted(false);
        }
      };
      sendRequest();
    }
  }, [userInput]);

  // Scroll to bottom on new messages
  useEffect(() => {
    goBottom();
  }, [userInput]);

  // Scroll to bottom when messages load initially
  useEffect(() => {
    if (userMessages && !showMessagePageDiv) {
      goBottom();
      setTimeout(() => {
        setShowMessagePageDiv(true);
      }, 1000);
    }
  }, [userMessages]);

  // Fetch the messages history of user
  useEffect(() => {
    const fetchUserMessages = async () => {
      const response = await axiosInstance.get("/message", { params: { page: currentPage } });
      setUserMessages(response.data.userMessages);
      try {
      } catch (err) {
        const errorMessage = err.response?.data?.message || "Cannot fetch messages right now";
        errorNotification({ message: errorMessage });
      }
    };
    fetchUserMessages();
  }, []);

  const goBottom = () => {
    dummy.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle the user audio input
  async function micInputHandler() {
    try {
      const tokenObj = await getTokenOrRefresh();
      setMicStarted(true);
      setDisplayText("Speak into your microphone...");
      const speechConfig = speechsdk.SpeechConfig.fromAuthorizationToken(tokenObj.authToken, tokenObj.region);
      speechConfig.speechRecognitionLanguage = "en-US";

      const audioConfig = speechsdk.AudioConfig.fromDefaultMicrophoneInput();
      const recognizer = new speechsdk.SpeechRecognizer(speechConfig, audioConfig);

      recognizer.recognizeOnceAsync((result) => {
        if (result.reason === speechsdk.ResultReason.RecognizedSpeech) {
          setUserInput(result.text);
        } else {
          setMicStarted(false);
          setDisplayText("ERROR: Speech was cancelled or could not be recognized.");
        }
      });
    } catch (err) {
      errorNotification({ message: "Cannot process voice input right now" });
    }
  }

  const createSRFormSubmitHandler = async (srData) => {
    try {
      const response = await axiosInstance.post("/serviceRequest", srData);
      setUserMessages(response.data.userMessages);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "SR creation failed";
      errorNotification({ message: errorMessage });
    }
  };

  const loadMoreMessagesHandler = async () => {
    if (userMessages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      try {
        const response = await axiosInstance.get("/message", { params: { page: newPage } });
        const newUserMessages = [...response.data.userMessages, ...userMessages];
        setUserMessages(newUserMessages);
      } catch (err) {
        const errorMessage = err.response?.data?.message || "Cannot fetch older messages right now";
        errorNotification({ message: errorMessage });
      }
    }
  };

  return (
    <Container p={0}>
      <NavBar />
      <Stack style={{ height: "82vh" }} p={0}>
        <ScrollArea p="xs" scrollbarSize={2} style={{ height: "82vh" }}>
          <Stack mb={20}>
            <Group justify="center" pt="xs">
              <ActionIcon className="go-to-bottom-action-icon" color="green" radius="xl" onClick={goBottom}>
                <TbChevronDown size={22} />
              </ActionIcon>
            </Group>
            <Flex justify="center">
              <Button
                variant="light"
                size="xs"
                rightSection={<TbArrowNarrowUp size={16} />}
                onClick={loadMoreMessagesHandler}
              >
                Load More
              </Button>
            </Flex>
            {userMessages &&
              userMessages.map((message) =>
                message.fromBot ? (
                  <BotMessage key={message._id} message={message} />
                ) : (
                  <UserMessage
                    key={message._id}
                    message={message}
                    userInfo={userInfo}
                    createSRFormSubmitHandler={createSRFormSubmitHandler}
                  />
                )
              )}
          </Stack>
          <div ref={dummy}></div>
        </ScrollArea>
      </Stack>
      <MessageBox
        micInputHandler={micInputHandler}
        displayText={displayText}
        micStarted={micStarted}
        userInput={userInput}
        setUserInput={setUserInput}
        messageValue={messageValue}
        setMessageValue={setMessageValue}
        botSpeaking={botSpeaking}
      />
    </Container>
  );
};

export default ChatRoom;
