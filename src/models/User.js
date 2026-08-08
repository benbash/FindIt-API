<<<<<<< HEAD
import mongoose from "mongoose";

=======
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
>>>>>>> origin/master

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
<<<<<<< HEAD
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
       type: String,
       required: true,
       trim: true,
    },

    lga: {
       type: String,
       required: true,
       trim: true,
    }, 
     
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

=======
      trim: true,
      default: '',
    },
    name: {
      type: String,
      trim: true,
      default: '',
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/,
        'Please add a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    phoneNumber: {
      type: String,
      required: [true, 'Please add a phone number'],
      trim: true,
    },
    state: {
      type: String,
      trim: true,
      default: '',
    },
    lga: {
      type: String,
      trim: true,
      default: '',
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'customer', 'vendor', 'rider'],
      default: 'user',
    },
>>>>>>> origin/master
    isVerified: {
      type: Boolean,
      default: false,
    },
<<<<<<< HEAD

    resetPasswordToken: {
     type: String,
    },

    resetPasswordExpires: {
     type: Date,
    },
  },

=======
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
  },
>>>>>>> origin/master
  {
    timestamps: true,
  }
);

<<<<<<< HEAD
const User = mongoose.model("User", userSchema);

export default User;
=======
userSchema.pre('validate', function () {
  if (!this.fullName && this.name) {
    this.fullName = this.name;
  }

  if (!this.name && this.fullName) {
    this.name = this.fullName;
  }
});

userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);
>>>>>>> origin/master
