const {
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
} = require('graphql');
const { PrismaClient } = require('@prisma/client');
const Log = require('../../logger');
const NoteType = require('../types/noteType');

const prisma = new PrismaClient();

const noteMutations = {
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
};

module.exports = noteMutations;
