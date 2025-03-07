

export const dateFormatter = (date) => {

    const formattedDate = new Date(date).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });


    return formattedDate;
}

export const dbDateFormatter = (timestamp) => {
    const date = new Date(timestamp._seconds * 1000);

    const formattedDate = date.toLocaleDateString("en-US", {
        day: 'numeric',
        month: "long",
        year: "numeric",
    })

    return formattedDate;
}
export const dbDateFormatterShort = (timestamp) => {
    const date = new Date(timestamp._seconds * 1000);

    const formattedDate = date.toLocaleDateString("en-US", {
        day: 'numeric',
        month: "2-digit",
        year: "numeric",
    })

    return formattedDate;
}

export const dbDateInputFormatter = (timestamp) => {
    const date = new Date(timestamp._seconds * 1000);
    const formattedDate = date.toISOString().split('T')[0];
    return formattedDate
}

export const capitalizeFirstLetters = (text) => {
    return text.replace(/(?:^|\.\s*)([a-z])/g, (match, char) => char.toUpperCase());
};


export const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};


export const currencyFormatter = (amount) => {
    return Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount);
}


export const maxDate = () => {

    const today = new Date();
    const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    return eighteenYearsAgo.toISOString().split("T")[0];
}