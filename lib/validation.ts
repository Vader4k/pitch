import { link } from "fs";
import { z } from "zod";

export const formSchema = z.object({
  title: z.string().min(3).max(100, {
    message: "Title must be between 3 and 100 characters",
  }),
  description: z.string().min(20).max(500, {
    message: "Description must be between 20 and 500 characters",
  }),
  category: z.string().min(3).max(20, {
    message: "Category must be between 3 and 20 characters",
  }),
  link: z
    .string()
    .url()
    .refine(async (value) => {
      try {
        const res = await fetch(value, { method: "HEAD" });
        const contentType = res.headers.get("content-type");

        return contentType?.startsWith("image/");
      } catch {
        return false;
      }
    }),
});
