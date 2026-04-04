const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: true,
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],

  description: {
    type: String,
    default: ""
  },

  notes: [
    {
      title: String,
      content: String,
      createdAt: {
        type: Date,
        default: Date.now
      },
      addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    }
  ],

  codeFiles: [
    {
      fileName: String,
      content: String,
      addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    }
  ],

  createdAt: {
    type: Date,
    default: Date.now
  },

  isPublic: {
    type: Boolean,
    default: false
  },

  publicId: {
    type: String,
    unique: true,
    sparse: true
  }
});

module.exports = mongoose.model("Project", projectSchema);