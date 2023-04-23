import { Box, Button, HStack } from '@chakra-ui/react';
import { useMeeting, useParticipant } from '@videosdk.live/react-sdk';
import React from 'react';
import {
  BsCameraVideo,
  BsCameraVideoOff,
  BsMic,
  BsMicMute,
  BsDoorOpen
} from 'react-icons/bs';

function Controls({
  onOffState
}: {
  onOffState: { audio: boolean; video: boolean };
}) {
  const { leave, toggleMic, toggleWebcam } = useMeeting();

  const getColorScheme = (isOn: boolean) => {
    return isOn ? 'gray' : 'red';
  };
  return (
    <HStack>
      <Button
        colorScheme={getColorScheme(onOffState.video)}
        onClick={() => toggleWebcam()}
      >
        {onOffState.audio ? <BsCameraVideo /> : <BsCameraVideoOff />}
      </Button>

      <Button
        colorScheme={getColorScheme(onOffState.audio)}
        onClick={() => toggleMic()}
      >
        {onOffState.audio ? <BsMic /> : <BsMicMute />}
      </Button>

      <Button colorScheme="red" onClick={() => leave()}>
        <BsDoorOpen />
      </Button>
    </HStack>
  );
}

const OwnView = ({ participantId }: { participantId: string }) => {
  const { webcamStream, micStream, webcamOn, micOn, isLocal, displayName } =
    useParticipant(participantId);
  return (
    <Box>
      <Controls onOffState={{ audio: micOn, video: webcamOn }} />
    </Box>
  );
};

export default OwnView;
