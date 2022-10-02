

export const isNotEmpty = ({ value }) => !(!value || value === "");

const getValueLength = value => {
    const type = typeof value;

    if (type === "string") {
        return value.replace(/ +(?= )/g, '').length;
    } else if (Array.isArray(value)) {
        return value.length;
    } else {
        return value;
    }
}

export const minLength = ({ value, len }) => getValueLength(value) >= len;
export const maxLength = ({ value, len }) => getValueLength(value) <= len;
export const exactLength = ({ value, len }) => getValueLength(value) === len;

export const isEmail = ({ value, domains }) => {
    if (domains) {
        if (typeof domains === "string") {
            return value.endsWith(domains)
        } else {
            for (let i in domains) {
                if (value.endsWith(domains[i]))
                    return true;
            }

            return false
        }
    } else {
        return value
            .toLowerCase()
            .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    }
}

export const isInList = (value, list, matchKeys) => {
    if (!Array.isArray(list)) {
        if (matchKeys) {
            list = Object.keys(list);
        } else {
            list = Object.values(list);
        }
    }

    return list.includes(value);
}