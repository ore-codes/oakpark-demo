export const Env = {
  ServerUrl: import.meta.env.VITE_SERVER_URL ?? 'http://localhost:3000',
  LiveKitUrl: import.meta.env.VITE_LIVEKIT_URL ?? 'ws://localhost:7880/',
};
