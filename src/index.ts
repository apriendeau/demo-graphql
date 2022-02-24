import express from 'express'
import { graphqlHTTP } from 'express-graphql'
import { buildSchema } from 'graphql'
import morgan from 'morgan'

const schema = buildSchema(`
  type User {
    id:  Int,
    firstName: String,
    lastName: String,
    email: String,
  }
  type Query {
    hello: String
    users: [User]
    user(id: Int!): User
  }
  type Mutation {
    createUser(firstName: String, lastName: String, email: String): User
  }
`)
var lastId = 0
var users: User[] = []

type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
};

var root = {
  hello: () => {
    return 'Hello world!';
  },
  users: () => {
    return users
  },
  user: ({id}: { id: number }) => {
    return users.find(user => user.id === id)
  },
  createUser: ({firstName, lastName, email}: {firstName: string, lastName: string, email: string}): User => {
    var user: User = {
      id: ++lastId,
      firstName: firstName,
      lastName: lastName,
      email: email,
    }
    users.push(user)
    return user
  },
};

const app = express();
app.use(morgan('combined'));
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');