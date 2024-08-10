import { Button, Container, Heading, VStack } from "@chakra-ui/react";
import { useSocket } from "../hooks/useSocket";
import ReactPlayer from "react-player";
import peer from "../services/peer";
import { useCallback, useEffect, useState } from "react";

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
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState<string>("");
  const [myStream, setMyStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

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

    return () => {
      socket?.off("user:joined");
      socket?.off("incoming:call");
      socket?.off("call:accepted");
      socket?.off("peer:nego:needed");
      socket?.off("peer:nego:final");
    };
  }, [
    socket,
    handleUserJoin,
    handleIncomingCall,
    handleCallAccepted,
    handleIncomingNego,
    handleNegoFinal,
  ]);
  return (
    <Container>
      <Heading textAlign="center" width="100vw">
        Room Page
      </Heading>
      {remoteSocketId ? (
        <VStack>
          <Heading fontSize="xl">User Joined {remoteSocketId}</Heading>
          <Button onClick={handleCallUser} colorScheme="teal">
            Call
          </Button>
        </VStack>
      ) : (
        <Heading fontSize="xl">No User has Joined</Heading>
      )}
      {/* use grid to make mobile responsive */}
      {myStream && (
        <VStack>
          <Heading>My Stream</Heading>
          <Button variant="ghost" colorScheme="teal" onClick={sendStreams}>
            Send Stream
          </Button>
          <ReactPlayer playing muted height={100} width={300} url={myStream} />
        </VStack>
      )}
      {remoteStream && (
        <VStack>
          <Heading>Remote Stream</Heading>
          <ReactPlayer
            playing
            muted
            height={100}
            width={300}
            url={remoteStream}
          />
        </VStack>
      )}
    </Container>
  );
};

export default Room;
