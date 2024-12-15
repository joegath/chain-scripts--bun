export const makePostRequest = async ({url, details}: {url: string; details: any}) => {
    try {
        const response = await fetch(url,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(details),
            });
        const json = await response.json();
        return json;
    } catch (error) {
        //be carefull not to log sensitive data
        throw new Error("Error at makePostRequest");
    }
};