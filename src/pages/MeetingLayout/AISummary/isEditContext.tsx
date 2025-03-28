import React from "react";

type isEditContextType = {
    feedback: string,
    setFeedback: (value: string) => void,
    isEdit: boolean,
    setIsEdit: (value: boolean) => void
    handleSendRequest: () => void
};

export const isEditContext = React.createContext<isEditContextType>({
    feedback: '',
    setFeedback: () => { },
    isEdit: false,
    setIsEdit: () => { },
    handleSendRequest: () => { }
});