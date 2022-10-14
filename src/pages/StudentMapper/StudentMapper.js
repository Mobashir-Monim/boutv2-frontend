import SimpleCard from "../../components/Card/SimpleCard";
import { borderColorStyles, pageLayoutStyles } from "../../utils/styles/styles";
import { SelectInput, TextInput } from "../../components/FormInputs/LabeledInputs";
import { useState } from "react";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import { deepClone } from "../../utils/functions/deepClone";
import { getStudents, setStudent } from "../../db/remote/student";
import { useLoadingScreen } from "../../utils/contexts/LoadingScreenContext";

const StudentMapper = () => {
    const { showLoadingScreen, hideLoadingScreen } = useLoadingScreen();
    const convertionOption = {
        student_id: "Student ID",
        lms_username: "LMS Username",
        personal_email: "Personal Email",
        official_email: "Student Email"
    };

    const [mapper, setMapper] = useState({
        from: null,
        to: null,
        inputs: [],
        mappedResults: [],
    });

    const updateConvertFrom = event => {
        const mapperClone = deepClone(mapper);
        mapperClone.from = event.target.value;
        setMapper(mapperClone);
    }

    const updateConvertTo = event => {
        const mapperClone = deepClone(mapper);
        mapperClone.to = event.target.value;
        setMapper(mapperClone);
    }

    const updateInputs = event => {
        const mapperClone = deepClone(mapper);
        let inputs = event.target.value.replaceAll(" ", "").split(",").join("\n").split("\n").filter(i => i !== "");

        if (inputs.length <= 100) {
            mapperClone.inputs = inputs;
            setMapper(mapperClone);
        } else {
            alert("Cannot map more than 100 items at a time.");
        }
    }

    const mapStudents = async () => {
        showLoadingScreen("Mapping Students");
        const mapperClone = deepClone(mapper);
        mapperClone.mappedResults = [];
        const res = await getStudents({ [`${mapperClone.from}s`]: mapperClone.inputs });

        for (let i = 0; i < mapperClone.inputs.length; i++) {
            let map = res.find(r => r[0][mapperClone.from] === mapperClone.inputs[i]);
            map = map ? map[0][mapperClone.to] : "Not Found";
            map = map === "" ? "Data not present" : map;
            mapperClone.mappedResults.push(map);
        }

        setMapper(mapperClone);
        hideLoadingScreen();
    }

    // const createStudentEntries = async event => {
    //     let inputs = event.target.value.replaceAll(" ", "").split("\n");
    //     let trials = 0;
    //     for (let index = 0; index < inputs.length;) {
    //         try {
    //             inputs[index] = inputs[index].split("\t");
    //             inputs[index] = {
    //                 department: "",
    //                 lms_username: inputs[index][4],
    //                 name: inputs[index][1],
    //                 official_email: inputs[index][3],
    //                 personal_email: inputs[index][2],
    //                 phone: "",
    //                 program: "",
    //                 school: "",
    //                 student_id: inputs[index][0]
    //             };

    //             inputs[index].res = (await getStudents({ student_ids: [inputs[index].student_id] }))[0];
    //             inputs[index].id = inputs[index].res[1];

    //             if (!inputs[index].id)
    //                 const docRef = await setStudent(inputs[index]);

    //             index += 1;
    //             trials = 0;
    //         } catch (error) {
    //             trials += 1;
    //             if (trials > 2) {
    //                 index += 1;
    //                 trials = 0;
    //             }
    //         }
    //     }

    // }

    return <div className={`${pageLayoutStyles.scrollable} flex flex-col gap-10`}>
        <div className="w-[100%] lg:w-[70%] mx-auto flex flex-col md:flex-row drop-shadow-lg">
            <SimpleCard title="Student Mapper">
                <div className="mt-5 flex flex-col">
                    <div className={`w-[100%] mx-auto flex flex-col gap-6 pb-5`}>
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="w-[100%]">
                                <SelectInput name="convert_from" label="Convert From" options={mapper.from ? convertionOption : { null: "Convert From", ...convertionOption }} customStyle={{ card: "!drop-shadow-none" }} onChangeFn={updateConvertFrom} value={mapper.from} />
                            </div>
                            <div className="w-[100%]">
                                <SelectInput name="convert_to" label="Convert to" options={mapper.to ? convertionOption : { null: "Convert To", ...convertionOption }} customStyle={{ card: "!drop-shadow-none" }} onChangeFn={updateConvertTo} value={mapper.to} />
                            </div>
                        </div>
                        <div className="w-[100%] flex flex-col">
                            <PrimaryButton customStyle={"py-1"} text={<div className="flex flex-col"><span className="material-icons-round rotate-90 text-[2rem]">arrow_forward_ios</span></div>} clickFunction={mapStudents} />
                        </div>
                    </div>
                    <div className={`w-[100%] pt-5 flex gap-10 flex-col md:flex-row`}>
                        <div className="w-[100%] md:w-[50%]">
                            <TextInput disabled={!mapper.from || !mapper.to} label={mapper.from && mapper.to ? `${convertionOption[mapper.from]}s` : `Select convertion types`} customStyle={{ input: "!min-h-[100px] md:!min-h-[300px] text-[0.8rem] max-h-[300px] md:max-h-[400px]" }} placeholder={mapper.from && mapper.to ? `${convertionOption[mapper.from]}s` : `Select convertion types`} onChangeFn={updateInputs} />
                        </div>
                        <div className="w-[100%] md:w-[50%]">
                            <TextInput label={`Mapped Output`} customStyle={{ input: "!min-h-[100px] md:!min-h-[300px] text-[0.8rem] max-h-[500px]" }} placeholder="Mapped results will be shown here" value={mapper.mappedResults.join("\n")} />
                        </div>
                    </div>
                </div>
            </SimpleCard>
        </div>
    </div>
}

export default StudentMapper;