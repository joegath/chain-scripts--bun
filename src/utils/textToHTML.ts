const capitalize = (input: string) =>
    `${input.charAt(0).toUpperCase()}${input.slice(1)}`;

const capitalizeKey = (input: string) =>
    input.split(/(?=[A-Z])/).map(word => capitalize(word)).join(' ');

const newLineToken = "%0A";

const lineBreak = newLineToken.repeat(2);

const formatTitle = (title: string) => `<b>${title}</b>`;

const formatArray = (childArray: any[]) =>
    childArray.map((child, index) => `- ${child}`).join(newLineToken);

const formatEntry = ([key, value]: [key: string, value: string]) => {

    const formattedTitle = formatTitle(capitalizeKey(key));
    const formattedBody = Array.isArray(value) ? formatArray(value) : value;

    return `${formattedTitle}${newLineToken}${formattedBody}`;
};

export const toHtmlFormat = ({title, body}: {title: string, body: object}) => {

    const formattedTitle = formatTitle(title);
    const formattedBody = Object.entries(body).map(formatEntry).join(lineBreak);

    return `${formattedTitle}${lineBreak}${formattedBody}`;
};
