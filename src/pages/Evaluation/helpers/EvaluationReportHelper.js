import { getOfferedSections } from "../../../db/remote/course";
import { getEvaluationReport, setEvaluationReport } from "../../../db/local/evaluation";
import { getEvaluationSubmissions } from "../../../db/remote/evaluation";
import { deepClone } from "../../../utils/functions/deepClone";

class EvaluationReportHelper {
    constructor(
        code,
        section,
        part,
        evaluationInstance,
        questions
    ) {
        this.code = code;
        this.section = section;
        this.part = part;
        this.evaluationInstance = evaluationInstance;
        this.questions = questions;
        this.report = getEvaluationReport(code, section, part);
    }

    async generateReport() {
        if (!this.report) {
            this.offeredSection = await this.getOfferedSection();
            this.submissions = await this.getSubmissions();
            this.submissions = this.restructureSubmissions();
            this.allQuestions = JSON.parse(JSON.stringify(this.getAllQuestions()));
            this.generateReportObject();
        }

        return this.report;
    }

    async getOfferedSection() {
        return (await getOfferedSections({
            section: this.section,
            code: this.code,
            year: this.evaluationInstance.year,
            semester: this.evaluationInstance.semester
        }))[0];
    }

    async getSubmissions() {
        return await getEvaluationSubmissions({
            offered_section_id: this.offeredSection[1],
            part: this.part
        });
    }

    getAllQuestions() {
        let allQuestions = [];
        this.restructureQuestions("course").forEach(q => allQuestions.push(q));

        for (let f in this.offeredSection[0][`${this.part}_instructor_emails`])
            this.restructureQuestions("faculty", this.offeredSection[0][`${this.part}_instructor_emails`][f], f).forEach(q => allQuestions.push(q));

        return allQuestions;
    }

    restructureQuestions(target, imm, immIndex) {
        let restructuredQuestions = [];

        for (let id in this.questions[this.part][target]) {
            const question = this.questions[this.part][target][id];
            const aggregatable = this.isAggregatable(question);
            const questionId = `${target}${imm ? `--${imm}` : ""}--${id}`;
            const replaceId = imm ? `${target}--${immIndex}--${id}` : questionId;
            const stats = this.getQuestionStatsObject(question);

            if (question.type.includes("Grid")) {
                for (let r in question.rows)
                    this.pushCourseQuestions(
                        restructuredQuestions,
                        `${question.display} [${question.rows[r]}]`,
                        `${questionId}--${r}`,
                        `${replaceId}--${r}`,
                        question.type.replace("Grid", ""),
                        aggregatable,
                        stats);
            } else {
                this.pushCourseQuestions(
                    restructuredQuestions,
                    question.display,
                    questionId,
                    replaceId,
                    question.type,
                    aggregatable,
                    stats);
            }
        }

        return restructuredQuestions;
    }

    restructureSubmissions() {
        let submissions = [];

        if (this.submissions[0][1]) {
            this.submissions.forEach(submission => {
                let temp = {};

                for (let r in submission[0].response) {
                    if (typeof submission[0].response[r] === "string" || Array.isArray(submission[0].response[r])) {
                        temp[r] = submission[0].response[r];
                    } else {
                        for (let rp in submission[0].response[r]) {
                            temp[rp] = submission[0].response[r][rp]
                        }
                    }
                }

                submissions.push(temp);
            });
        }

        return submissions;
    }

    getQuestionStatsObject(question) {
        let stats = {};

        if (question.type === "short" || question.type === "paragraph") {
            stats = [];
        } else if (question.type === "linear") {
            for (let i = parseInt(question.columns[0]); i <= parseInt(question.columns[1]); i++) stats[i] = 0;
        } else if (question.type.includes("Grid")) {
            question.columns.forEach(c => stats[c] = 0);
        } else {
            question.rows.forEach(r => stats[r] = 0);
        }

        return stats;
    }

    pushCourseQuestions(courseQuestions, display, id, replaceId, type, aggregatable, stats) {
        courseQuestions.push({ display, id, replaceId, type, aggregatable, stats })
    }

    constructReportObject() {
        this.report = {
            submissions: this.submissions.length,
            statistical: deepClone(this.allQuestions),
            analytical: null
        };
    }

    isAggregatable(question) {
        const type = question.type;
        const options = type === "radioGrid" ? question.columns : question.rows;

        if (type === "linear")
            return true;

        if (type === "radio" || type === "radioGrid" || type === "dropdown") {
            let numberCount = 0;
            options.forEach(option => numberCount += isNaN(parseInt(option)) ? 0 : 1);
            return numberCount + 2 >= options.length && numberCount >= 3;
        }

        return false;
    }

    generateReportObject() {
        for (let i in this.submissions) {
            const submission = this.submissions[i];
            for (let q in submission) {
                if (this.isValidValue(submission[q])) {
                    const question = this.findQuestion(q);

                    if (this.isTextAnswer(question)) {
                        question.stats.push(submission[q]);
                    } else if (this.isCheckboxAnswer(question)) {
                        submission[q].forEach(s => { question.stats[s] += 1; });
                    } else {
                        question.stats[submission[q]] += 1;
                    }

                    if (question.aggregatable) {
                        let num = parseInt(submission[q]);

                        if (!("average" in question))
                            question.average = { sum: 0, count: 0 };

                        if (!isNaN(num)) {
                            question.average.sum += num;
                            question.average.count += 1;
                        }
                    }
                }
            }
        }

        this.constructReportObject();
        setEvaluationReport(this.report, this.code, this.section, this.part);
    }

    isValidValue(value) {
        return value !== "" && value !== undefined && value !== null
    }

    findQuestion(q) {
        return this.allQuestions.find(r => r.replaceId === q);
    }

    isTextAnswer(question) {
        return question.type === "short" || question.type === "paragraph";
    }

    isCheckboxAnswer(question) {
        return question.type === "checkbox";
    }

    isSingleValueAnswer(question) {
        return question.type === "radio" || question.type === "linear" || question.type === "dropdown";
    }
}

export default EvaluationReportHelper;