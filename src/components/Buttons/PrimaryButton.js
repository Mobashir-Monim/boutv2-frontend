import { buttonStyles } from "../../utils/styles/styles";
import BaseButton from "./BaseButton";

const PrimaryButton = ({ text, type = "button", clickFunction, params, link, customStyle }) => <>
    <BaseButton
        text={text}
        type={type}
        clickFunction={clickFunction}
        params={params}
        link={link}
        style={[buttonStyles.primary, customStyle].join(" ")}
    />
</>;

export default PrimaryButton;