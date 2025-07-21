import {StreamChat} from "stream-chat"
import "dotenv/config";

const apiKey= process.env.STREAM_API_KEY;
const apiSecret=process.env.STREAM_API_SECRET;

if(!apiKey ||!apiSecret) {
    console.error("Missing STREAM_API_KEY or STREAM_API_SECRET environment variables");
}

const streamClient = StreamChat.getInstance(apiKey,apiSecret);
export const upsertStreamUser=async(userData)=>{
    try {
        await streamClient.upsertUsers([userData]);
        return userData;


    } catch (error) {
        console.error("Failed to upsert user", error); 
    }
}

export const generateStreamToken=(userId)=>{
    try {
        // ensure user id is a string
        const userIdString=userId.toString();
        return streamClient.createToken(userIdString);
    } catch (error) {
        console.error("Failed to generate stream token", error);
    }
};
