import { Deta } from 'deta';
import Express from 'express';


const deta = Deta();
const base = deta.Base('todos');
const app = Express();
app.use(Express.json());

/**
 * Get list of ToDos
 */
app.get('/', async (req, res) => {
    try {

        const todos = await base.fetch();
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

        const todo = await base.put({
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

        const todo = await base.get(req.params.key);
        todo.done = !todo.done;

        await base.update({ ...todo, key: undefined }, req.params.key);
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

        await base.delete(req.params.key);
        res.send({ success: true });

    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, error });
    }
})

const port = process.env.PORT || 8080

// Start server
app.listen(port, () => {
    console.log(`ToDo-Backend started in "${process.env.NODE_ENV || 'development'}" mode on port ${port}! 🥳`);
});
