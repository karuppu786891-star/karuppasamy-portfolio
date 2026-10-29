import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().email("Please enter a valid email").max(200),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(4000),
  // honeypot: real users never fill this
  website: z.string().max(0).optional(),
});
