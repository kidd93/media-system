const {User} = require('../models');

const userController = {
  getAllUsers(req, res) {
    User.find()
    .select('-__v')
    .then((dbUserData) => {
      res.json(dbUserData);
    })
  },
 
  getUserById(req, res) {
    User.findOne({_id: req.params.userId})
      .select('-__v')
      .populate('thoughts')
      .populate('friends')
      .then((dbUserData) => {
        if (!dbUserData) {
          return res.status(404).json({message: 'user not found with id'});
        }
        res.json(dbUserData);
      });
  },

  createUser(req, res) {
    User.create(req.body)
      .then((dbUserData) => {
        res.json(dbUserData);
      });
  },

  updateUser(req, res) {
    User.findOneAndUpdate(
      {_id: req.params.userId},
      {$set: req.body,},
      {new: true, runValidators: true,})
      .then((dbUserData) => {
        if (!dbUserData) {
          return res.status(404).json({message: 'user not found with id'});
        }
        res.json(dbUserData);
      })
  },

  addFriend(req, res) {
    User.findOneAndUpdate(
        {_id: req.params.userId},
        {$push: {friends: req.params.friendId}},
        {new: true})
      .then((dbUserData) => {
        if (!dbUserData) {
          return res.status(404).json({message: 'user not found with id'});
        }
        res.json(dbUserData);
      });
  },

  removeFriend(req, res) {
    User.findOneAndUpdate(
        {_id: req.params.userId},
        {$pull: { friends: req.params.friendId}},
        {new: true})
      .then((dbUserData) => {
        if (!dbUserData) {
          return res.status(404).json({message: 'user not found with id'});
        }
        res.json(dbUserData);
      })
  }
};

module.exports = userController;