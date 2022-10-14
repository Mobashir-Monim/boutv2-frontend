import { hasRole } from "./middlewares/hasRole";
import { isAuthenticated } from "./middlewares/isAuthenticated";
import { isFaculty } from "./middlewares/isFaculty";
import { isOrganizationMember } from "./middlewares/isOrganizationMember";
import { isStudent } from "./middlewares/isStudent";

export const middlewares = {
    auth: { middleware: isAuthenticated },
    faculty: { middleware: isFaculty },
    student: { middleware: isStudent },
    orgMember: { middleware: isOrganizationMember },
    hasRole: { middleware: hasRole, isAsync: true }
};