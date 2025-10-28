const mongoose = require('mongoose');

// This is a minimal schema required to satisfy the 'ref: "User"' 
// in the Post model until Task 5 when we implement full user authentication.
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    // We only need a single required field to make this model functional for now.
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
