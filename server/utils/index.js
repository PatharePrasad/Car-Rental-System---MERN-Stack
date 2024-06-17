import { randomBytes } from "crypto";

export { default as sendEmail } from "./sendEmail.js";

export const randomString = async (length) => new Promise((resolve) => randomBytes(length, (_, buffer) => resolve(buffer.toString("hex"))));
