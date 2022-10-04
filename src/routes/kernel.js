import { isAuthenticated } from "./middlewares/isAuthenticated";
import { isFaculty } from "./middlewares/isFaculty";
import { isOrganizationMember } from "./middlewares/isOrganizationMember";
import { isStudent } from "./middlewares/isStudent";

export const middlewares = {
    auth: isAuthenticated,
    faculty: isFaculty,
    student: isStudent,
    orgMember: isOrganizationMember
};