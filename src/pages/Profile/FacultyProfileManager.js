import { useState } from "react";
import SimpleCard from "../../components/Card/SimpleCard";
import { TextInput } from "../../components/FormInputs/LabeledInputs";
import { getFacultyMemberByInitials, setFaculty } from "../../db/remote/faculty";
import { useLoadingScreen } from "../../utils/contexts/LoadingScreenContext";
import { pageLayoutStyles } from "../../utils/styles/styles";

const FacultyProfileManager = () => {
    const { showLoadingScreen, hideLoadingScreen } = useLoadingScreen();

    // const updateInput = async event => {
    //     showLoadingScreen();
    //     const headers = ["initials", "usis_initials", "name", "pin", "joining_date", "designation", "rank", "status", "degree", "room", "email", "ranks_tel", "phone", "personal_email", "discord_id", "departmental_duty"];
    //     const rows = event.target.value.split("\n");

    //     for (let r in rows) {
    //         let row = rows[r].split("\t");
    //         let insertable = { entity: "CSE" };

    //         const current = await getFacultyMemberByInitials({ initials: row[0] });

    //         if (current[0][1])
    //             insertable.id = current[0][1];

    //         for (let i in headers)
    //             insertable[headers[i]] = row[i];

    //         try {
    //             await setFaculty(insertable);
    //         } catch (error) {
    //             console.log(insertable);
    //             break;
    //         }
    //     }

    //     hideLoadingScreen();
    // }

    return <div className={`${pageLayoutStyles.scrollable} flex flex-col gap-10`}>
        <SimpleCard showTitle={false}>
            <div className="p-5 overflow-scroll h-[50vh] relative no-scroll-bar">

            </div>
        </SimpleCard>
    </div>
}

export default FacultyProfileManager;