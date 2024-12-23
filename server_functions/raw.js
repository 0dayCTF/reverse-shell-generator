const { rsgData } = require("../js/data.js");

const insertParameters = function (command, params) {
    // TODO: Extract the inlined JS from index.html into a new file,
    // so the insertParameters + encoding logic can be reused
    const encoder = (value) => value;

    if (command === "PowerShell #3 (Base64)") {
        return "powershell -e " + btoa(rsgData.specialCommands['PowerShell payload']
            .replace(encoder('{ip}'), encoder(params.ip))
            .replace(encoder('{port}'), encoder(String(params.port))))
    }

    return command
        .replace(encoder('{ip}'), encoder(params.ip))
        .replace(encoder('{port}'), encoder(String(params.port)))
        .replace(encoder('{shell}'), encoder(params.shell))
}

const generateCommand = function (event, _context) {
    const { path, queryStringParameters } = event;

    const requiredName = decodeURIComponent(path.substring(1));
    const selectedItem = rsgData.reverseShellCommands.find(function ({ name }) {
        return requiredName === name;
    });

    if (!selectedItem) {
        return {
            statusCode: 401,
            body: `Command name '${requiredName}' not found`
        }
    }

    const { command } = selectedItem;
    const result = insertParameters(command, queryStringParameters);

    return {
        statusCode: 200,
        body: result
    }
}

const extractRawValue = function (event) {
    const { queryStringParameters } = event;

    return {
        statusCode: 200,
        body: queryStringParameters.value
    }
}

exports.handler = async function (event, _context) {
    const { queryStringParameters } = event;
    const defaultHeaders = { headers: { 'Content-Type': "text/plain;charset=UTF-8" } };
    if (queryStringParameters.value) {
        return {
            ...defaultHeaders,
            ...extractRawValue(event)
        }
    }
    return {
        ...defaultHeaders,
        ...generateCommand(event)
    }
}
