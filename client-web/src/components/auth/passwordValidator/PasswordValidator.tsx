import React, { useEffect } from "react";
import { useAuthForm } from "../../../hooks/authForm";
import {
    MINIMUM_PASSWORD_LENGTH,
    Requirement,
} from "../../../types/passwordValidation";
import "./PasswordValidator.css";

const PasswordValidator = ({
    setIsPasswordValid,
}: {
    setIsPasswordValid: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const {
        authData: { password },
    } = useAuthForm();

    const validationResults = {
        [Requirement.MinLengthValid]:
            password.length >= MINIMUM_PASSWORD_LENGTH,
        [Requirement.HasUppercase]: /[A-Z]/.test(password),
        [Requirement.HasLowercase]: /[a-z]/.test(password),
        [Requirement.HasNumber]: /[0-9]/.test(password),
        [Requirement.HasSpecialChar]: /[^A-Za-z0-9]/.test(password),
    };

    const requirements = [
        { name: Requirement.MinLengthValid, text: "8 characters" },
        { name: Requirement.HasUppercase, text: "1 uppercase letter" },
        { name: Requirement.HasLowercase, text: "1 lowercase letter" },
        { name: Requirement.HasNumber, text: "1 number" },
        { name: Requirement.HasSpecialChar, text: "1 special character" },
    ];

    const checkValidation = (name: Requirement) => validationResults[name];

    useEffect(() => {
        setIsPasswordValid(
            Object.values(validationResults).every((result) => result === true)
        );
    });

    return (
        <>
            <h5 className="password-validator__heading">
                Your password must contain at least :
            </h5>
            <ul>
                {requirements.map((requirement) => {
                    const isRequirementMet = checkValidation(requirement.name);

                    return (
                        <li
                            className={`password-validator__requirement password-validator__requirement--${
                                isRequirementMet ? "valid" : "invalid"
                            }`}
                            key={requirement.name}
                        >
                            {requirement.text}
                        </li>
                    );
                })}
            </ul>
        </>
    );
};

export default PasswordValidator;
