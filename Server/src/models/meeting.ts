import { InferSchemaType, Schema, model } from "mongoose";
import users from "./users";

const MeetingSchema = new Schema({
  id: { type: Number },
  meeting_title: { type: String, required: true, minLength: 3, maxLength: 255 },
  meeting_uid: { type: String },
  created_by: { type: String, ref: users },
});

type Meeting = InferSchemaType<typeof MeetingSchema>;
export default model<Meeting>("Meeting", MeetingSchema);
