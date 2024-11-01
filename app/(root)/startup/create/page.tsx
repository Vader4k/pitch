import { auth } from "@/auth";
import StartupForm from "@/components/StartupForm";
import { redirect } from "next/navigation";

const CreatePost: React.FC = async () => {
  const session = await auth();
  if (!session) redirect("/");

  return (
    <>
      <section className="pink_container min-h-[230px]">
        <h1 className="heading">Submit your startup </h1>
      </section>
      <StartupForm />
    </>
  );
};

export default CreatePost;