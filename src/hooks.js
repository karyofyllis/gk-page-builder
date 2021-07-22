import { useCallback, useEffect, useState } from "react";

export const useEscape = (setAnchorEl) => {
    const escFunction = useCallback((event) => {
        if(event.keyCode === 27) {
            setAnchorEl(null);
        }
    }, [setAnchorEl]);

    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);

        return () => {
            document.removeEventListener("keydown", escFunction, false);
        };
    }, [escFunction]);
}
export const useAnchor = () => {
    const [anchorEl, setAnchorEl] = useState(null);

    useEscape(setAnchorEl)

    const handleClickAway = () => {
        setAnchorEl(null);
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    return {
        anchorEl,
        handleClick,
        handleClickAway
    }
}
