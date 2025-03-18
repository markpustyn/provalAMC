import {Client as WorkflowClient} from "@upstash/workflow"
import { Client, resend } from "@upstash/qstash";

export const workflowClient = new WorkflowClient({
    baseUrl: process.env.QSTASH_URL!,
    token: process.env.QSTASH_TOKEN!
})

const client = new Client({ token: process.env.RESEND_TOKEN! });

export const sendEmail  = async({email, subject, message}: {email:string, subject:string, message: string}) =>{
    await client.publishJSON({
        api: {
          name: "email",
          provider: resend({ token: process.env.RESEND_TOKEN! }),
        },
        body: {
          from: "Evalua Cloud <info@evaluacloud.tech>",
          to: [email],
          subject: subject,
          html: message,
        },
      });
}


