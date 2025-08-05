import { ActionIcon, Flex, Stack, TextInput } from "@mantine/core";
import { TbSend, TbMicrophone } from "react-icons/tb";
import { HiOutlineSpeakerWave } from "react-icons/hi2";

import BarLoader from "../common/BarLoader";

const MessageBox = ({
  micInputHandler,
  micStarted,
  displayText,
  setUserInput,
  messageValue,
  setMessageValue,
  botSpeaking,
}) => {
  const formSubmitHandler = (e) => {
    e.preventDefault();
    setUserInput(messageValue);
  };

  return (
    <Stack style={{ height: "8vh" }} justify="center" p={0}>
      <Flex justify="right" p="xs" align="center" gap={10}>
        <form style={{ flexGrow: 1 }} onSubmit={formSubmitHandler}>
          <Flex gap={20}>
            <TextInput
              value={messageValue}
              onChange={(event) => setMessageValue(event.currentTarget.value)}
              style={{ flexGrow: 1 }}
              placeholder={micStarted ? displayText : "Type something nice..."}
              autoComplete="off"
            />
            <ActionIcon
              type="submit"
              variant="hover"
              size="lg"
              disabled={!/\S/.test(messageValue) ? true : messageValue.length < 2 ? true : false}
            >
              <TbSend size={22} />
            </ActionIcon>
          </Flex>
        </form>
        {micStarted ? (
          <BarLoader />
        ) : (
          <ActionIcon size="lg" variant="filled" color="secondary" onClick={micInputHandler}>
            <TbMicrophone size={22} />
          </ActionIcon>
        )}
        <ActionIcon
          size="lg"
          variant="subtle"
          className={botSpeaking ? "beating-animation" : ""}
          color="primary"
          disabled={!botSpeaking}
        >
          <HiOutlineSpeakerWave size={22} />
        </ActionIcon>
      </Flex>
    </Stack>
  );
};

export default MessageBox;
