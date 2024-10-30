import React from "react";
import Ping from "./Ping";
import { client } from "@/sanity/lib/client";
import { STARTUP_VIEWS_QUERY } from "@/sanity/lib/queries";
import { formatViews } from "@/lib/utils";
import { writeClient } from "@/sanity/lib/write-client";
import { unstable_after as after } from "next/server";

const View = async ({ id }: { id: string }) => {
  const totalviews = await client
    .withConfig({ useCdn: false })
    .fetch(STARTUP_VIEWS_QUERY, { id });

  // Convert totalviews to a string or number if it's an object
  const viewCount = totalviews.views;

  after(
    async () =>
      await writeClient
        .patch(id)
        .set({ views: viewCount + 1 })
        .commit()
  );

  return (
    <div className="view-container">
      <div className="absolute -top-2 -right-2">
        <Ping />
      </div>
      <p className="view-text">
        <span className="font-black">{formatViews(viewCount)}</span>
      </p>
    </div>
  );
};

export default View;
