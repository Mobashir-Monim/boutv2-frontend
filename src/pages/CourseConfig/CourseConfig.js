import { useNavigate } from "react-router-dom";
import SimpleCard from "../../components/Card/SimpleCard";
import { useAuth } from "../../utils/contexts/AuthContext";
import { pageLayoutStyles } from "../../utils/styles/styles";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import SecondaryButton from "../../components/Buttons/SecondaryButton";
import { LineInput, TextInput } from "../../components/FormInputs/MinifiedInputs";
import { setOfferedSection } from "../../db/remote/course";
import { v4 as uuidv4 } from "uuid";

const CourseConfig = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const charList = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    if (user.uid !== "36QlTRZox2Oc6QEqVFdSSK8eg4y1") navigate("/");

    const randGen = (idList = []) => {
        let id = "";

        do {
            id = "";
            while (id.length !== 10)
                id = `${id}${charList[Math.floor(Math.random() * charList.length)]}`;
        } while (idList.includes(id));

        idList.push(id);

        return id;
    }

    const getTemplate = (code, section) => {
        return {
            code: code,
            section: section,
            year: "2022",
            semester: "Summer",
        }
    }

    const tempFunc = async event => {
        let sections = [], idList = [], parts = ["lab", "theory"], markers = [2, 5, 8];
        const lines = event.target.value.split("\n");

        for (let l in lines) {
            const lab_link = randGen(idList);
            const theory_link = randGen(idList);
            const line = lines[l].split("\t");
            sections.push(getTemplate(line[0], line[1]));

            for (let x in parts) {
                sections[l][`${parts[x]}_evaluation_link`] = parts[x] === "lab" ? lab_link : theory_link;
                sections[l][`${parts[x]}_evaluation`] = "";
                sections[l][`${parts[x]}_instructors`] = [];
            }

            for (let z in markers) {
                if (line[markers[z]] !== "") {
                    sections[l][markers[z] === 2 ? "theory_instructors" : "lab_instructors"].push({
                        initials: line[markers[z]],
                        name: line[markers[z] + 1],
                        email: line[markers[z] + 2]
                    });
                }
            }
        }
    }

    return <div className={`${pageLayoutStyles.scrollable}`}>
        <div className="flex flex-col md:flex-row gap-5 mb-10">
            <div className="w-[60%]">
                <SimpleCard title={"Course Config Admin Console"}>
                    <div className="mt-5 flex flex-row gap-5">
                        <SecondaryButton text={"Configure Courses"} type={"button"} />
                    </div>
                </SimpleCard>
            </div>
        </div>
        <SimpleCard title={"Course Config"}>
            <div className="flex flex-col mt-5">
                <div className="flex flex-row">
                    <span className="w-[20%] border-b-2">Entity</span>
                    <span className="w-[7%] border-b-2">Code</span>
                    <span className="w-[23%] border-b-2">Name</span>
                </div>
                <div className="flex flex-row">
                    <LineInput customStyle={"w-[20%]"} />
                    <LineInput customStyle={"w-[7%]"} />
                    <LineInput customStyle={"w-[23%]"} />
                </div>
                <div className="flex flex-row">
                    <LineInput customStyle={"w-[20%]"} />
                    <LineInput customStyle={"w-[7%]"} />
                    <LineInput customStyle={"w-[23%]"} />
                </div>
                <div className="flex flex-row">
                    <LineInput customStyle={"w-[20%]"} />
                    <LineInput customStyle={"w-[7%]"} />
                    <LineInput customStyle={"w-[23%]"} />
                </div>
                <div className="flex flex-row">
                    <LineInput customStyle={"w-[20%]"} />
                    <LineInput customStyle={"w-[7%]"} />
                    <LineInput customStyle={"w-[23%]"} />
                </div>
                {/* <TextInput onChangeFn={tempFunc} /> */}
            </div>
        </SimpleCard>
    </div>
}

export default CourseConfig;