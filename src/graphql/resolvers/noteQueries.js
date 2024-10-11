const {
  GraphQLString,
  GraphQLList,
} = require('graphql');
const { PrismaClient } = require('@prisma/client');
const NoteType = require('../types/noteType');

const prisma = new PrismaClient();

const noteQueries = {
  notes: {
    type: new GraphQLList(NoteType),
    resolve: async () => prisma.note.findMany(),
  },
  note: {
    type: NoteType,
    args: {
      id: { type: GraphQLString },
    },
    resolve: async (parent, args) => {
      const note = await prisma.note.findUnique({
        where: { id: args.id },
      });
      return note;
    },
  },
};

module.exports = noteQueries;
