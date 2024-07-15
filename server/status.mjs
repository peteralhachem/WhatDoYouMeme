const OK = (obj) => ({
  obj: obj,
  code: 200,
});

const CREATED = (obj) => ({
  obj: obj,
  code: 201,
});

const NO_CONTENT = () => ({
  error: "No content",
  code: 204,
});

const NOT_FOUND = (message) => ({
  error: `Not Found${message ? ` - ${message}` : " error"}`,
  code: 404,
});

const CONFLICT = (message) => ({
  error: `Conflict${message ? ` - ${message}` : " error"}`,
  code: 409,
});

const INTERNAL_SERVER_ERROR = (message) => ({
  error: `Internal Server Error${message ? ` - ${message}` : " error"}`,
  code: 500,
});

export { OK, CREATED, NO_CONTENT, NOT_FOUND, CONFLICT, INTERNAL_SERVER_ERROR };
