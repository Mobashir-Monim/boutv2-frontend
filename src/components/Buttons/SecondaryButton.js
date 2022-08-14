import { buttonStyles } from "../../utils/styles/styles";
import BaseButton from "./BaseButton";

const SecondaryButton = ({ text, type = "button", clickFunction, params, link }) => <>
    <BaseButton
        text={text}
        type={type}
        clickFunction={clickFunction}
        params={params}
        link={link}
        style={buttonStyles.secondary}
    />
</>;

export default SecondaryButton;