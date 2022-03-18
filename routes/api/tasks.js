const express = require('express');
const router = express.Router();
const pool = require('../database');
const nunjucks = require('nunjucks')

nunjucks.configure('views', {
  autoescape: true,
  express: app
});

/* 
    BASE URL / tasks
    GET / - get all tasks
    POST / - create a new task
    GET /:id - get a task by id
    PUT /:id - update a task by id
    DELETE /:id - delete a task by id

*/
router.get('/', async (req, res, next) => {
    await pool.promise()
        .query('SELECT * FROM tasks')
        .then(([rows, fields]) => {
            res.json({
                tasks: {
                    data: rows
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                tasks: {
                    error: "Error getting tasks"
                }
            })
        });

});


router.get('/:id', async (req, res, next) => {
    const id = req.params.id;

    if (isNaN(req.params.id)) {
        res.status(400).json({
            task: {
                error: 'Bad request'
            }
        });
    } else {
        await pool.promise()
        .query('SELECT * FROM tasks WHERE id = ?', [id])
        .then(([rows, fields]) => {
            res.json({
                task: {
                    data: rows
                }
            });
        })
    }
    

    console.log(id);
    res.json({
        id: req.params.id
    })
});

router.get('/:id/delete', async (req, res, next) => {
    const id = req.params.id;

    if (isNaN(req.params.id)) {
        res.status(400).json({
            task: {
                error: 'Bad request'
            }
        });
    } else {
    res.json(`deleting task ${id}`);
    await pool.promise()
        .query('DELETE FROM tasks WHERE id = ?', [id])
        .then(([rows, fields]) => {
            res.json({
                task: {
                    data: rows
                }
            });
        })
    }
})

router.get('/', async (req, res, next) => {
    res.json(req.body);

    await pool.promise()
    .query('SELECT INTO tasks (task) VALUES (?)', [tasks])
    .then(([response]) => {
        res.json({
            tasks: {
                data: response
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            tasks: {
                error: "Error getting tasks"
            }
        })
    });
});

module.exports = router;