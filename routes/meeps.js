const express = require('express');
const router = express.Router();
const pool = require('../database');

/* 
    BASE URL / meeps
    GET / - get all meeps
    POST / - create a new name
    GET /:id - get a name by id
    PUT /:id - update a name by id
    DELETE /:id - delete a name by id

*/
router.get('/', async (req, res, next) => {
    await pool.promise()
        .query('SELECT * FROM meeps')
        .then(([rows, fields]) => {
            res.render('meeps.njk', {
                meeps: rows,
                title: 'meeps',
                layout: 'layout.njk'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                meeps: {
                    error: "Error getting meeps"
                }
            })
        });

});


router.get('/:id', async (req, res, next) => {
    const id = req.params.id;

    if (isNaN(req.params.id)) {
        res.status(400).json({
            name: {
                error: 'Bad request'
            }
        });
    } else {
        await pool.promise()
        .query('SELECT * FROM meeps WHERE id = ?', [id])
        .then(([rows, fields]) => {
            res.json({
                name: {
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
            name: {
                error: 'Bad request'
            }
        });
    } else {
    res.json(`deleting name ${id}`);
    await pool.promise()
        .query('DELETE FROM meeps WHERE id = ?', [id])
        .then(([response]) => {
            if (response[0].affectedRows == 1) {
                res.redirect('/meeps');
            } else {
                res.status(400).redirect('/meeps');
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                meeps: {
                    error: "Error getting meeps"
                }
            })
        });
    }
})

router.get('/', async (req, res, next) => {
    res.json(req.body);

    await pool.promise()
    .query('SELECT INTO meeps (name) VALUES (?)', [meeps])
    .then(([response]) => {
        res.json({
            meeps: {
                data: response
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            meeps: {
                error: "Error getting meeps"
            }
        })
    });
});

router.post('/', async (req, res, next) => {
    // { "name": "koda post" }
    const name = req.body.name;

    if (name.length < 3) {
        res.status(400).json({
            name: {
                error: 'A name must have at least 3 characters',
            },
        });
    }

    await pool
        .promise()
        .query('INSERT INTO meeps (name) VALUES (?)', [name])
        .then((response) => {
            if (response[0].affectedRows === 1) {
                req.session = "Successfully added name";
                res.redirect('/meeps');
            } else {
                res.status(400).json({
                    name: {
                        error: 'Invalid name',
                    },
                });
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                name: {
                    error: 'Error getting meeps',
                },
            });
        });

    // res.json(req.body);
});

router.post('/:id/complete', async (req, res, next) => {
    const id = req.params.id;

    await pool
    .promise()
    .query('UPDATE meeps SET completed = !completed WHERE id = ?', [id])
    .then(response => {
        if (response[0].affectedRows === 1) {
            req.session = "Successfully completed meep";
            res.redirect('/meeps');
        } else {
            res.status(400).json({
                name: {
                    error: 'whoops',
                },
            });
        }
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