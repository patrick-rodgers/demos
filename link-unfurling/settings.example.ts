const privateKey = `-----BEGIN RSA PRIVATE KEY-----
-----END RSA PRIVATE KEY-----
`;

const msalInit = {
    auth: {
        authority: "https://login.microsoftonline.com/{tenant id}/",
        clientCertificate: {
            thumbprint: "{thumbprint of cert}",
            privateKey: privateKey,
        },
        clientId: "{AAD app client id}",
    }
}

export const graphMSALInit = {
    init: msalInit,
    scopes: ["https://graph.microsoft.com/.default"],
}

export const spMSALInit = {
    init: msalInit,
    scopes: ["https://{tenant}.sharepoint.com/.default"],
}
