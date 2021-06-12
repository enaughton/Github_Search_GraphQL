import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { useState } from "react";
import Cards from "./Components/Card";
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
        <Cards queryString={queryString} />
      </div>
    </ApolloProvider>
  );
}
