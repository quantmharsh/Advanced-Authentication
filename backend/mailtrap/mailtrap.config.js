import{ MailtrapClient } from"mailtrap";
import dotenv from "dotenv"
dotenv.config();

const TOKEN = process.env.MAILTRAP_TOKEN ;

export const mailTrapClient = new MailtrapClient({
  token: TOKEN,
});
console.log('Token setup done')
export const sender = {
  email: "mailtrap@demomailtrap.com",
  name: "Mailtrap Test",
};
