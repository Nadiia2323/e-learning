import { ObjectId } from "mongodb";

const speakingSchema = {
    songId: {
        type: ObjectId, // Reference to the song this task is related to
    },
    taskDescription: {
        type: String, // A description of the speaking task
    },
    difficultyLevel: {
        type: String, // Could be 'Beginner', 'Intermediate', 'Advanced', etc.
    },
    duration: {
        type: Number, // Estimated time to complete the task, in minutes
    },
    keywords: {
        type: [String], // Keywords or main concepts involved in the task
    },
    exampleResponse: {
        type: String, // An example of a good response for reference
    },
    additionalResources: {
        type: [String], // URLs or references to additional materials
    },
    questions: {
        type: [String]
    }
    
   
};

export default speakingSchema;
