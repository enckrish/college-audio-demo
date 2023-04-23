const CALL_RECEIVE_LISTENER_KEY = 'CALL_RECEIVE_LISTENER';

type TCallRecieveListener = {
  enabled: boolean;
};
export const getCallReceiveListener = () => {
  const res = localStorage.getItem(CALL_RECEIVE_LISTENER_KEY);
  if (res == null) return { enabled: false };

  const resJson: TCallRecieveListener = JSON.parse(res);
  return resJson;
};

export const setCallReceiveListener = (req: TCallRecieveListener) => {
  localStorage.setItem(CALL_RECEIVE_LISTENER_KEY, JSON.stringify(req));
};
