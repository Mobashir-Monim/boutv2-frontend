import SimpleCard from "../../../components/Card/SimpleCard";

const SupervisorPanel = () => {
    return <SimpleCard title={"Supervision Panel"}>
        <div className="flex flex-col md:flex-row mt-5 gap-5 justify-between">
            <SimpleCard title={"Existing groups"} customStyle={"w-[100%] md:w-[55%]"}>
                
            </SimpleCard>
            <SimpleCard title={"Applications"} customStyle={"w-[100%] md:w-[40%]"}>

            </SimpleCard>
        </div>
    </SimpleCard>
}

export default SupervisorPanel;