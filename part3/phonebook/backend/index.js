require("dotenv").config();
const Person = require("./models/person");
const express = require("express");
const app = express();
const morgan = require("morgan");

let persons = [];
// let persons = [
//   {
//     id: "1",
//     name: "Arto Hellas",
//     number: "040-123456",
//   },
//   {
//     id: "2",
//     name: "Ada Lovelace",
//     number: "39-44-5323523",
//   },
//   {
//     id: "3",
//     name: "Dan Abramov",
//     number: "12-43-234345",
//   },
//   {
//     id: "4",
//     name: "Mary Poppendieck",
//     number: "39-23-6423122",
//   },
// ];

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

app.use(express.static("dist")); //use dist for frontend

app.get("/", (req, res) => {
  res.send("<h1>Phonebook Backend!</h1>");
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((person) => {
    response.json(person);
  });
});

// app.get("/info", (request, response) => {
//   response.send(
//     `<p>phonebook has info for ${persons.length} people</p> <p> ${date}</p>`
//   );
// });

app.get("/info", (request, response) => {
  Person.countDocuments({}).then((count) => {
    response.send(
      `<p>Phonebook has info for ${count} people</p> <p>${new Date()}</p>`
    );
  });
});

// app.get("/api/persons/:id", (request, response) => {
//   const id = request.params.id;
//   const person = persons.find((p) => p.id == id);
//   if (person) {
//     response.json(person);
//   } else {
//     response.status(404).end();
//   }
// });

app.post("/api/persons", (request, response, next) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({ error: "Name or number missing" });
  }

  Person.findOne({ name: body.name })
    .then(existingPerson => {
      if (existingPerson) {
        return response.status(400).json({ error: "Name must be unique" });
      }

      const person = new Person({
        name: body.name,
        number: body.number,
      });

      return person.save();
    })
    .then(savedPerson => {
      response.json(savedPerson);
    })
    .catch(error => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const { number } = request.body;

  if (!number) {
    return response.status(400).json({ error: "Number is missing" });
  }

  const updatedPerson = { number };

  Person.findByIdAndUpdate(
    request.params.id,
    updatedPerson,
    { new: true, runValidators: true, context: "query" } // Options to return the updated document and run validation
  )
    .then((updatedPerson) => {
      if (!updatedPerson) {
        return response.status(404).send({ error: "Person not found" });
      }
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

// app.delete("/api/persons/:id", (request, response) => {
//   const id = request.params.id;
//   persons = persons.filter((per) => per.id !== id);

//   response.status(204).end();
// });

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      if (!result) {
        return response.status(404).send({ error: "Person not found" });
      }
      response.status(204).end();
    })
    .catch((error) => next(error));
});

// const generateId = () => {
//   return String(Date.now());
// };

// app.post("/api/persons", (request, response) => {
//   const body = request.body;

//   if (!body || !body.name || !body.number) {
//     return response.status(400).json({
//       error: "content missing",
//     });
//   }

//   if (persons.find((p) => p.name === body.name)) {
//     return response.status(400).json({
//       error: "name must be unique",
//     });
//   }

//   const person = {
//     id: generateId(),
//     name: body.name,
//     number: body.number,
//   };

//   persons = persons.concat(person);

//   response.json(person);
// });

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }
  if (error.name === "ValidationError") {
    return response.status(400).send({ error: error.message });
  }

  next(error);
};

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler);

// const PORT = 3001;
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
