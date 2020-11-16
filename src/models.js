"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tasks = exports.Users = void 0;
const mongoose_1 = require("mongoose");
const Mixed = [mongoose_1.Schema.Types.Mixed];
exports.Users = mongoose_1.model("Users", new mongoose_1.Schema({
    userName: {
        type: String,
        required: true,
        lowercase: true
    },
    dateCreated: {
        type: Number,
        default: Date.now()
    },
    tasks: [{
            content: {
                type: String,
                required: true
            },
            timestamp: {
                type: Mixed,
                required: true
            },
            isImportant: {
                type: Boolean,
                required: true,
                default: false
            }
        }]
}), "Users");
exports.Tasks = mongoose_1.model("Tasks", new mongoose_1.Schema({
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: Mixed,
        required: true
    },
    isImportant: {
        type: Boolean,
        required: true,
        default: false
    }
}), "Tasks");
