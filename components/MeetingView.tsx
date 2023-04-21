import { useMeeting } from '@videosdk.live/react-sdk';
import { useState } from 'react';
import ParticipantView from './ParticipantView';
import { Button, HStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';

enum JoinState {
  JOINING,
  JOINED
}

function Controls() {
  const { leave, toggleMic, toggleWebcam } = useMeeting();

  return (
    <HStack>
      <Button onClick={() => leave()}>Leave</Button>
      <Button onClick={() => toggleMic()}>toggleMic</Button>
      <Button onClick={() => toggleWebcam()}>toggleWebcam</Button>
    </HStack>
  );
}

function MeetingView(props: any) {
  const router = useRouter();
  const [joined, setJoined] = useState<JoinState>(JoinState.JOINING);

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
    <div className="container">
      <h3>Meeting Id: {props.meetingId}</h3>
      {joined == JoinState.JOINED ? (
        <div>
          <Controls />
          {/* For rendering all the participants in the meeting */}
          {Array.from(participants.keys()).map((participantId) => (
            <ParticipantView
              participantId={participantId}
              key={participantId}
            />
          ))}
        </div>
      ) : joined && joined == 'JOINING' ? (
        <p>Joining the meeting...</p>
      ) : (
        <Button onClick={joinMeeting}>Join</Button>
      )}
    </div>
  );
}

export default MeetingView;
