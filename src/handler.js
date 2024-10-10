const { PrismaClient } = require('@prisma/client');
const { now } = require('./utils');
const { noteValidationSchema } = require('./validations/notesValidation');
const Log = require('./logger');

const prisma = new PrismaClient();

const addNoteHandler = async (req, h) => {
  // Validasi input menggunakan Joi
  const { error } = noteValidationSchema.validate(req.payload);
  if (error) {
    Log.error(
      { path: '/src/handler.js' },
      `Validation error: ${error.message}`,
    );
    const response = h.response({
      status: 'fail',
      message: `Validasi gagal: ${error.details[0].message}`,
    });
    response.code(400);
    return response;
  }

  const { title, tags, body } = req.payload;
  const createdAt = now;
  const updatedAt = createdAt;

  try {
    const newNote = await prisma.note.create({
      data: {
        title,
        tags,
        body,
        createdAt,
        updatedAt,
      },
    });

    Log.info(`Note created: ${newNote.id}`);

    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan',
      data: {
        noteId: newNote.id,
      },
    });
    response.code(201);
    return response;
  } catch (err) {
    Log.error({ path: '/src/handler.js' }, err.message);

    const response = h.response({
      status: 'fail',
      message: 'Catatan gagal ditambahkan',
    });
    response.code(500);
    return response;
  }
};

const getAllNotesHandler = async () => {
  const notes = await prisma.note.findMany();

  return {
    status: 'success',
    data: {
      notes,
    },
  };
};

const getNoteByIdHandler = async (req, h) => {
  const { id } = req.params;

  const note = await prisma.note.findUnique({
    where: { id },
  });

  if (note) {
    return {
      status: 'success',
      data: {
        note,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan tidak ditemukan',
  });
  response.code(404);
  return response;
};

const updateNoteByIdHandler = async (req, h) => {
  // Validasi input menggunakan Joi
  const { error } = noteValidationSchema.validate(req.payload);
  if (error) {
    Log.error(
      { path: '/src/handler.js' },
      `Validation error: ${error.message}`,
    );
    const response = h.response({
      status: 'fail',
      message: `Validasi gagal: ${error.details[0].message}`,
    });
    response.code(400);
    return response;
  }

  const { id } = req.params;
  const { title, tags, body } = req.payload;
  const updatedAt = now;

  try {
    await prisma.note.update({
      where: { id },
      data: {
        title,
        tags,
        body,
        updatedAt,
      },
    });

    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil diperbarui',
    });
    response.code(200);
    return response;
  } catch (err) {
    Log.error({ path: '/src/handler.js' }, err.message);

    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui catatan. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }
};

const deleteNoteByIdHandler = async (req, h) => {
  const { id } = req.params;

  try {
    await prisma.note.delete({
      where: { id },
    });

    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil dihapus',
    });
    response.code(200);
    return response;
  } catch (err) {
    Log.error({ path: '/src/handler.js' }, err.message);

    const response = h.response({
      status: 'fail',
      message: 'Catatan gagal ditambahkan',
    });
    response.code(500);
    return response;
  }
};

module.exports = {
  addNoteHandler,
  getAllNotesHandler,
  getNoteByIdHandler,
  updateNoteByIdHandler,
  deleteNoteByIdHandler,
};
