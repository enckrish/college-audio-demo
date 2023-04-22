import dynamic from 'next/dynamic';

const MeetingRoomComponent = dynamic(
  () => import('@/components/MeetingRoom') as any,
  {
    ssr: false
  }
);

export default MeetingRoomComponent;
// const DynamicImportMeetingRoom = () => {
//   return <div>DynamicImportMeetingRoom</div>;
// };

// export default DynamicImportMeetingRoom;
