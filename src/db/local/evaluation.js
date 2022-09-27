export const getEvaluationQuestions = (semester, year) => {
    let questions = null;

    try {
        questions = JSON.parse(localStorage.getItem(`${year}-${semester}`));
        return questions;
    } catch (error) {
        return null;
    }
}

export const setEvaluationQuestions = (questions, semester, year) => {
    questions = typeof (questions) === "string" ? questions : JSON.stringify(questions);
    localStorage.setItem(`${year}-${semester}`, questions);
}

export const getEvaluationReport = (course, section, part) => {
    let report = null;

    try {
        report = JSON.parse(localStorage.getItem(`${course}-${section}-${part}`));
        return report;
    } catch (error) {
        return null;
    }
}

export const setEvaluationReport = (report, course, section, part) => {
    report = typeof (report) === "string" ? report : JSON.stringify(report);
    localStorage.setItem(`${course}-${section}-${part}`, report);
}