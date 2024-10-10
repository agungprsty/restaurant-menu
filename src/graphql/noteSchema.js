const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
} = require('graphql');
const { PrismaClient } = require('@prisma/client');
const Log = require('../logger');

const prisma = new PrismaClient();

// Definisi type Note
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

// Root Query
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    notes: {
      type: new GraphQLList(NoteType),
      resolve: async () => prisma.note.findMany(),
    },
    note: {
      type: NoteType,
      args: {
        id: { type: GraphQLString },
      },
      resolve: async (parent, args) => prisma.note.findUnique({
        where: { id: args.id },
      }),
    },
  },
});

// Mutations
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addNote: {
      type: NoteType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        tags: { type: new GraphQLList(GraphQLString) },
        body: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parent, args) => {
        const newNote = await prisma.note.create({
          data: {
            title: args.title,
            tags: args.tags || [],
            body: args.body,
          },
        });

        Log.info(`Note created from GraphQL: ${newNote.id}`);
        return newNote;
      },
    },
    updateNote: {
      type: NoteType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        title: { type: GraphQLString },
        tags: { type: new GraphQLList(GraphQLString) },
        body: { type: GraphQLString },
      },
      resolve: async (parent, args) => {
        const updatedNote = await prisma.note.update({
          where: { id: args.id },
          data: {
            title: args.title,
            tags: args.tags,
            body: args.body,
          },
        });
        return updatedNote;
      },
    },
    deleteNote: {
      type: NoteType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parent, args) => {
        const deletedNote = await prisma.note.delete({
          where: { id: args.id },
        });
        return deletedNote;
      },
    },
  },
});

// Export schema
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
