import { Link } from "react-router-dom";
import SimpleCard from "../../../components/Card/SimpleCard";
import { textColorStyles, transitioner } from "../../../utils/styles/styles";

const StudentDashboard = ({ user }) => {
    return <div className="w-[100%] md:w-[70%] lg:w-[50%] mx-auto">
        <SimpleCard title={`Hello ${user.displayName}!!`} customStyle="rounded-xl">
            <div className="mt-5">
                <p className="text-center mb-5">Welcome to BracU (CSE) Online Utility Tools!!</p>
                <p className="text-center mb-5">
                    This application is being developed for members of the CSE Department of BracU.
                    Please let us know any feature that you would like to see on this application by filling this <a href="https://docs.google.com/forms/d/e/1FAIpQLSfUlPhnJuNjC7NwZ0PbR-WUop9PqwcsleIhNgGjNus1L1CRWw/viewform?usp=sf_link" target="_blank" className={`${textColorStyles.clickable} ${transitioner.simple}`}>form</a>!
                </p>
                <p className="text-center mb-5">
                    In the meantime, you can update your <Link className={`${textColorStyles.clickable} ${transitioner.simple}`} to="/profile">profile</Link>.
                </p>
            </div>
        </SimpleCard>
    </div>
}

export default StudentDashboard;