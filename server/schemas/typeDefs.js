const typeDefs = `
  type User {
    _id: ID!
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]
  }

  type Book {
    _id: ID!
    bookId: String
    authors: [String]
    description: String
    title: String!
    image: String
    link: String
  }

  input savedBook {
    description: String!
    title: String!
    bookId: String
    image: String
    authors: [String]
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
     me: User
  }

  type Mutation {
    createUser(username: String!, email: String!, password: String!): Auth
    loginUser(email: String!, password: String!): Auth
    saveBook(input: savedBook!): User
    removeBook(bookId: ID!): User
  }
`;

module.exports = typeDefs;
