import { createContext, useContext, useState } from "react";
import { faker } from "@faker-js/faker";

function createRandomPost() {
  return {
    title: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
    body: faker.hacker.phrase(),
  };
}
// create context
const PostContext = createContext();

const SearchContext = createContext();

function PostProvider({ children }) {
  const [posts, setPosts] = useState(() =>
    Array.from({ length: 30 }, () => createRandomPost())
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Derived state. These are the posts that will actually be displayed
  const searchedPosts =
    searchQuery.length > 0
      ? posts.filter((post) =>
          `${post.title} ${post.body}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      : posts;

  function handleAddPost(post) {
    setPosts((posts) => [post, ...posts]);
  }

  function handleClearPosts() {
    setPosts([]);
  }

  return (
    <>
      {/* provide value to child components */}
      <PostContext.Provider
        value={{
          posts: searchedPosts,
          onAddPost: handleAddPost,
          onClearPosts: handleClearPosts,
        }}
      >
        <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
          {children}
        </SearchContext.Provider>
      </PostContext.Provider>
    </>
  );
}

function usePost() {
  const context = [useContext(PostContext), useContext(SearchContext)];

  if (context[0] === undefined)
    throw new Error("post context was used outside the post provider");
  return context;
}

export { PostProvider, usePost };
