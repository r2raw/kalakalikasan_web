

export const dateFormatter = (date)=>{

    const formattedDate = new Date(date).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });


      return formattedDate;
}

export const dbDateFormatter  = (timestamp) =>{
    const date = new Date(timestamp._seconds * 1000);

    const formattedDate = date.toLocaleDateString("en-US", {
        day: 'numeric',
        month:"long",
        year: "numeric",
    })

    return formattedDate;
}

export const dbDateInputFormatter = (timestamp) =>{
    const date = new Date(timestamp._seconds * 1000);
    const formattedDate = date.toISOString().split('T')[0];
    return formattedDate
}

export const capitalizeFirstLetters = (text) => {
    return text.replace(/(?:^|\.\s*)([a-z])/g, (match, char) => char.toUpperCase());
};
