const express = require('express');
const router = express.Router();
const pool = require('../database');

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
            res.render('tasks.njk', {
                tasks: rows,
                title: 'Tasks',
                layout: 'layout.njk'
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
        .then(([response]) => {
            if (response[0].affectedRows == 1) {
                res.redirect('/tasks');
            } else {
                res.status(400).redirect('/tasks');
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                tasks: {
                    error: "Error getting tasks"
                }
            })
        });
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

router.post('/:id/complete', async (req, res, next) => {
    const id = req.params.id;

    await pool
    .promise()
    .query('UPDATE tasks SET completed = !completed WHERE id = ?', [id])
    .then(response => {
        console.log(response);
    })
    .catch(error => {
        console.log(error);
    });
})

router.get('/', async  function(req, res, next) {
    let  data = {
      message: 'Hello world!',
      layout:  'layout.njk',
      title: 'Nunjucks example'
    }
  
    res.render('index.njk', data)
  })

module.exports = router;