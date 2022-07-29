const { authMiddleware } = require("./utils/auth");
const express = require("express");
const path = require("path");
const db = require("./config/connection");
// const routes = require('./routes');

// import ApolloServer
const { ApolloServer } = require("apollo-server-express");

// import TypeDefs and resolvers
const { typeDefs, resolvers } = require("./schemas");

// create new apollo server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  // integrate apollo server with the express application
  server.applyMiddleware({ app });

  // if we're in production, serve client/build as static assets
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/build")));
  }

  // app.use(routes);

  db.once("open", () => {
    app.listen(PORT, () =>
      console.log(`🌍 Now listening on localhost:${PORT}`)
    );
  });
};

startApolloServer(typeDefs, resolvers);
