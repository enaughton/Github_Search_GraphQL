import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { useState } from "react";
import Gallery from "./Components/Gallery";
import Search from "./Components/Search";
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
        <Search
          value={queryString}
          onChange={(e) => {
            setQueryString(e.target.value);
          }}
        />
        <Gallery queryString={queryString} />
      </div>
    </ApolloProvider>
  );
}
