import { Alert, Stack, Text, Avatar, Flex } from "@mantine/core";

import { timeSince } from "../../utils/timeSince";
import CreateSRForm from "./CreateSRForm";

const UserMessage = ({ message, userInfo, createSRFormSubmitHandler }) => {
  return (
    <Flex justify="right" align="flex-end" wrap="nowrap">
      <Stack p={0} gap={4} spacing={2} sx={{ maxWidth: "80%" }} align="flex-end">
        <Flex justify="right" align="flex-end" gap="xs">
          <Stack p={0} spacing={0} m={0}>
            <Flex position="right" gap="sm" align="flex-start" wrap="nowrap">
              <div>
                {message.type === "CREATE_NEW_SR" ? (
                  <CreateSRForm createSRFormSubmitHandler={createSRFormSubmitHandler} />
                ) : (
                  <Alert color="primary" radius="lg" py={8} variant="light" style={{ borderBottomRightRadius: 0 }}>
                    {message.message}
                  </Alert>
                )}

                <Text size="xs" align="right" c="dimmed" mt={4}>
                  {timeSince(new Date(message.createdAt))}
                </Text>
              </div>

              <Avatar src={userInfo.profile} radius="xl" />
            </Flex>
          </Stack>
        </Flex>
      </Stack>
    </Flex>
  );
};

export default UserMessage;
