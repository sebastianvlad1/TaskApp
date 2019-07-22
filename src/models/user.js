const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        min: [0, 'Age must be a positive number!!'],
        default: 0
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid!');
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: [6, 'Password must have at least 6 characters.'],
        validate(pass) {
            if (pass.toLowerCase().includes('password')) {
                throw new Error("Password cannot contain word 'password'!");
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
}); 

// virtual proprerty (relation between two entitites) mongoose
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON = function(){
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;

    return userObject;
}

// methods are accessable by instances
userSchema.methods.generateAuthToken = async function() {
    const user = this;

    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
}

// static methods are accessable by models
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });
    if(!user) {
        console.log('User email could not be found...');
        throw new Error('User email could not be found...');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch) {
        console.log('Unable to login...');
        throw new Error('Unable to login...');
    }
    return user;
}

// Hash password
userSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
});

userSchema.pre('remove', async function(next){
    const user = this;
    await Task.deleteMany({ owner: user._id });
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;