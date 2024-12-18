import SearchForm from "@/components/SearchForm";
import StartupCard, { StartupTypeCard } from "@/components/StartupCard";
// import { client } from "@/sanity/lib/client";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";
import { STARTUPS_QUERY } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";


const Home = async ({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) => {
  const query = (await searchParams).query;

  const params = {search: query || null}

  // const posts = await client.fetch(STARTUPS_QUERY); //this is used when you only revalidate every 60 seconds
  const {data: posts} = await sanityFetch({ query: STARTUPS_QUERY, params }); // this is used when you want ur data to be updated in real time

  if (!posts) return notFound();


  return (
    <>
      <section className="pink_container">
        <h1 className="heading">
          Pitch Your Startup, <br /> Connect With Entrepreneurs
        </h1>
        <p className="sub-heading !max-w-3xl">
          Submit Ideas, Vote on pitches, and Get Noticed in Virtual Competitions
        </p>
        <SearchForm query={query} />
      </section>
      <section className="section_container">
        <p className="text-30-semibold">
          {query ? `Search results for ${query}` : "All Startups"}
        </p>
        <ul className="mt-7 card_grid">
          {posts?.length > 0 ? (
            posts.map((post: StartupTypeCard) => (
              <StartupCard key={post?._id} post={post} />
            ))
          ) : (
            <p>No Startups found</p>
          )}
        </ul>
      </section>
      <SanityLive />
    </>
  );
};

export default Home;
