const express = require('express');
require('./db/mongoose');
const userRouter = require('./routes/user');
const taskRouter = require('./routes/task');

const app = express();
const port = process.env.PORT;

app.use(express.json()); // automaticaly parse incoming json to an object so we can access it in our request
app.use(userRouter);
app.use(taskRouter);


app.listen(port, () => {
    console.log('Server is up on port ', port);
});

