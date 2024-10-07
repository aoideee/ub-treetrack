import { createSupabaseServerComponentClient } from "@/lib/supabase/server";

export default async function Account() {
  const {
    data: { user },
  } = await createSupabaseServerComponentClient().auth.getUser();

  return (
    <>
      <h1>Account Information</h1>
      {user && user.user_metadata ? (
        <div>
          <h2>User Metadata</h2>
          <ul>
            {Object.keys(user.user_metadata).map((key) => (
              <li key={key}>
                <strong>{key}:</strong>{" "}
                {typeof user.user_metadata[key] === "object" ? (
                  <pre>{JSON.stringify(user.user_metadata[key], null, 2)}</pre>
                ) : (
                  user.user_metadata[key]
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No user metadata available.</p>
      )}
    </>
  );
}
