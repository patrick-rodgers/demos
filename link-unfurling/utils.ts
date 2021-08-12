export function encodeSharingUrl(url: string): string {
    return "u!" + Buffer.from(url, "utf8").toString("base64").replace(/=$/i, "").replace("/", "_").replace("+", "-");
}
