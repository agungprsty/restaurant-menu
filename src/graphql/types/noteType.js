const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
} = require('graphql');

const NoteType = new GraphQLObjectType({
  name: 'Note',
  fields: () => ({
    id: { type: GraphQLString },
    title: { type: GraphQLString },
    tags: { type: new GraphQLList(GraphQLString) },
    body: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
  }),
});

module.exports = NoteType;
