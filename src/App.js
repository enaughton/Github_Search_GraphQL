import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  gql,
  useQuery,
  ApolloProvider,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { useState } from "react";
import "./index.css";
import "./App.css";

import "tailwindcss/tailwind.css";
const TOKEN = process.env.REACT_APP_GITHUB_TOKEN;
console.log();

const httpLink = createHttpLink({
  uri: "https://api.github.com/graphql",
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: `bearer ${TOKEN}`,
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

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

const AppInner = ({ queryString }) => {
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
          <div key={user.id}>
            <div class="card min-w-sm border px-4 rounded border-gray-700 bg-gray-700 text-gray-50 transition-shadow shadow-xl hover:shadow-xl min-w-max">
              <a href={user.url}>
                <div class="flex items-center p-4">
                  <div class="relative flex flex-col items-center w-full">
                    <div class="h-24 w-24 md rounded-full relative avatar flex items-end justify-end text-purple-400 min-w-max flex bg-purple-200 text-purple-100 row-start-1 row-end-3 text-purple-650 ring-1 ring-white">
                      <img
                        class=" flex h-24 w-24 md rounded-full relative"
                        src={user.avatarUrl}
                        alt="space"
                      />
                      <div class="absolute"></div>
                    </div>

                    <p class="py-4 text-sm text-gray-200">{user.name}</p>
                    <p class="text-sm text-gray-200">
                      Followers: {user.followerCount}
                    </p>
                    <p class="text-sm text-gray-200">Stars: {user.starCount}</p>
                  </div>
                </div>
              </a>
            </div>
          </div>
        ))}
      </div>
      <div class="flex py-4 m-4 max-w-max justify-center bg-gry-50 shadow-md rounded-lg overflow-hidden mx-auto">
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

export default function App() {
  const [queryString, setQueryString] = useState("");

  return (
    <ApolloProvider client={client}>
      <div class="w-full px-3 mb-6">
        <div class="flex justify-center">
          <input
            onChange={(e) => {
              setQueryString(e.target.value);
            }}
            value={queryString}
            class="flex appearance-none justify-center block w-half items-center bg-gray-200 text-grey-darker border border-grey-lighter rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-grey"
            placeholder="Search..."
          />
        </div>
        <AppInner queryString={queryString} />
      </div>
    </ApolloProvider>
  );
}
