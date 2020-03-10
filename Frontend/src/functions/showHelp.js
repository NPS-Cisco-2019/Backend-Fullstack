const toShowHelp = arg => {
    const val = +sessionStorage.getItem("helpSeen");
    if (localStorage.getItem("helpMode") === "true") {
        return true;
    }

    if (sessionStorage.getItem("new") === "true") {
        return val < arg;
    }

    return false;
};

export default toShowHelp;