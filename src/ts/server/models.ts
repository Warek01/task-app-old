import { model, Schema } from "mongoose";

type SchemaMixedType = typeof Schema.Types.Mixed[];

const Mixed: SchemaMixedType = [Schema.Types.Mixed];

export const Users = model(
  "Users",
  new Schema({
    userName: {
      type: String,
      required: true,
      lowercase: true,
    },

    dateCreated: {
      type: Number,
      default: Date.now(),
    },

    colorIndex: {
      type: Number,
      default: 0,
    },

    backgroundColorIndex: {
      type: Number,
      default: 0,
    },

    tasks: [
      {
        content: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Mixed,
          required: true,
        },
        isImportant: {
          type: Boolean,
          required: true,
          default: false,
        },
      },
    ],
  }),
  "Users"
);

export const Tasks = model(
  "Tasks",
  new Schema({
    content: {
      type: String,
      required: true,
    },

    timestamp: {
      type: Mixed,
      required: true,
    },

    isImportant: {
      type: Boolean,
      required: true,
      default: false,
    }
  }),
  "Tasks"
);
