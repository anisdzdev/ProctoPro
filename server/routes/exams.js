const auth = require('../middleware/auth');
const {Exam, validate} = require('../models/exam_model');
const {promisify} = require('util');
const express = require('express');
const winston = require("winston");
const fs = require('fs');
const multer = require("multer");

const unlinkAsync = promisify(fs.unlink);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'server/exams/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '_' + uniqueSuffix + ".txt")
    }
});
let upload = multer({storage: storage});
const router = express.Router();


router.get('/all/', [auth, upload.none()], async (req, res) => {

    const exams = await Exam.find().sort('title');
    res.send(exams);
});

router.post('/load/', [auth, upload.none()], async (req, res) => {
    const exam = await Exam.findOne({exam_id: req.body.id});
    if (!exam) return res.status(404).send('The exam with the given ID was not found.');
    const submitted_by_user = await Exam.findOne({
        exam_id: req.body.id,
        submissions: {
            $elemMatch: {user: req.user._id}
        }
    });
    if (submitted_by_user) {
        console.log(submitted_by_user);
        return res.status(401).send('This user has already done the exam.');
    }
    res.send(exam);
});

router.post('/new/', [auth, upload.single('json_file')], async (req, res) => {

    const file = req.file;
    if (!file) {
        const error = new Error('Please upload a file');
        error.httpStatusCode = 400;
        return res.status(400).send(error.message);
    } else {
        const {error} = validate(req.body);
        console.log(req.body);
        if (error) {
            await unlinkAsync(req.file.path);
            return res.status(400).send(error.details[0].message);
        }

        const exam = new Exam({
            title: req.body.title,
            data: req.file.filename,
            time: req.body.time
        });
        await exam.save();

        res.send(exam);
        winston.info("New exam created!");
    }


});

router.delete('/:id', [auth, upload.none()], async (req, res) => {

    const exam = await Exam.findByIdAndRemove(req.params.id);
    if (exam) {
        const file = "./exams/" + exam.data;
        await unlinkAsync(file);
        winston.info("Exam and File deleted!");
    }

    if (!exam) return res.status(404).send('The exam with the given ID was not found.');

    res.send(exam);
});


module.exports = router;