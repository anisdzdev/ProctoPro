const {Submission, validate, validatepre} = require('../models/submission_model');
const {Exam} = require('../models/exam_model');
const {User} = require('../models/user_model');
const {promisify} = require('util');
const auth = require('../middleware/auth');
const dna = require('../middleware/dna_check');
const multer = require("multer");
const mongoose = require('mongoose');
const Fawn = require('fawn');
const express = require('express');
const fs = require('fs');

const router = express.Router();
const unlinkAsync = promisify(fs.unlink);
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'server/submissions/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '_' + uniqueSuffix + ".txt")
    }
});
let upload = multer({storage: storage});
Fawn.init(mongoose);

router.get('/all/', [auth, upload.none()], async (req, res) => {
    const submissions = await Submission.find({exam: req.body.exam_id});
    res.send(submissions);
});

router.get('/specific/', [auth, upload.none()], async (req, res) => {
    const submission = await Submission.findById(req.body.id);

    if (!submission) return res.status(404).send('The submission with the given ID was not found.');

    res.send(submission);
});

router.post('/start/', [auth, upload.none()], async (req, res) => {

    const {error} = validatepre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findById(req.user._id);
    if (!user) return res.status(400).send('Invalid user.');

    const exam = await Exam.findOne({exam_id: req.body.exam_id});
    if (!exam) return res.status(400).send('Invalid exam.');

    if (exam.available === false) return res.status(400).send('Exam not available.');

    if (req.body.exam_id !== '100000000') {
        let submission = new Submission({
            user: {
                id: user._id,
                name: user.name
            },
            exam: exam._id,
            finished: false,
        });
        let done_exams = user.done_exams;
        let submissions = exam.submissions;
        let update_in_exam = {id: submission._id, user: user._id};
        done_exams.indexOf(exam._id) === -1 ? done_exams.push(exam._id) : console.log("This item already exists");
        submissions.indexOf(submission._id) === -1 ? submissions.push(update_in_exam) : console.log("This item already exists");

        try {
            new Fawn.Task()
                .save('submissions', submission)
                .update('exams', {_id: exam._id}, {
                    $inc: {numberOfSubmissions: +1},
                    submissions: submissions
                })
                .update('users', {_id: user._id}, {done_exams: done_exams})
                .run();
            console.log('user : ' + user._id);
            console.log('exam : ' + exam._id);
            res.send(submission);
        } catch (ex) {
            res.status(500).send('Something failed.' + ex);
        }
    } else {
        res.send(exam);
    }
});


router.post('/new/', [auth, upload.single('data'), dna], async (req, res) => {
    const file = req.file;
    if (!file) {
        const error = new Error('Please upload a file');
        error.httpStatusCode = 400;
        return res.status(400).send(error.message);
    } else {
        const {error} = validate(req.body);
        if (error) {
            await unlinkAsync(req.file.path);
            return res.status(400).send(error.details[0].message);
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            await unlinkAsync(req.file.path);
            return res.status(400).send('Invalid user.');
        }

        const exam = await Exam.findOne({exam_id: req.body.exam_id});
        if (!exam) {
            await unlinkAsync(req.file.path);
            return res.status(400).send('Invalid exam.');
        }

        if (exam.available === false) {
            await unlinkAsync(req.file.path);
            return res.status(400).send('Exam not available.');
        }

        if (req.body.exam_id !== '100000000') {
            let submission = await Submission.findOneAndUpdate({
                'user.id': user._id,
                exam: exam._id
            }, {
                typing_dna_match: {
                    matching_percent: req.dna.matching_percent,
                    match: req.dna.match
                },
                data: req.file.filename,
                cancelled: req.body.cancelled,
                finished: true,
            }, {
                new: true
            });
            if (!submission) {
                await unlinkAsync(req.file.path);
                console.log('submission not found');
                console.log('user : ' + user._id);
                console.log('exam : ' + exam._id);
                return res.status(400).send('Invalid Submission.');
            }

            res.send(submission);
        } else {
            const result = {
                typing_dna_match: {
                    matching_percent: req.dna.matching_percent,
                    match: req.dna.match
                }
            }
            await unlinkAsync(req.file.path);
            res.send(result);
        }
    }
});

module.exports = router; 