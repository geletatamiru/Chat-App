const { z } = require("zod");
const mongoose = require("mongoose");

const messageSchema = z.object({
  receiver: z
    .string()
    .length(24, { message: "Receiver ID must be 24 characters long" })
    .refine((value) => mongoose.Types.ObjectId.isValid(value), {
      message: "Invalid receiver ID",
    }),
  text: z
    .string()
    .min(1, { message: "Message cannot be empty" })
    .max(1000, { message: "Message cannot exceed 1000 characters" }),
});

module.exports = messageSchema;