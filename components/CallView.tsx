import React, { useEffect, useState } from 'react';
import {
  MeetingProvider,
  MeetingConsumer,
  useMeeting,
  useParticipant
} from '@videosdk.live/react-sdk';
import { Button } from '@chakra-ui/react';

enum JoinStatus {
  JOINING,
  JOINED
}

const CallView = ({
  meetingId,
  onMeetingLeave,
  beforeJoinCall
}: {
  meetingId: string;
  onMeetingLeave: () => void;
  beforeJoinCall: () => void;
}) => {
  const [joinState, setJoinState] = useState(JoinStatus.JOINING);
  const { join, participants } = useMeeting({
    //callback for when meeting is joined successfully
    onMeetingJoined: () => {
      setJoinState(JoinStatus.JOINING);
    },
    //callback for when meeting is left
    onMeetingLeft: () => {
      onMeetingLeave();
    }
  });

  const joinMeeting = () => {
    beforeJoinCall();
    setJoinState(JoinStatus.JOINING);
    join();
  };

  useEffect(() => {
    // being called two times
    participants && console.log(participants);
  }, [participants]);
  return (
    <div>
      CallView
      {/* {[...participants.keys()].map((participantId) => (
        <ParticipantView participantId={participantId} key={participantId} />
      ))} */}
      <Button onClick={joinMeeting}>Join</Button>
    </div>
  );
};

export default CallView;
