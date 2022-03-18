const express = require('express');
const router = express.Router();
const pool = require('../database');
const nunjucks = require('nunjucks')

nunjucks.configure('views', {
  autoescape: true,
  express: app
});

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
            res.json({
                meeps: {
                    data: rows
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
        .then(([rows, fields]) => {
            res.json({
                name: {
                    data: rows
                }
            });
        })
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

module.exports = router;