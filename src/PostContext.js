import { createContext, useCallback, useContext, useMemo, useState } from "react";
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
  const searchedPosts = useMemo(() =>searchQuery.length > 0
      ? posts.filter((post) =>
          `${post.title} ${post.body}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      : posts, [posts ,searchQuery])
    

   const handleAddPost = useCallback(function handleAddPost(post) {
    setPosts((posts) => [post, ...posts]);
  }
,[])

  function handleClearPosts() {
    setPosts([]);
  }
          const postValue = useMemo(() =>({
            posts: searchedPosts,
            onAddPost: handleAddPost,
            onClearPosts: handleClearPosts, 
          } ), [handleAddPost , searchedPosts])

          const searchValue = useMemo(() => ({searchQuery, setSearchQuery }), [searchQuery])
  return (
    <>
      {/* provide value to child components */}
      <PostContext.Provider
        value={postValue}
      >
        <SearchContext.Provider value={searchValue}>
          {children}
        </SearchContext.Provider>
      </PostContext.Provider>
    </>
  );
}

function usePost() {
  const postContext = useContext(PostContext);
  const searchContext = useContext(SearchContext);

  if (!postContext)
    throw new Error("post context was used outside the post provider");

  return { ...postContext, ...searchContext }; // ✅ More readable
}


export { PostProvider, usePost };
