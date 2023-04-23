import { Center, HStack, Text, VStack } from '@chakra-ui/react';
import { useParticipant } from '@videosdk.live/react-sdk';
import { useEffect, useMemo, useRef } from 'react';
import ReactPlayer from 'react-player';

function ParticipantView(props: any) {
  const micRef = useRef<any>(null);
  const { webcamStream, micStream, webcamOn, micOn, isLocal, displayName } =
    useParticipant(props.participantId);

  const videoStream = useMemo(() => {
    if (webcamOn && webcamStream) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(webcamStream.track);
      return mediaStream;
    }
  }, [webcamStream, webcamOn]);

  useEffect(() => {
    if (micRef.current) {
      if (micOn && micStream) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(micStream.track);

        micRef.current.srcObject = mediaStream;
        micRef.current
          .play()
          .catch((error: any) =>
            console.error('videoElem.current.play() failed', error)
          );
      } else {
        micRef.current.srcObject = null;
      }
    }
  }, [micStream, micOn]);

  return (
    <Center h="100%" w="300px" bgColor={'black'} rounded="xl">
      <VStack>
        <Text textColor={'white'}>
          Webcam: {webcamOn ? 'ON' : 'OFF'} | Mic: {micOn ? 'ON' : 'OFF'}
        </Text>
        <audio ref={micRef} autoPlay playsInline muted={isLocal} />
        {webcamOn && (
          <ReactPlayer
            //
            playsinline // very very imp prop
            pip={false}
            light={false}
            controls={false}
            muted={true}
            playing={true}
            //
            url={videoStream}
            //
            height={'300px'}
            width={'300px'}
            onError={(err: any) => {
              console.log(err, 'participant video error');
            }}
          />
        )}
      </VStack>
    </Center>
  );
}

export default ParticipantView;
