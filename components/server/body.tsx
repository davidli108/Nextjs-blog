import { auth, clerkClient } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/server";
import Link from "next/link";
import Button from "../client/button";
import Card from "./Card";
import db from "@/utils/database";

async function get_blogs() {
  const query = {
    where: {
      published: true,
    },
  };

  return await Promise.all([db.post.findMany(query), db.post.count(query)]);
}

export default async function Body() {
  const session = auth();
  const [blogs, count] = await get_blogs();

  return (
    <div className="flex h-max flex-col items-center justify-center bg-slate-800 pb-5">
      {session?.userId && (
        <div className="m-8">
          <Link href="/blog/">
            <Button text="Create Blog" />
          </Link>
        </div>
      )}

      <div className="flex flex-col justify-center md:flex-row md:flex-wrap md:justify-start">
        {blogs?.map(async (post, index) => {
          const author = await clerkClient.users.getUser(post.user_id);

          return (
            <Card
              key={index}
              title={post.title}
              author={author?.username}
              link={`/blog/${post.id}`}
            />
          );
        })}
      </div>
    </div>
  );
}
