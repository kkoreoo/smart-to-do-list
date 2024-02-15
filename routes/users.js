/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into /users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */
const db = require('../db/connection');

//libraries and packages
const express = require('express');
const router  = express.Router();
const userinfo = require('../db/queries/users');

//ROUTES

router.get('/', (req, res) => {
  userinfo.getUsers()
  .then((result)=>{

    res.json(result.rows);
  })
});

// READ - Sends client a user's info 
router.get('/:id', (req, res) => {
  const userId = req.params.id
  userinfo.getOnlyOneUser(userId)
  .then((result)=>{
    if (result.rows.length === 0) {
      res.status(404).send('User not found');
    }

    res.json(result.rows);
  })
});

// EDIT - Updates user info in DB
router.post('/:id/edit', (req, res) => {
  const userId = req.params.id;
  const {firstName, lastName} = req.body;

  // Update the user's first name and last name
  userinfo.updateUser(userId, firstName,lastName)
    .then((updatedUser) => {

      if (updatedUser.rows.length === 0) {
        return res.status(500).send('Error updating user');
      }

      res.json(updatedUser.rows);
    });
});
// BROWSE - Get all tasks for a user
router.get('/:id/tasks', (req, res) => {

  const userId = req.params.id;

  userinfo.getTasksForUser(userId)
    .then((result)=>{
     if (result.rows.length === 0) {
      res.status(404).send(`User has no task with id of ${userId} !`);
      return;
    }
    res.json(result.rows);
  })
});
// will change this to post to make a post requet
//Edit an existing task in the tasks table
router.get('/:id/tasks/edit', (req, res) => {
  const userId = req.params.id;
  // const newTaskName = req.body.newTaskName;
  userinfo.editTask(userId,'play chess')
  .then((result) => {
    if (result.rows.length === 0) {
      return res.status(404).send('Task not found');
    }
    //params will be replaced to (userId,listId,newListName) to be dynamic;
    return userinfo.editTask(3,'Buy a new labtop');
  })

    .then((editTask) => {
      // Check if a list was successfully updated
      if (editTask.rows.length === 0) {

        return res.status(500).send('Error updating list');

      }
      res.json(editTask.rows);
    });

});
//will change  router.get to router.post later on
//Add a new task to the the tasks table

router.get ('/:id/tasks/add', (req, res) => {
  const userId = req.params.id;
  // const taskId = req.params.idTasks;
  const taskName = req.body.taskName;
  const category = req.body.category;

  userinfo.addTask(userId, taskName, category)
    .then((result) => {
      if (result.rows.length === 0) {
        return res.status(500).json({ error: 'Error adding task' });
      }
      return userinfo.addTask('watch money heist',false);
     })
     .then((addTask) => {

      // Check if a user was not updated
      if (addTask.rows.length === 0) {
        return res.status(500).send('Error inserting tastk');
      }
      res.json(addTask.rows);
    });
});

module.exports = router;
