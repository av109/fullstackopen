const express = require("express");
const app = express();
const morgan = require("morgan");

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const date = new Date();

// morgan(function (tokens, req, res) {
//     return [
//       tokens.method(req, res),
//       tokens.url(req, res),
//       tokens.status(req, res),
//       tokens.res(req, res, 'content-length'), '-',
//       tokens['response-time'](req, res), 'ms'
//     ].join(' ')
//   })

app.use(express.json());
// app.use(morgan('combined'));

function assignId(req, res, next) {
  req.id = Date.now();
  next();
}

// Define custom tokens
morgan.token("id", (req) => req.id);
morgan.token("body", (req) => {
  // Only log the body for POST and PUT requests
  if (req.method === "POST" || req.method === "PUT") {
    return JSON.stringify(req.body) || "N/A";
  }
  return ""; // Return an empty string for other methods
});

// Use middleware in the correct order
app.use(assignId); // Assigns `id` to the request
app.use(
  morgan(
    ":id :method :url :status :res[content-length] - :response-time ms :body"
  )
);

app.get("/", (req, res) => {
  res.send("<h1>Phonebook Backend!</h1>");
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  response.send(
    `<p>phonebook has info for ${persons.length} people</p> <p> ${date}</p>`
  );
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((p) => p.id == id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons = persons.filter((per) => per.id !== id);

  response.status(204).end();
});

const generateId = () => {
  return String(Date.now());
};

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body || !body.name || !body.number) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  if (persons.find((p) => p.name === body.name)) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);

  response.json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
