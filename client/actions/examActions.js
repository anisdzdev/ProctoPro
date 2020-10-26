import axios from 'axios';

export function loadExam(exam_id) {
    const bodyFormData = new FormData();
    bodyFormData.append('id', exam_id);
    return dispatch => {
        return axios.post('/api/exams/load', bodyFormData).then(res => {
            return {exam_data: res.data};
        }).catch(err => {
            return {error: err};
        });
    };
}

export function startExam(exam_id) {
    const bodyFormData = new FormData();
    bodyFormData.append('exam_id', exam_id);

    return dispatch => {
        return axios.post('/api/submissions/start', bodyFormData);
    };
}

export function loadQuestions(exam_file) {
    return dispatch => {
        return axios.get(`/api/exam_files/${exam_file}`).then(res => {
            console.log(res.data);
            return {exam_file: res.data};
        }).catch(err => {
            return {error: err};
        });
    };
}

export function submitExam(data, file) {
    const bodyFormData = new FormData();
    bodyFormData.append('exam_id', data.exam_id);
    bodyFormData.append('tp', data.tp);
    bodyFormData.append('data', file);
    bodyFormData.append('cancelled', data.cancelled);

    return dispatch => {
        return axios.post('/api/submissions/new', bodyFormData).then(res => {
            return {response: res.data};
        }).catch(err => {
            return {error: err};
        });
    };
}

