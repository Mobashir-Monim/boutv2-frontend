class EvaluationQuestionHelper {
    constructor(
        year,
        semester,
        questions = {
            theory: { course: {}, faculty: {} },
            lab: { course: {}, faculty: {} }
        }
    ) {
        this.year = year;
        this.semester = semester;
        this.questions = questions;
        this.target = {
            part: "theory",
            type: "course"
        }
    }

    updateTarget(part, type) {
        this.target = {
            part: part,
            type: type
        }

        return this;
    }
}