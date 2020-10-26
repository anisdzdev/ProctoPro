const Joi = require('joi');
const mongoose = require('mongoose');

const exam_schema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 255
    },
    exam_id: {
        type: Number,
        required: true,
        length: 10,
        default: function () {
            return Math.floor(100000000 + Math.random() * 900000000);
        }
    },
    time: {
        type: Number,
        default: 0
    },
    data: {
        type: String,
        required: true
    },
    numberOfSubmissions: {
        type: Number,
        default: 0
    },
    submissions: [{
        id: String,
        user: String,
    }],
    available: {
        type: Boolean,
        default: true
    }
});

const Exam = mongoose.model('Exams', exam_schema);


function validateExam(exam) {
    const schema = Joi.object({
        title: Joi.string().min(5).max(50).required(),
        time: Joi.number()
    });

    return schema.validate(exam);
}

exports.exam_schema = exam_schema;
exports.Exam = Exam;
exports.validate = validateExam;