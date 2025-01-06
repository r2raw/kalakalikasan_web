import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

export const getURLString = (location, indexPos) => {
    let currLoc = location.pathname;
    currLoc = currLoc.split('/').filter(Boolean)

    if (indexPos) {
        return currLoc = currLoc[indexPos - 1]
    }
    currLoc = currLoc[currLoc.length - 1]

    return currLoc;

}


export const imageChangeHandler = (e, setImage) => {
    if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files;
        setImage(() => file);
    } else {
        setImage(null);
    }
}
export const imageChangingEffect = (image, setPreview) => {

    if (!image) return setPreview('');

    let tmp = [];

    for (let i = 0; i < image.length; i++) {
        tmp.push(URL.createObjectURL(image[i]));
    }

    const objectUrl = tmp;
    setPreview(objectUrl);

    for (let i = 0; i < objectUrl.length; i++) {
        return () => {
            URL.revokeObjectURL(objectUrl[i]);
        };
    }
}



export const multiImageChangingEffect = (image) => {


    if (!image || image.length == 0) return;

    let tmp = [];
    for (let i = 0; i < image.length; i++) {
        tmp.push(URL.createObjectURL(image[i]));
    }


    const objectUrl = tmp;
    // setPreviews((prev)=>[...prev,objectUrl]);

    return objectUrl;
}

export const multiImageChangeHandler = (e, setImages) => {
    if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files;
        setImages((prevImage) => [...prevImage, file]);
    } else {
        setImages(null);
    }
}
