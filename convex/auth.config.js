// from https://docs.convex.dev/auth/clerk 
//   -> 4. Create the auth config
export default {
  // Issuer ID from the clerk "Jwt Templates". "convex-notion-clone" in this case
  // applicationID: "convex",
  providers: [
    {
      domain: "https://mature-man-57.clerk.accounts.dev/",
      // domain: process.env.NEXT_PUBLIC_CLERK_ISSUER_ID,
      // applicationID: "convexNotionClone",
      applicationID: "convex",
    },
  ]
};