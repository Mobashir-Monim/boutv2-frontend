import { deepCopy } from "@firebase/util";
import React, { useEffect, useState, SetStateAction } from "react";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import SecondaryButton from "../../components/Buttons/SecondaryButton";
import SimpleCard from "../../components/Card/SimpleCard";
import { LineInput, TextInput } from "../../components/FormInputs/LabeledInputs";
import { getOfferedSections, setOfferedSection } from "../../db/remote/course";
import { getFacultyMemberByInitials, getFacultyMemberByUsisInitials } from "../../db/remote/faculty";
import { useLoadingScreen } from "../../utils/contexts/LoadingScreenContext";
import { useModal } from "../../utils/contexts/ModalContext";
import { deepClone } from "../../utils/functions/deepClone";
import { useSemesterSelect } from "../../utils/hooks/useSemesterSelect";
import { bgColorStyles, borderColorStyles, pageLayoutStyles, transitioner } from "../../utils/styles/styles";

const RoutineConfig = () => {
    const { showModal } = useModal();
    const { showLoadingScreen, hideLoadingScreen } = useLoadingScreen();
    const [filterSettings, setFilterSettings] = useState({ code: "", section: "", email: "" });
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [courses, setCourses] = useState([]);
    const [facultyDetails, setFacultyDetails] = useState({});
    const [contentDisplay, setContentDisplay] = useState({ courses: true, bulk_add: false, single_add: false });
    const [bulkInput, setBulkInput] = useState({ text: "", formatted: [] });

    const updateFilterSettings = (event, target) => {
        const filterSettingsClone = deepCopy(filterSettings);
        filterSettingsClone[target] = target === "code" ? event.target.value.toUpperCase() : event.target.value;
        setFilterSettings(filterSettingsClone);
    }

    const confirmSemester = async () => {
        if (semesterSelection.isValidSelection()) {
            showLoadingScreen("Fetching courses, please wait...")
            const coursesTemp = await getOfferedSections({ semester: semesterSelection.values.semester, year: semesterSelection.values.year });
            setCourses(coursesTemp);
            setFilteredCourses(coursesTemp[0][1] ? coursesTemp : []);
            setSelectedSem({ ...semesterSelection.values });
            hideLoadingScreen();
        } else {
            showModal("INVALID SEMESTER", "Please select a valid semester and year");
        }
    }

    const semesterSelection = useSemesterSelect(confirmSemester);
    const [selectedSem, setSelectedSem] = useState({ ...semesterSelection.values });

    useEffect(() => {
        filterCourses();
    }, [filterSettings]);

    const filterCourses = () => {
        if (filterSettings.email !== "") {
            filterUsingEmail();
        } else {
            filterUsingCodeSection();
        }
    }

    const filterUsingEmail = () => {
        setFilteredCourses(courses.filter(course => {
            for (let prefix of ["theory", "lab"]) {
                for (let inst of course[0][`${prefix}_instructor_emails`]) {
                    if (inst.startsWith(filterSettings.email))
                        return true;
                }
            }

            return false;
        }))
    }

    const filterUsingCodeSection = () => {
        let filtered = courses;

        if (filterSettings.code !== "")
            filtered = filtered.filter(course => course[0].code.startsWith(filterSettings.code));

        if (filterSettings.section !== "")
            filtered = filtered.filter(course => course[0].section === filterSettings.section);

        setFilteredCourses(filtered);
    }

    const displayCourseInstructors = course => <div className="px-5 py-2 flex flex-col gap-5">
        {
            ["theory", "lab"].map((prefix) =>
                course[0][`${prefix}_instructor_emails`].length > 0 ?
                    <div className="flex flex-col gap-1" key={prefix}>
                        <h3 className={`${borderColorStyles.simple} border-b-4`}>{prefix.slice(0, 1).toUpperCase()}{prefix.slice(1)}</h3>
                        <div className="flex flex-row gap-3">
                            {displayInstructors(course, prefix)}
                        </div>
                    </div>
                    :
                    <React.Fragment key={prefix}></React.Fragment>
            )
        }
    </div>

    const updateBulkInput = event => {
        const bulkInputClone = deepClone(bulkInput);
        bulkInputClone.text = event.target.value;
        bulkInputClone.formatted = [];

        try {
            for (let row of bulkInputClone.text.split("\n")) {
                let parts = row.split("\t");

                bulkInputClone.formatted.push({
                    code: parts[0].replaceAll(" ", "").split("-")[0],
                    section: `${parseInt(parts[0].replaceAll(" ", "").split("-")[1])}`,
                    theory_instructor_initials: parts[1].replaceAll(" ", "").split(",").filter(p => p !== ""),
                    lab_instructor_initials: parts[2].replaceAll(" ", "").split(",").filter(p => p !== ""),
                    semester: selectedSem.semester,
                    year: selectedSem.year,
                });
            }
        } catch (error) {
            if (event.target.value !== "")
                alert("Invalid Format")
        }

        setBulkInput(bulkInputClone);
    }

    const getExistingSection = async (code, section) => await getOfferedSections({
        semester: selectedSem.semester,
        year: selectedSem.year,
        section,
        code
    });

    const getFacultyDetails = async (initials) => {
        if (!facultyDetails[initials]) {
            let facultyDetailsClone = deepCopy(facultyDetails);
            let faculty = (await getFacultyMemberByInitials({ initials }))[0][0];

            if (faculty === null)
                faculty = (await getFacultyMemberByUsisInitials({ initials }))[0][0];

            facultyDetailsClone[initials] = {
                name: faculty ? faculty.name : "NOT FOUND",
                email: faculty ? faculty.email : "NOT FOUND"
            }

            setFacultyDetails(facultyDetailsClone);
            return facultyDetailsClone[initials];
        }

        return facultyDetails[initials];
    }

    const setFacultyInfo = async (section) => {
        for (let prefix of ["theory", "lab"]) {
            if (!Object.keys(section).includes(`${prefix}_instructor_emails`))
                section[`${prefix}_instructor_emails`] = [];

            if (!Object.keys(section).includes(`${prefix}_instructor_names`))
                section[`${prefix}_instructor_names`] = [];

            for (let i in section[`${prefix}_instructor_initials`]) {
                const faculty = await getFacultyDetails(section[`${prefix}_instructor_initials`][i]);
                section[`${prefix}_instructor_names`][i] = faculty.name;
                section[`${prefix}_instructor_emails`][i] = faculty.email;
            }
        }
    }

    const addOfferedSection = async (section) => {
        const existing = await getExistingSection(section.code, section.section);

        if (existing[0][1])
            section = { ...existing, ...section, id: existing[0][1] };

        await setFacultyInfo(section);
        await setOfferedSection(section);
    }

    const bulkAdd = async () => {
        showLoadingScreen("This may take some time. Do not close the window.");

        for (let section of bulkInput.formatted)
            await addOfferedSection(section);

        hideLoadingScreen();
    }

    const getContentHeight = content => contentDisplay[content] ?
        "max-h-[calc(100vh-70px-2.5rem)] md:max-h-[calc(65vh-2.5rem)]" :
        "max-h-[0vh]";

    const toggleDisplayContent = content => setContentDisplay({
        courses: content === "courses",
        bulk_add: content === "bulk_add",
        single_add: content === "single_add"
    });

    const displayInstructors = (course, prefix) => course[0][`${prefix}_instructor_emails`].map((_, index) => <div
        className={`flex flex-col gap-1 p-2 ${bgColorStyles.inverse} rounded-2xl text-[0.9rem] w-[calc(50%-0.75rem/2)]`}
        key={index}
    >
        <span className="flex flex-row gap-3">
            <span className="material-icons-round text-[1rem] my-auto">person</span>
            <span className="my-auto">{course[0][`${prefix}_instructor_names`][index]}, {course[0][`${prefix}_instructor_initials`][index]}</span>
        </span>
        <span className="flex flex-row gap-3">
            <span className="material-icons-round text-[1rem] my-auto">email</span>
            <span className="my-auto">{course[0][`${prefix}_instructor_emails`][index]}</span>
        </span>
    </div>);

    const bulkInputSampleRow = <tr>
        <td className={`border-2 text-center text-[0.7rem] ${borderColorStyles.simple} py-[2px]`}>[ CODE ]-[ SECTION ]</td>
        <td className={`border-2 text-center text-[0.7rem] ${borderColorStyles.simple} py-[2px]`}>[ THEORY FACULTY INITIALS ]</td>
        <td className={`border-2 text-center text-[0.7rem] ${borderColorStyles.simple} py-[2px]`}>[ LABS FACULTY INITIALS ]</td>
    </tr>;

    const bulkInputContent = <div className="flex flex-col gap-5 w-[100%]">
        <h3 className="text-[1.2rem]">Please enter the courses in the following format</h3>
        <table className="w-[100%]">
            <tbody>
                {bulkInputSampleRow}
                {bulkInputSampleRow}
                <tr><td className={`border-2 text-center text-[1rem] ${borderColorStyles.simple}`} colSpan={3}>...</td></tr>
                {bulkInputSampleRow}
            </tbody>
        </table>
        <div className="flex flex-col justify-between gap-5">
            <TextInput label={"All Courses"} value={bulkInput.text} onChangeFn={event => updateBulkInput(event)} customStyle={{ input: "max-h-[100px]", container: "w-[100%]" }} />
            <div className="flex flex-row justify-center gap-5">
                <PrimaryButton text={<span className="material-icons-round mx-auto text-[1.5rem]">add</span>} customStyle={"flex justify-center flex-col !rounded-full"} clickFunction={bulkAdd} />
                <SecondaryButton text={<span className="material-icons-round mx-auto text-[1.5rem]">close</span>} customStyle={"flex justify-center flex-col !rounded-full"} clickFunction={() => toggleDisplayContent("courses")} />
            </div>
        </div>
    </div>;

    const getFilteredCourses = () => {
        if (filteredCourses.length === 0)
            return <SimpleCard showTitle={false}>
                <div className="p-5 text-center">
                    Nothing to show
                </div>
            </SimpleCard>

        return filteredCourses.slice(0, 20).map((course, courseIndex) => <SimpleCard
            title={`${course[0].code} - ${course[0].section}`}
            key={courseIndex}
        >
            {displayCourseInstructors(course)}
        </SimpleCard>)
    }


    return <div className={`${pageLayoutStyles.scrollable} flex flex-col md:flex-row gap-10 flex-wrap`}>
        <div className="w-[100%] md:w-[calc(40%-1.25rem)] flex flex-col gap-10">
            {semesterSelection.semesterSelect}
            <SimpleCard
                title={`Admin Console [${selectedSem.year} ${selectedSem.semester}]`}
                customStyle={selectedSem.semester && selectedSem.year ? "" : "hidden"}
            >
                <div className="p-5 flex flex-col gap-5">
                    <PrimaryButton text={"Single Add"} clickFunction={() => toggleDisplayContent("single_add")} />
                    <PrimaryButton text={"Bulk Add"} clickFunction={() => toggleDisplayContent("bulk_add")} />
                </div>
            </SimpleCard>
        </div>
        <div className="w-[100%] md:w-[calc(60%-1.25rem)] flex flex-col gap-10">
            <SimpleCard title={"Search Panel"}>
                <div className="p-5 flex flex-col gap-5">
                    <div className="flex flex-row gap-5">
                        <LineInput
                            label={"Code"}
                            onChangeFn={event => updateFilterSettings(event, "code")}
                            customStyle={{ container: "w-[calc(50%-1.25rem/2)]" }}
                            value={filterSettings.code}
                        />
                        <LineInput label={"Section"}
                            onChangeFn={event => updateFilterSettings(event, "section")}
                            customStyle={{ container: "w-[calc(50%-1.25rem/2)]" }}
                            value={filterSettings.section}
                        />
                    </div>
                    <div className="flex flex-row gap-5">
                        <LineInput
                            label={"Email"}
                            onChangeFn={event => updateFilterSettings(event, "email")}
                            customStyle={{ container: "w-[100%]" }}
                            value={filterSettings.email}
                        />
                    </div>
                </div>
            </SimpleCard>
            <div className={`flex flex-col overflow-scroll no-scroll-bar ${getContentHeight("courses")} gap-5 ${transitioner.simple}`}>
                {getFilteredCourses()}
            </div>
            <div className={`flex flex-col overflow-scroll no-scroll-bar ${getContentHeight("bulk_add")} gap-5 ${transitioner.simple}`}>
                <SimpleCard title={"Bulk Add Courses"}>
                    <div className="p-5">
                        {bulkInputContent}
                    </div>
                </SimpleCard>
            </div>
            {/* <div className={`flex flex-col overflow-scroll no-scroll-bar ${getContentHeight("single_add")} gap-5 ${transitioner.simple}`}>
                {getFilteredCourses()}
            </div> */}
        </div>
    </div>
}

export default RoutineConfig;