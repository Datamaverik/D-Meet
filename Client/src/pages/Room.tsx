import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Input,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useSocket } from "../hooks/useSocket";
import ReactPlayer from "react-player";
import peer from "../services/peer";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useLoggedInUser } from "../hooks/useLoggInUser";

export interface socketReturnObj {
  email: string;
  id: string;
}
interface incomingData {
  from: string;
  offer: RTCSessionDescriptionInit;
}
interface acceptedData {
  from: string;
  ans: RTCSessionDescriptionInit;
}
const Room = () => {
  console.log("re-rendered");
  const {currentUser} = useLoggedInUser();
  const socket = useSocket();
  const { roomId } = useParams();
  const [remoteSocketId, setRemoteSocketId] = useState<string>("");
  const [myStream, setMyStream] = useState<MediaStream | null>(null);
  const [chatBox, setChatBox] = useState<boolean>(false);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ from: string; message: string }[]>(
    []
  );

  const handleSendMessage = () => {
    if (message.trim()) {
      socket?.emit("chat:message", {
        room: roomId,
        message,
        from: currentUser?.email,
      });
      console.log(currentUser?.email);
      setMessage("");
    }
  };

  const handleIncomingMessage = useCallback(
    ({ message, from }: { message: string; from: string }) => {
      console.log(from);
      setChatBox(true);
      setMessages((prevMessages) => [...prevMessages, { from, message }]);
    },
    []
  );

  const handleUserJoin = useCallback(({ email, id }: socketReturnObj) => {
    console.log(email, id);
    //  who has joined my room
    setRemoteSocketId(id);
  }, []);

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const offer = await peer.getOffer();
    socket?.emit("user:call", { to: remoteSocketId, offer });
    setMyStream(stream);
  }, [remoteSocketId, socket]);

  const handleIncomingCall = useCallback(
    async ({ from, offer }: incomingData) => {
      //  from whom am i getting call
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
      console.log("incoming call", from, offer);
      const ans = await peer.getAnswer(offer);
      socket?.emit("call:accepted", { to: from, ans });
    },
    [socket]
  );

  const sendStreams = useCallback(() => {
    for (const track of myStream?.getTracks() ?? []) {
      //  sends my track to other user
      console.log(track);
      peer.getPeer?.addTrack(track, myStream!);
    }
  }, [myStream]);

  const handleCallAccepted = useCallback(
    ({ ans }: acceptedData) => {
      peer.setLocalDescription(ans);
      console.log("Call accepted");
      sendStreams();
    },
    [sendStreams]
  );

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket?.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  const handleIncomingNego = useCallback(
    async ({ from, offer }: incomingData) => {
      const ans = await peer.getAnswer(offer);
      socket?.emit("peer:nego:done", { to: from, ans });
    },
    [socket]
  );

  const handleNegoFinal = useCallback(async ({ ans }: acceptedData) => {
    await peer.setLocalDescription(ans);
  }, []);

  useEffect(() => {
    peer.getPeer?.addEventListener("negotiationneeded", handleNegoNeeded);

    return () => {
      peer.getPeer?.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  useEffect(() => {
    peer.getPeer?.addEventListener("track", async (ev: RTCTrackEvent) => {
      const remoteStreams = ev.streams;
      console.log("GOT TRACKS!!");
      console.log(remoteStreams[0]);
      console.log(myStream);
      setRemoteStream(remoteStreams[0]);
    });
  }, [myStream]);

  useEffect(() => {
    socket?.on("user:joined", handleUserJoin);
    socket?.on("incoming:call", handleIncomingCall);
    socket?.on("call:accepted", handleCallAccepted);
    socket?.on("peer:nego:needed", handleIncomingNego);
    socket?.on("peer:nego:final", handleNegoFinal);
    socket?.on("chat:message", handleIncomingMessage);

    return () => {
      socket?.off("user:joined");
      socket?.off("incoming:call");
      socket?.off("call:accepted");
      socket?.off("peer:nego:needed");
      socket?.off("peer:nego:final");
      socket?.off("chat:message");
    };
  }, [
    socket,
    handleUserJoin,
    handleIncomingCall,
    handleCallAccepted,
    handleIncomingNego,
    handleNegoFinal,
    handleIncomingMessage,
  ]);
  return (
    <GridItem area="main">
      <Heading textAlign="center" width="100vw" m={5}>
        Room Page
      </Heading>
      {remoteSocketId ? (
        <VStack>
          <Heading fontSize="xl" textAlign="center">
            User Joined {remoteSocketId}
          </Heading>
          <HStack>
            <Button onClick={handleCallUser} colorScheme="teal">
              Call
            </Button>
            <Button
              onClick={() => setChatBox(true)}
              colorScheme="teal"
              variant="ghost"
            >
              Chat
            </Button>
          </HStack>
        </VStack>
      ) : (
        <Heading fontSize="xl">No User has Joined</Heading>
      )}
      {/* use grid to make mobile responsive */}
      <Grid templateColumns="1fr 1fr" templateRows="1fr 1fr">
        {myStream && (
          <GridItem colSpan={1} rowSpan={1}>
            <VStack>
              <Heading>My Stream</Heading>
              <Button variant="ghost" colorScheme="teal" onClick={sendStreams}>
                Send Stream
              </Button>
              <ReactPlayer
                playing
                muted
                height="30vh"
                width="40vw"
                url={myStream}
              />
            </VStack>
          </GridItem>
        )}
        {chatBox && (
          <GridItem colSpan={1} rowSpan={2}>
            <VStack spacing={4} width="full" maxWidth="600px" margin="0">
              <Box
                mt={5}
                borderWidth={1}
                borderRadius="md"
                padding={4}
                width="full"
                height="full"
                maxHeight='75vh'
                overflowY="auto"
                bg="gray.700"
              >
                <Stack spacing={2}>
                  {messages.map((msg, index) => (
                    <Box
                      key={index}
                      padding={2}
                      borderRadius="md"
                      bg="blue.600"
                      alignSelf="flex-start"
                    > 
                      <Text color="white">{msg.from}</Text>
                      <Text>{msg.message}</Text>
                    </Box>
                  ))}
                </Stack>
              </Box>
              <Flex width="full">
                <Input
                focusBorderColor="gray.600"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  variant="outline"
                  flex="1"
                />
                <Button
                  onClick={handleSendMessage}
                  colorScheme="teal"
                  marginLeft={2}
                >
                  Send
                </Button>
              </Flex>
            </VStack>
          </GridItem>
        )}
        {remoteStream && (
          <GridItem colSpan={1} rowSpan={1}>
            <VStack>
              <Heading>Remote Stream</Heading>
              <ReactPlayer
                playing
                muted
                height="30vh"
                width="40vw"
                url={remoteStream}
              />
            </VStack>
          </GridItem>
        )}
      </Grid>
    </GridItem>
  );
};

export default Room;
