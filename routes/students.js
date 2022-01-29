var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');
 
// display students page
router.get('/', function(req, res, next) {
      
    dbConn.query('SELECT * FROM students ORDER BY id desc',function(err,rows)     {
 
        if(err) {
            req.flash('error', err);
            // render to views/students/index.ejs
            res.render('students',{data:''});   
        } else {
            // render to views/students/index.ejs
            res.render('students',{data:rows});
        }
    });
});

// display add student page
router.get('/add', function(req, res, next) {    
    // render to add.ejs
    res.render('students/add', {
        name: '',
        panel: ''        
    })
})

// add a new student
router.post('/add', function(req, res, next) {    

    let name = req.body.name;
    let panel = req.body.panel;
    let errors = false;

    if(name.length === 0 || panel.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter name and panel");
        // render to add.ejs with flash message
        res.render('students/add', {
            name: name,
            panel: panel
        })
    }

    // if no error
    if(!errors) {

        var form_data = {
            name: name,
            panel: panel
        }
        
        // insert query
        dbConn.query('INSERT INTO students SET ?', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                 
                // render to add.ejs
                res.render('students/add', {
                    name: form_data.name,
                    panel: form_data.panel                    
                })
            } else {                
                req.flash('success', 'Student successfully added');
                res.redirect('/students');
            }
        })
    }
})

// display edit student page
router.get('/edit/(:id)', function(req, res, next) {

    let id = req.params.id;
   
    dbConn.query('SELECT * FROM students WHERE id = ' + id, function(err, rows, fields) {
        if(err) throw err
         
        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'Student not found with id = ' + id)
            res.redirect('/students')
        }
        // if student found
        else {
            // render to edit.ejs
            res.render('students/edit', {
                title: 'Edit Student', 
                id: rows[0].id,
                name: rows[0].name,
                panel: rows[0].panel
            })
        }
    })
})

// update student data
router.post('/update/:id', function(req, res, next) {

    let id = req.params.id;
    let name = req.body.name;
    let panel = req.body.panel;
    let errors = false;

    if(name.length === 0 || panel.length === 0) {
        errors = true;
        
        // set flash message
        req.flash('error', "Please enter name and panel");
        // render to add.ejs with flash message
        res.render('students/edit', {
            id: req.params.id,
            name: name,
            panel: panel
        })
    }

    // if no error
    if( !errors ) {   
 
        var form_data = {
            name: name,
            panel: panel
        }
        // update query
        dbConn.query('UPDATE students SET ? WHERE id = ' + id, form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('students/edit', {
                    id: req.params.id,
                    name: form_data.name,
                    panel: form_data.panel
                })
            } else {
                req.flash('success', 'Student successfully updated');
                res.redirect('/students');
            }
        })
    }
})
   
// delete student
router.get('/delete/(:id)', function(req, res, next) {

    let id = req.params.id;
     
    dbConn.query('DELETE FROM students WHERE id = ' + id, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to students page
            res.redirect('/students')
        } else {
            // set flash message
            req.flash('success', 'Student successfully deleted! ID = ' + id)
            // redirect to students page
            res.redirect('/students')
        }
    })
})

module.exports = router;