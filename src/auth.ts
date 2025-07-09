import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "../prisma/generated/prisma";
import { emailOTP } from "better-auth/plugins"
import { sendOtpEmail } from "./lib/email";
 
const prisma = new PrismaClient();
 
export const auth = betterAuth({
  plugins: [
        emailOTP({ 
                async sendVerificationOTP({ email, otp, type}) { 
                  if(type === "email-verification") {
                    await sendOtpEmail({
                      to: email,
                      otp: otp
                    })
                  }
				}, 
        }) 
    ],
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string, 
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
    }
  },
  emailAndPassword: {    
        enabled: true
    } ,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
});