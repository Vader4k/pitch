"use server";

import { auth } from "@/auth";
import { parseServerActionResponse } from "./utils";
import slugify from "slugify";
import { writeClient } from "@/sanity/lib/write-client";

/**
 * Creates a new startup pitch entry in the Sanity database
 * 
 * @param state - Current form state (used by React Server Actions)
 * @param form - FormData object containing startup details:
 *               - title: Name of the startup
 *               - description: Detailed description of the startup
 *               - category: Business category/sector
 *               - link: URL to startup's image
 * @param pitch - Pitch content/description (passed separately from form)
 * 
 * @returns {Promise<{
 *   status: 'SUCCESS' | 'ERROR',
 *   error?: string,
 *   [key: string]: any  // Additional fields from Sanity response
 * }>}
 * 
 * @throws Will return error response if:
 *         - User is not authenticated
 *         - Sanity database operation fails
 * 
 * @example
 * const response = await createPitch(
 *   formState,
 *   new FormData(formElement),
 *   pitchText
 * );
 */
export const createPitch = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  state: any,
  form: FormData,
  pitch: string
) => {
  // Verify user authentication
  const session = await auth();
  if (!session)
    return parseServerActionResponse({
      error: "Not signed in",
      status: "ERROR",
    });

  // Extract and filter form data, excluding the pitch field
  const { title, description, category, link } = Object.fromEntries(
    Array.from(form).filter(([key]) => key !== "pitch")
  );

  // Generate URL-friendly slug from the title
  const slug = slugify(title as string, { lower: true, strict: true });
  
  try {
    // Construct startup document structure for Sanity
    const startup = {
      title,
      description,
      category,
      image: link,
      slug: {
        _type: slug,
        current: slug,
      },
      author: {
        _type: "reference",
        _ref: session?.id,
      },
      pitch,
    };
    
    // Create new document in Sanity database
    const result = await writeClient.create({_type: 'startup', ...startup});
    return parseServerActionResponse({
      status: "SUCCESS",
      ...result,
      error: ''
    });
  } catch (error) {
    // Log and return any errors that occur during creation
    console.log(error);
    return parseServerActionResponse({
      error: JSON.stringify(error),
      status: "ERROR",
    });
  }
};
