import SearchForm from "@/components/SearchForm";
import StartupCard from "@/components/StartupCard";

const Home = async ({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) => {
  const query = (await searchParams).query;

  const post = [
    {
      _createdAt: new Date(),
      views: 55,
      author: { authorId: 1 , name: 'Danny'},
      _id: 1,
      title: "All in one GPT-4",
      category: "AI",
      description: "This is my description",
      image:
        "https://img.freepik.com/free-photo/portrait-technologically-advanced-female-humanoid_23-2151666292.jpg?t=st=1730131018~exp=1730134618~hmac=28d9fb73bb0ffb59b6d76657fede6fef1c1ec7cf24f3bd307679c7ff698b35ee&w=1060",
    },
  ];

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
          {post?.length > 0 ? (
            post.map((post:StartupCardType) => (
              <StartupCard key={post?._id} post={post}/>
            ))
          ) : (<p>No Startups found</p>)}
        </ul>
      </section>
    </>
  );
};

export default Home;
