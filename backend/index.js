import { Deta } from 'deta';
import Express from 'express';

const deta = Deta();
const db = deta.Base('todos');
const app = Express();
app.use(Express.json());

/**
 * Get list of ToDos
 */
app.get('/', async (req, res) => {
    try {

        const todos = await db.fetch();
        todos.items.sort((a, b) => a.createdAt - b.createdAt);

        res.send({ success: true, todos: todos.items  });

    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, error });
    }
});

/**
 * Add new ToDo
 */
app.post('/', async (req, res) => {
    try {

        const todo = await db.put({
            text: req.body.text,
            createdAt: Date.now(),
            done: false
        });

        res.send({ success: true, todo });

    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, error });
    }
});

/**
 * Toggle ToDo
 */
app.put('/:key', async (req, res) => {
    try {

        const todo = await db.get(req.params.key);
        todo.done = !todo.done;

        await db.update({ ...todo, key: undefined }, req.params.key);
        res.send({ success: true, todo });

    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, error });
    }
});

/**
 * Delete existing todo
 */
app.delete('/:key', async (req, res) => {
    try {

        await db.delete(req.params.key);
        res.send({ success: true });

    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, error });
    }
})

/**
 * Scheduled action to delete completed todos
 * emulate it with `space dev trigger cleanup`
 */
app.post('/__space/v0/actions', async (req, res) => {
    const todos = await db.fetch();
    todos.items.forEach(async (todo) => {
        if (todo.done) {await db.delete(todo.key)}
    })
    res.send({ success: true });
});

const port = process.env.PORT || 8080

// Start server
app.listen(port, () => {
    console.log(`backend running on port ${port}!`);
});
