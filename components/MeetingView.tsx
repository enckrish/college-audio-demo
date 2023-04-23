import { useMeeting } from '@videosdk.live/react-sdk';
import { useState } from 'react';
import ParticipantView from './ParticipantView';
import {
  Box,
  Button,
  Center,
  HStack,
  Spinner,
  Text,
  VStack
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import OwnView from './OwnView';

enum JoinState {
  IDLE,
  JOINING,
  JOINED
}

function MeetingView(props: any) {
  const router = useRouter();
  const [joined, setJoined] = useState<JoinState>(JoinState.IDLE);

  //Get the method which will be used to join the meeting.
  //We will also get the participants list to display all participants
  const { join, participants } = useMeeting({
    //callback for when meeting is joined successfully
    onMeetingJoined: () => {
      setJoined(JoinState.JOINED);
    },
    //callback for when meeting is left
    onMeetingLeft: () => {
      router.push('/home');
    }
  });
  const joinMeeting = () => {
    setJoined(JoinState.JOINING);
    join();
  };

  return (
    <Center h="100%">
      {joined == JoinState.JOINED ? (
        <VStack h="100%" p="2" justifyContent={'space-between'}>
          {Array.from(participants.keys()).length < 2 && (
            <Text fontSize={'xl'}>Waiting for other person...</Text>
          )}
          {/* For rendering all the participants in the meeting */}
          {Array.from(participants.keys())
            .slice(1)
            .map((participantId) => (
              <ParticipantView
                participantId={participantId}
                key={participantId}
              />
            ))}
          <OwnView participantId={Array.from(participants.keys())[0]} />
        </VStack>
      ) : joined && joined == JoinState.JOINING ? (
        <p>Joining the meeting...</p>
      ) : (
        <VStack>
          <Text fontSize={'xl'}>Ready to join?</Text>
          <Button onClick={joinMeeting} isDisabled={joined != JoinState.IDLE}>
            <HStack>
              <Text>{joined != JoinState.IDLE ? 'Joining' : 'Join'}</Text>
              {joined != JoinState.IDLE && <Spinner />}
            </HStack>
          </Button>
        </VStack>
      )}
    </Center>
  );
}

export default MeetingView;
