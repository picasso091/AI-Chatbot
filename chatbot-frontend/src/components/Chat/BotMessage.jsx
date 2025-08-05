import { Alert, Avatar, Stack, Text, Card, Flex, Table, Box, Badge, List } from "@mantine/core";

import { timeSince } from "../../utils/timeSince";

const BotMessage = ({ message }) => {
  const formatMessageOutput = () => {
    let content = "";
    switch (message.type) {
      case "EMPLOYEE_INFO":
        content = message.content.data.map((el) => (
          <Card mb={12} shadow="md" key={el._id}>
            <Text>Name: {el.fullName}</Text>
            <Text>Dept: {el.department}</Text>
            <Text>Designation: {el.designation}</Text>
            <Text>Phone: {el.mobileNumber || el.phoneNumber}</Text>
            <Text>
              Email: <a href={`mailto:${el.email}`}>{el.email}</a>
            </Text>
          </Card>
        ));
        break;
      case "WORK_FROM_HOME":
        const wfhRows = message.content.data.map((el) => (
          <Table.Tr key={el.fullName}>
            <Table.Td>{el.fullName}</Table.Td>
            <Table.Td>{el.department}</Table.Td>
            <Table.Td>{el.country}</Table.Td>
          </Table.Tr>
        ));
        content = (
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Name</Table.Th>
                <Table.Th>Dept</Table.Th>
                <Table.Th>Country</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{wfhRows}</Table.Tbody>
          </Table>
        );
        break;
      case "LEAVE":
        const leaveRows = message.content.data.map((el) => (
          <Table.Tr key={el.fullName}>
            <Table.Td>{el.fullName}</Table.Td>
            <Table.Td>{el.department}</Table.Td>
            <Table.Td>{el.country}</Table.Td>
            <Table.Td>{el.reportingDate}</Table.Td>
          </Table.Tr>
        ));
        content = (
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Name</Table.Th>
                <Table.Th>Dept</Table.Th>
                <Table.Th>Country</Table.Th>
                <Table.Th>Reporting Date</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{leaveRows}</Table.Tbody>
          </Table>
        );
        break;
      case "PUBLIC_HOLIDAYS":
        const publicHolidayRows = message.content.data.map((el) => (
          <Table.Tr key={`${el.description}-${el.date}`}>
            <Table.Td>{el.description}</Table.Td>
            <Table.Td>{el.date}</Table.Td>
            <Table.Td>{el.day}</Table.Td>
            <Table.Td>{el.country}</Table.Td>
          </Table.Tr>
        ));
        content = (
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Name</Table.Th>
                <Table.Th>Date</Table.Th>
                <Table.Th>Day</Table.Th>
                <Table.Th>Country</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{publicHolidayRows}</Table.Tbody>
          </Table>
        );
        break;
      case "MEETING_ROOM_INFO":
        content = Object.keys(message.content.data).map((roomName) => {
          const roomData = message.content.data[roomName];
          let rowData = roomData.map((meetingInfo, index) => {
            return (
              <Table.Tr key={`${meetingInfo.start}-${index}`}>
                <Table.Td>{meetingInfo.organizer}</Table.Td>
                <Table.Td>{new Date(meetingInfo.start).toLocaleDateString()}</Table.Td>
                <Table.Td>{`${new Date(meetingInfo.start).toLocaleTimeString([], { timeStyle: "short" })} - ${new Date(
                  meetingInfo.end
                ).toLocaleTimeString([], { timeStyle: "short" })}`}</Table.Td>
                <Table.Td>
                  {meetingInfo.tag === "Current Event" ? (
                    <Text size="sm" c="secondary" fw={500}>
                      Ongoing
                    </Text>
                  ) : meetingInfo.tag === "Upcoming Event" ? (
                    <Text size="sm">Upcoming</Text>
                  ) : meetingInfo.tag === "Previous Event" ? (
                    <Text size="sm" c="dimmed">
                      Previous
                    </Text>
                  ) : (
                    <Text></Text>
                  )}
                </Table.Td>
              </Table.Tr>
            );
          });
          let roomTableData = (
            <Box key={roomName}>
              <Text fw={500} c="secondary">
                {roomName}
              </Text>
              <Table withTableBorder withColumnBorders mb={20}>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Date</Table.Th>
                    <Table.Th>Time</Table.Th>
                    <Table.Th>Status</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rowData}</Table.Tbody>
              </Table>
            </Box>
          );
          return roomTableData;
        });
        break;
      case "LEAVE_BALANCE":
        const leaveBalanceRows = message.content.data.map((el) => (
          <Table.Tr key={el.leaveType}>
            <Table.Td>{el.leaveType}</Table.Td>
            <Table.Td>{el.totalBalance}</Table.Td>
            <Table.Td>{el.usedBalance}</Table.Td>
            <Table.Td>{el.remainingBalance}</Table.Td>
          </Table.Tr>
        ));
        content = (
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Type</Table.Th>
                <Table.Th>Total</Table.Th>
                <Table.Th>Used</Table.Th>
                <Table.Th>Remaining</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{leaveBalanceRows}</Table.Tbody>
          </Table>
        );
        break;
      case "MY_FLOATING_HOLIDAYS":
        const myHolidayRows = message.content.data.map((el) => (
          <Table.Tr key={`${el.description}-${el.date}`}>
            <Table.Td>{el.description}</Table.Td>
            <Table.Td>{el.date}</Table.Td>
            <Table.Td>{el.day}</Table.Td>
            <Table.Td>{el.status}</Table.Td>
          </Table.Tr>
        ));
        content = (
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Name</Table.Th>
                <Table.Th>Date</Table.Th>
                <Table.Th>Day</Table.Th>
                <Table.Th>Status</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{myHolidayRows}</Table.Tbody>
          </Table>
        );
        break;
      case "MY_LEAVE_INFO":
        const myLeaveInfoRows = message.content.data.map((el) => (
          <Table.Tr key={`${el.appliedOn}-${el.duration}`}>
            <Table.Td>{el.leaveType}</Table.Td>
            <Table.Td>{el.appliedOn}</Table.Td>
            <Table.Td>{el.duration}</Table.Td>
            <Table.Td>{el.days}</Table.Td>
            <Table.Td>{el.status}</Table.Td>
          </Table.Tr>
        ));
        content = (
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Type</Table.Th>
                <Table.Th>Applied On</Table.Th>
                <Table.Th>Duration</Table.Th>
                <Table.Th>Days</Table.Th>
                <Table.Th>Status</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{myLeaveInfoRows}</Table.Tbody>
          </Table>
        );
        break;
      case "MY_INFO":
        const myInfo = message.content.data;
        content = (
          <Card mb={12} shadow="md" key={myInfo._id}>
            <Text>Name: {myInfo.fullName}</Text>
            <Text>Username: {myInfo.userName}</Text>
            <Text>Dept: {myInfo.department}</Text>
            <Text>Designation: {myInfo.designation}</Text>
            <Text>Supervisor: {myInfo.supervisor}</Text>
            <Text>Country: {myInfo.country}</Text>
            <Text>Address: {myInfo.address}</Text>
            <Text>Joined date: {myInfo.dateOfJoin}</Text>
            <Text>Phone: {myInfo.phoneNumber || myInfo.mobileNumber}</Text>
            <Text>Email: {myInfo.email}</Text>
          </Card>
        );
        break;
      case "NEW_SR":
        const newSRInfo = message.content.data;
        content = (
          <Card mb={12} shadow="md" key={newSRInfo._id} maw={500}>
            <Text>Title: {newSRInfo.title}</Text>
            <Box>Type: {<Badge radius="sm">{newSRInfo.type}</Badge>}</Box>
            <Box>
              Internal:{" "}
              {newSRInfo.internal ? (
                <Badge color="secondary" radius="sm">
                  True
                </Badge>
              ) : (
                <Badge color="pink" radius="sm">
                  False
                </Badge>
              )}
            </Box>
            <Text>Description: {newSRInfo.description}</Text>
            <Text>Created by: {newSRInfo.createdBy}</Text>
          </Card>
        );
        break;
      case "EMPLOYEE_BIRTHDAYS":
        const employeeBirthdays = message.content.data.map((el) => (
          <Table.Tr key={`${el.fullName}-${el.department}`}>
            <Table.Td>{el.fullName}</Table.Td>
            <Table.Td>{el.date}</Table.Td>
            <Table.Td>{el.department}</Table.Td>
          </Table.Tr>
        ));
        content = (
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Name</Table.Th>
                <Table.Th>Date</Table.Th>
                <Table.Th>Department</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{employeeBirthdays}</Table.Tbody>
          </Table>
        );
        break;
      case "SIMILAR_EMP_NAMES":
        const similarUsers = message.content.data.map((el) => <List.Item key={el._id}>{el.fullName}</List.Item>);
        content = <List>{similarUsers}</List>;
        break;
    }
    return content;
  };

  return (
    <Flex justify="left" align="flex-end" wrap="nowrap">
      <Stack p={0} spacing={2} gap={4} sx={{ maxWidth: "80%" }} align="flex-end">
        <Flex justify="left" align="flex-end" gap="xs">
          <Avatar src={"/bot.jpg"} radius="xl" />

          <Stack p={0} spacing={0} m={0}>
            <Flex justify="left" gap={3} align="center" wrap="nowrap">
              <Alert color="secondary" radius="lg" py={8} variant="light" style={{ borderBottomLeftRadius: 0 }}>
                <Text mb={8}>{message.message}</Text>
                {formatMessageOutput()}
              </Alert>
            </Flex>
          </Stack>
        </Flex>
        {
          <Text size="xs" align="left" c="dimmed">
            {timeSince(new Date(message.createdAt))}
          </Text>
        }
      </Stack>
    </Flex>
  );
};

export default BotMessage;
