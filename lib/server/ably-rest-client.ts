import "server-only";
import * as Ably from "ably/promises";

if (!process.env.ABLY_API_KEY) {
  throw new Error(
    `Missing ABLY_API_KEY environment variable.
    If you're running locally, please ensure you have a ./.env file with a value for ABLY_API_KEY=your-key.
    If you're running in Netlify, make sure you've configured env variable ABLY_API_KEY. 
    Please see README.md for more details on configuring your Ably API Key.`
  );
}

export const ablyRestClient = new Ably.Rest(process.env.ABLY_API_KEY);

export const notifyRoomDetailUpdate = async (roomID: string, data: any) => {
  await ablyRestClient.channels
    .get(`planeBoomer:room:${roomID}`)
    .publish("updateRoomInfo", data);
};
