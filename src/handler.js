const { nanoid } = require('nanoid');
const books = require('./books');

const saveBook = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = readPage === pageCount;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }
  books.push(newBook);
  const isSuccess = books.filter((book) => book.id === id).length > 0;
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const showAllBooks = (request, h) => {
  const allBooks = books.map(
    (value) => ({ id: value.id, name: value.name, publisher: value.publisher }),
  );
  const { name, reading, finished } = request.query;
  if (name !== undefined) {
    const lowerName = name.toLowerCase();
    const findName = books.filter((named) => named.name.toLowerCase().includes(lowerName))
      .map((value) => ({ id: value.id, name: value.name, publisher: value.publisher }));
    const response = h.response({
      status: 'success',
      data: {
        books: findName,
      },
    });
    response.code(200);
    return response;
  }

  if (reading !== undefined) {
    if (parseInt(reading, 10) === 0) {
      const readingBooks = books.filter((read) => read.reading === false)
        .map((value) => ({ id: value.id, name: value.name, publisher: value.publisher }));
      const response = h.response({
        status: 'success',
        data: {
          books: readingBooks,
        },
      });
      response.code(200);
      return response;
    }
    if (parseInt(reading, 10) === 1) {
      const readingBooks = books.filter((read) => read.reading === true)
        .map((value) => ({ id: value.id, name: value.name, publisher: value.publisher }));
      const response = h.response({
        status: 'success',
        data: {
          books: readingBooks,
        },
      });
      response.code(200);
      return response;
    }
  }

  if (finished !== undefined) {
    if (parseInt(finished, 10) === 0) {
      const finishedBooks = books.filter((finish) => finish.finished === false)
        .map((value) => ({ id: value.id, name: value.name, publisher: value.publisher }));
      const response = h.response({
        status: 'success',
        data: {
          books: finishedBooks,
        },
      });
      response.code(200);
      return response;
    }
    if (parseInt(finished, 10) === 1) {
      const finishedBooks = books.filter((finish) => finish.finished === true)
        .map((value) => ({ id: value.id, name: value.name, publisher: value.publisher }));
      const response = h.response({
        status: 'success',
        data: {
          books: finishedBooks,
        },
      });
      response.code(200);
      return response;
    }
  }

  const response = h.response({
    status: 'success',
    data: {
      books: allBooks,
    },
  });
  response.code(200);
  return response;
};

const booksDetail = (request, h) => {
  const { bookId: id } = request.params;

  const book = books.filter((b) => b.id === id)[0];
  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const updateBook = (request, h) => {
  const { bookId: id } = request.params;

  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();

  const index = books.findIndex((book) => book.id === id);
  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const book = books.filter((b) => b.id === id)[0];
  if (!book) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const deleteBook = (request, h) => {
  const { bookId: id } = request.params;

  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  saveBook,
  showAllBooks,
  booksDetail,
  updateBook,
  deleteBook,
};
