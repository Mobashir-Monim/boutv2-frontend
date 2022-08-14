import { buttonStyles } from "../../utils/styles/styles";
import BaseButton from "./BaseButton";

const PrimaryButton = ({ text, type = "button", clickFunction, params, link }) => <>
    <BaseButton
        text={text}
        type={type}
        clickFunction={clickFunction}
        params={params}
        link={link}
        style={buttonStyles.primary}
    />
</>;

export default PrimaryButton;