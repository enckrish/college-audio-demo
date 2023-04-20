import { useRouter } from 'next/router';
import React from 'react';

const MeetingRoom = () => {
  const router = useRouter();
  const { topic, room } = router.query;

  return <div>{`${topic}: :${room}`}</div>;
};

export default MeetingRoom;
