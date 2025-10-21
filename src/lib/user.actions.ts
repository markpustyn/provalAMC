"use server"
import { signIn, signOut } from "./auth"
// import { usersTable } from "./schema/schema"
import { LoginSchema } from "./schema/login_schema"
import { eq } from "drizzle-orm"
import bcryptjs from "bcryptjs"

import { revalidatePath } from "next/cache"
import { users } from "@/db/schema"
import { AuthCredentials } from "types"
import  {db}  from "@/db/drizzle"
import { headers } from "next/headers"
import ratelimit from "./ratelimit"
import { redirect } from "next/navigation"
import { Resend } from "resend"
import Email from "@/app/emails/new-vendorEmail"
import ClientEmail from "@/app/emails/new-clientEmail"


export async function login({
  email,
  password,
}: {
  email: string
  password: string
}) {

  // const ip = (await headers()).get('x-forwarded-for') || "127.0.0.1"
  // const {success} = await ratelimit.limit(ip)
  // if(!success) {
  //   redirect('/too-many')
  // }

  try {
    LoginSchema.parse({
      email,
      password,
    })
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    })

    return {
      success: true,
      data: res,
    }
  } catch (error: any) {
    return {
      success: false,
      message: "Email or password is incorrect.",
    }
  }
}

export async function register(params: AuthCredentials) {
  const {
    fname,
    lname,
    email,
    phone,
    password,
    companyName,
    licenseNum,
    street,
    city,
    state,
    zip,
    role
  } = params;
    
  const existedUser = await db.select().from(users).where(eq(users.email, email)).limit(1)

  // const ip = (await headers()).get('x-forwarded-for') || "127.0.0.1"
  // const {success} = await ratelimit.limit(ip)
  // if(!success) {
  //   redirect('/too-many')
  // }

  if (existedUser.length > 0) {
    return {
      success: false,
      message: "User already exists.",
    }
  }

  const hash = await bcryptjs.hash(password, 10)
  const resend = new Resend(process.env.RESEND_TOKEN);


  try {
    await db
      .insert(users) 
      .values({
        fname,
        lname,
        email,
        phone,
        password: hash,
        companyName, 
        licenseNum,
        street,
        city,
        state,
        zip,
        role
      })
      const fullName = fname +  " " +  lname
      
      const subject = 'Welcome to Blue Grid Valuations';

      if(role == 'broker'){
        await resend.emails.send({
          from: "Blue Grid Valuations <noreply@app.bluegridvaluations.com>",
          to: email,
          subject: 'Welcome to Blue Grid Valuations',
          react: Email(),
        });
      } else if(role == 'client') {
          await resend.emails.send({
          from: "Blue Grid Valuations <noreply@app.bluegridvaluations.com>",
          to: email,
          subject: 'Welcome to Blue Grid Valuations',
          react: ClientEmail(),
        });
      }


      await login({email, password});

      return{success: true}

      

  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    }
  }
}

export async function logout() {
  try {
    await signOut({
      redirect: false,
    })
    return {
      success: true,
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    }
  }
}

export async function updateUser({ name, id }: { name: string; id: string }) {
  // PUT request to https://66b2046a1ca8ad33d4f62740.mockapi.io/api/v1/users/:id
  // with the name in the body
  // return the response

  const res = await fetch(
    `https://66b2046a1ca8ad33d4f62740.mockapi.io/api/v1/users/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    }
  )
  const data = res.json()

  revalidatePath("/")

  return data
}

export async function deleteUser(id: string) {
  // DELETE request to https://66b2046a1ca8ad33d4f62740.mockapi.io/api/v1/users/:id
  // return the response

  const res = await fetch(
    `https://66b2046a1ca8ad33d4f62740.mockapi.io/api/v1/users/${id}`,
    {
      method: "DELETE",
    }
  )
  const data = res.json()

  revalidatePath("/")

  return data
}