import { Suspense } from "react";
import { client } from "@/sanity/lib/client";
import {
  STARTUP_BY_ID_QUERY,
  PLAYLIST_BY_SLUG
} from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import markdownit from "markdown-it";
import { formatDate } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import View from "@/components/View";
import { groq } from "next-sanity";

const md = markdownit();
export const experimental_ppr = true;

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  const details = await client.fetch(STARTUP_BY_ID_QUERY, { id });
  if (!details) return notFound();

  const posts = await client.fetch(PLAYLIST_BY_SLUG, {slug : 'editors-pick'})
  console.log('this is playlist', posts)

  //store the mackdown content from the posts in a parsedcontent variable
  const parsedContent = md.render(details?.pitch || "");

  return (
    <>
      <section className="pink_container !min-h-[230px]">
        <p className="tag">{formatDate(details._createdAt)}</p>
        <h1 className="heading ">{details.title}</h1>
        <p className="sub-heading !max-w-5xl"></p>
      </section>

      <section className="section_container">
        <Image
          src={details.image}
          alt={details.title}
          width={1000}
          height={1000}
          className="w-full h-auto rounded-xl"
        />

        <div className="space-y-5 my-10 max-w-4xl mx-auto">
          <div className="flex-between gap-5">
            <Link
              href={`/user/${details.author._id}`}
              className="flex gap-2 items-center mb-3"
            >
              <Image
                src={details.author.image}
                alt={details.author.name}
                width={40}
                height={40}
                className="rounded-full size-11 drop-shadow-lg"
              />
              <div>
                <p className="text-20-medium">{details.author.name}</p>
                <p className="text-16-medium">{details.author.username}</p>
              </div>
            </Link>
            <p className="category-tag">{details.category}</p>
          </div>
          <h3 className="text-30-bold">Pitch Details</h3>
          {parsedContent ? (
            <article
              className="prose max-w-4xl font-sans break-all"
              dangerouslySetInnerHTML={{ __html: parsedContent }}
            />
          ) : (
            <p className="no-result">No details provided</p>
          )}
        </div>
        <hr className="divider" />
        {/* todo selection startup */}
        <Suspense fallback={<Skeleton className="view_skeleton" />}>
          <View id={id} />
        </Suspense>
      </section>
    </>
  );
};

export default page;
