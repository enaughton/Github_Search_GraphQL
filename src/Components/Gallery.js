import { gql, useQuery } from "@apollo/client";
import { useState } from "react";
import "tailwindcss/tailwind.css";
import Card from "./Card";

const QUERY = gql`
  query SearchUsers($queryString: String!, $count: Int!, $cursor: String) {
    search(query: $queryString, type: USER, first: $count, after: $cursor) {
      userCount
      edges {
        node {
          ... on User {
            id
            login
            avatarUrl
            name
            url
            followers {
              totalCount
            }
            starredRepositories {
              totalCount
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        endCursor
        startCursor
      }
    }
  }
`;

const Gallery = ({ queryString }) => {
  const [currentCursor, setCursor] = useState();
  const { loading, error, data } = useQuery(QUERY, {
    variables: {
      queryString,
      count: 32,
      cursor: currentCursor,
      offset: 0,
      limit: 10,
    },
  });

  if (loading) return <p>Loading ...</p>;
  if (error) return <p>Error!</p>;

  const users = data.search.edges.map(
    ({
      node: {
        id,
        login: username,
        name,
        avatarUrl,
        url,
        starredRepositories: { totalCount: starCount },
        followers: { totalCount: followerCount },
        totalCount,
      },
    }) => ({
      id,
      username,
      name,
      avatarUrl,
      url,
      starCount,
      followerCount,
      totalCount,
    })
  );

  return (
    <div>
      <p class="flex justify-center ">Total: {data.search.userCount}</p>
      <div class="grid gap-4 grid-cols-4 space-x-2 w-full bg-white shadow-md rounded-lg md:overflow- mx-auto">
        {users.map((user) => (
          <Card />
        ))}
      </div>
      <div class="flex py-4 m-4 max-w-max justify-center bg-gry-50 shadow-md rounded-lg overflow-hidden mx-auto">
        {data.search.pageInfo.hasPreviousPage && (
          <button
            class="flex py-4 m-4 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
            onClick={() => {
              setCursor(data.search.pageInfo.endCursor);
            }}
          >
            Previous
          </button>
        )}
        {data.search.pageInfo.hasNextPage && (
          <button
            class="flex py-4 m-4 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
            onClick={() => {
              setCursor(data.search.pageInfo.startCursor);
            }}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default Gallery;
