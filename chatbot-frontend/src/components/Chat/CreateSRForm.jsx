import { Box, Card, Flex, TextInput, Button, Text, Textarea, Checkbox, Select } from "@mantine/core";
import { useState } from "react";

const SR_TYPES = ["Bug", "Task", "Feature Request", "Monitoring", "Support SR"];

const CreateSRForm = ({ createSRFormSubmitHandler }) => {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [internal, setInternal] = useState(false);
  const [createSRLoading, setCreateSRLoading] = useState(false);

  const formSubmitHandler = async (e) => {
    setCreateSRLoading(true);
    e.preventDefault();
    if (title && type && description) {
      await createSRFormSubmitHandler({
        title,
        type,
        description,
        internal,
      });
      setCreateSRLoading(false);
    }
  };

  return (
    <Box>
      <Card withBorder shadow="md" miw={450}>
        <form onSubmit={formSubmitHandler}>
          <Flex direction="column">
            <Text mb={10} fw={500} size="sm">
              Enter the SR details
            </Text>
            <TextInput
              placeholder="SR title"
              mb={12}
              size="xs"
              value={title}
              onChange={(e) => setTitle(e.currentTarget.value)}
            />
            <Select
              placeholder="SR type"
              mb={12}
              size="xs"
              value={type}
              data={SR_TYPES}
              onChange={(value) => setType(value)}
            />

            <Checkbox
              label="Internal"
              mb={12}
              size="xs"
              value={internal}
              onChange={(e) => setInternal(e.currentTarget.checked)}
            />

            <Textarea
              placeholder="Description"
              mb={12}
              size="xs"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.currentTarget.value)}
            />
            <Button
              type="submit"
              loading={createSRLoading}
              size="xs"
              variant="outline"
              style={{ alignSelf: "start" }}
              disabled={!title || !type || !description}
            >
              Create
            </Button>
          </Flex>
        </form>
      </Card>
    </Box>
  );
};

export default CreateSRForm;
