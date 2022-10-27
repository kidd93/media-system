const {Thought} = require('../models');

const thoughtController = {
    getAllThought(req, res) {
      Thought.find({})
      .populate({
        path: 'reactions',
        select: '-__v'
      })
      .select('-__v')
      .sort({ _id: -1 })
      .then(dbThoughtData => res.json(dbThoughtData))
    },
    
    getThoughtById(req, res) {
        Thought.findOne({
            _id: req.params.thoughtId
        }).then((dbThoughtData) => {
            if(!dbThoughtData) {
                return res.sendStatus(400).json({ message: 'no thought id found' });
            }
            res.json(dbThoughtData);
        })
    },

    addThought({body}, res) {
        Thought.create(body)
        .then(dbThoughtData => res.json(dbThoughtData))
    },

    updateThought(req, res) {
        Thought.findOneAndUpdate({ _id: req.params.thoughtId }, { $set: req.body }, { new: true, runValidators: true })
          .then((dbThoughtData) => {
            if (!dbThoughtData) {
              return res.status(404).json({ message: 'thought not found with id' });
            }
            res.json(dbThoughtData);
          })
      },

      deleteThought({params}, res) {
        Thought.findOneAndDelete({_id: params.id})
        .then(dbThoughtData => res.json(dbThoughtData))
      },

      addReaction(req, res) {
        Thought.findOneAndUpdate(
          { _id: req.params.thoughtId },
          { $push: { reactions: req.body } },
          {new: true, runValidators: true}
        )
          .then((dbThoughtData) => {
            if (!dbThoughtData) {
              return res.status(404).json({ message: 'thought not found with id' });
            }
            res.json(dbThoughtData);
          });
      },
      
      removeReaction(req, res) {
        Thought.findOneAndUpdate(
          { _id: req.params.thoughtId },
          { $pull: { reactions: { reactionId: req.params.reactionId } } },
          { new: true}
        ).then((dbThoughtData) => {
            if (!dbThoughtData) {
              return res.status(404).json({ message: 'thought not found with id' });
            }
            res.json(dbThoughtData);
          });
      }
};

module.exports = thoughtController;