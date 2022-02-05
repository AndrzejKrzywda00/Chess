const patterns = new Map();

const classic = {
    dark: "#1c1c1c",
    light: "#fffaf1"
};

const andrzej = {
    dark: "#668611",
    light: "#f4f6dc"
};

const deepSea = {
    dark: "#262f41",
    light: "#586475"
};

const leather = {
    dark: "#3e2d2d",
    light: "#fff1d7"
};

const candy = {
    dark: "#e47be9",
    light: "#ffe7ff"
};

const ireland = {
    dark: "#56aa55",
    light: "#eff4ee"
};

const breakingBad = {
    dark: "#64331f",
    light: "#c8a867"
};

const blueSky = {
    dark: "#0b97ba",
    light: "#cbedf2"
};

const minecraft = {
    dark: "#476125",
    light: "#9a7758"
};

const vatican = {
    dark: "#eaf63e",
    light: "#fffcef"
};

const bloodyMarry = {
    dark: "#c12828",
    light: "#f9e0dd"
};

const twitch = {
    dark: "#6441a5",
    light: "#f0f0f0"
};

const tournament = {
    dark: "#1e4129",
    light: "#e8e8e8"
};

const cobi = {
    dark: "#5a4533",
    light: "#cec4a6"
};

const messenger = {
    dark: "#006eff",
    light: "#d5389a"
};

const grey = {
    dark: "#6f6f67",
    light: "#c4c4c4"
};

const peach = {
    dark: "#b7700d",
    light: "#f4c685"
};

const joker = {
    dark: "#d83e9d",
    light: "#5ac6a4"
};

const harnasIceTea = {
    dark: "#141c83",
    light: "#d6c02f"
};

const bmw = {
    dark: "#1a2043",
    light: "#e1e0e2"
};

const classicFlat = {
    dark: "#769656",
    light: "#eeeed2"
};

const andrut = {
    dark: "#bc8c6c",
    light: "#f4dcb4"
};

patterns.set("classic", classic);
patterns.set("andrzej", andrzej);
patterns.set("deepSea", deepSea);
patterns.set("leather", leather);
patterns.set("candy", candy);
patterns.set("ireland", ireland);
patterns.set("breakingBad", breakingBad);
patterns.set("blueSky", blueSky);
patterns.set("minecraft", minecraft);
patterns.set("vatican", vatican);
patterns.set("bloodyMarry", bloodyMarry);
patterns.set("twitch", twitch);
patterns.set("tournament", tournament);
patterns.set("cobi", cobi);
patterns.set("messenger", messenger);
patterns.set("grey", grey);
patterns.set("peach", peach);
patterns.set("joker", joker);
patterns.set("harnasIceTea", harnasIceTea);
patterns.set("bwm", bmw);
patterns.set("classicFlat", classicFlat);
patterns.set("andrut", andrut);

// helper function to parse hex with # symbol to '0x' version
function parseHexTo0x(patterns) {

    patterns.forEach((value) => {

        let darkLen = value.dark.length;
        value.dark = "0x" + value.dark.substring(1,darkLen);

        let lightLen = value.light.length;
        value.light = "0x" + value.light.substring(1,lightLen);
    });

    return patterns;
}

export default parseHexTo0x(patterns);