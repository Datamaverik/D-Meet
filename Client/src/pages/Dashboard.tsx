import { Flex } from "@chakra-ui/react";
import Lobby from "./Lobby";

const Dashboard = () => {
  return (
    <Flex justifyContent="center" width="100vw" textAlign="center">
      <Lobby />
    </Flex>
  );
};

export default Dashboard;
