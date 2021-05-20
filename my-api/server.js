const { ApolloServer, gql } = require('apollo-server');

const schema = gql(`
  type Query {
    otherUser: User
    nextUser: User
    currentUser: User
    postsByUser(userId: String!): [Post]
    postsByOtherUser(userId: String!): [Post]
    postsByNextUser(userId: String!): [Post]
  }

  type Mutation {
    addPost(content: String): Post 
  }

  type User {
    id: ID!
    username: String!
    posts: [Post]
  }

  type Post {
    id: ID!
    content: String!
    userId: ID!
  }
`);

var data = {};

data.posts = [
  { 
    id: 'xyz-1',
    content: "First Post - Hello world",
    userId: 'abc-1',
  },
  {
    id: 'xyz-2',
    content: "Second Post - Hello again",
    userId: 'abc-2',
  },
  {
    id: 'xyz-3',
    content: "Third Post - Hello again",
    userId: 'abc-3',
  }
];

data.users = [
  {
    id: 'abc-1', 
    username: "HilmiSabli",
  },
  {
    id: 'abc-2', 
    username: "ShariffuddinSablee",
  },
  {
    id: 'abc-3', 
    username: "FaiqNaqiuddin",
  }

];

const currentUserId = 'abc-1';
const otherUserId = 'abc-2';
const nextUserId = 'abc-3';

var resolvers = {
  Mutation: {
    addPost: async (_, { content }, { currentUserId, data }) => {
      let post = { 
        id: 'xyz-' + (data.posts.length + 1), 
        content: content, 
        userId: currentUserId,
      };
      data.posts.push(post);
      return post;
    }
  },
  Query: {
    otherUser: (parent, args, context) => {
      let user = context.data.users.find( u => u.id === context.otherUserId );
      return user;
    },
    nextUser: (parent, args, context) => {
      let user = context.data.users.find( u => u.id === context.nextUserId );
      return user;
    },
    currentUser: (parent, args, context) => {
      let user = context.data.users.find( u => u.id === context.currentUserId );
      return user;
    },
    postsByUser: (parent, args, context) => {
      let posts = context.data.posts.filter( p => p.userId === args.userId ); 
      return posts
    },
    postsByOtherUser: (parent, args, context) => {
      let otherposts = context.data.posts.filter( p => p.userId === args.userId ); 
      return posts
    },
    postsByNextUser: (parent, args, context) => {
      let nextposts = context.data.posts.filter( p => p.userId === args.userId ); 
      return posts
    },

  },
  User: {
    posts: (parent, args, context) => {
      let posts = context.data.posts.filter( p => p.userId === parent.id );
      return posts;
    }
  }
};
  
const server = new ApolloServer({ 
  typeDefs: schema, 
  resolvers: resolvers,
  context: { 
    nextUserId,
    otherUserId,
    currentUserId,
    data,
  }
});

server.listen(4001).then(({ url }) => {
  console.log('API server running at localhost:4001');
});
