const { User } = require('../models');
const { signToken } = require("../utils/auth");
const { AuthenticationError } = require("apollo-server-express");

const resolvers = {
    Query: {
        me: async (parents, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id})
                .select('-__v -password');

                return userData;
            }
            throw new AuthenticationError("No user found. Please login or register");
        }
    },
    Mutation: {
        createUser: async (parents, args, context) => {
            const user = await User.create(args);
            const token = signToken(user);

            return { token, user };
        },

        loginUser: async (parent, args, context) => {
            const { email, password } = args;
            const user = await User.findOne({email})
            if (!user) {
                throw new AuthenticationError("No user found with that email address.");
            }
            const correctPassword = await user.isCorrectPassword(password);
            if (!correctPassword) {
                throw new AuthenticationError("Incorrect password.");
            }
            const token = signToken(user);
            return { token, user };
        },

        saveBook: async (parent, args, context) => {
            if (context.user) {
                return User.findOneAndUpdate(
                    {_id: context.user._id},
                    { $addToSet: {savedBooks: {body}}},
                    { new: true, runValidators: true}
                );
            } else {            
                throw new AuthenticationError("Please login or register to save a book.");
            }
        },

        deleteBook: async (parent, args, context) => {
            if (context.user) {
              // Your delete book logic here
              return User.findOneAndUpdate(
                { _id: context.user._id },
                { $pull: { savedBooks: { bookId: params.bookId } } },
                { new: true }
              );
            } else {
              throw new AuthenticationError("Please log in to delete a book.");
            }
          }
        
    }
}