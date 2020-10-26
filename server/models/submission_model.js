const Joi = require('joi');
const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    user: {
        id: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        }
    },
    exam: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    data: {
        type: String,
    },
    typing_dna_match: {
        matching_percent: Number,
        match: Boolean
    },
    cancelled: {
        type: Boolean,
        default: false
    },
    finished: {
        type: Boolean,
        default: false
    }
});

submissionSchema.statics.lookup = function (userId, examId) {
    return this.findOne({
        'user._id': userId,
        'exam': examId,
    });
}

const Submission = mongoose.model('Submission', submissionSchema);

function validateSubmission(submission) {
    const schema = Joi.object({
        exam_id: Joi.string().required(),
        tp: Joi.string(),
        cancelled: Joi.boolean()
    });

    return schema.validate(submission);
}

function validatePresubmission(submission) {
    const schema = Joi.object({
        exam_id: Joi.string().required(),
    });

    return schema.validate(submission);
}

exports.Submission = Submission;
exports.validate = validateSubmission;
exports.validatepre = validatePresubmission;