const browsers = [
    { name: 'Chrome', value: 'Chrome', version: 'Chrome' },
    { name: 'Firefox', value: 'Firefox', version: 'Firefox' },
    { name: 'Safari', value: 'Safari', version: 'Version' }
]

let header = [
    navigator.platform,
    navigator.userAgent,
    navigator.appVersion,
    navigator.vendor,
    window.opera
];

function matchItem(string, data) {
    let i = 0,
        j = 0,
        regex,
        regexv,
        match,
        matches,
        version;
    
    for (i = 0; i < data.length; i += 1) {
        regex = new RegExp(data[i].value, 'i');
        match = regex.test(string);
        if (match) {
            regexv = new RegExp(data[i].version + '[- /:;]([._]+)', 'i');
            matches = string.match(regexv);
            version = '';
            if (matches) { if (matches[1]) { matches = matches[1]; } }
            if (matches) {
                matches = matches.split(/[._]+/);
                for (j = 0; j < matches.length; j += 1) {
                    if (j === 0) {
                        version += matches[j] + '.';
                    } else {
                        version += matches[j];
                    }
                }
            } else {
                version = '0';
            }
            return {
                name: data[i].name,
                version: parseFloat(version)
            };
        }
    }
    return { name: 'unknown', version: 0 };
}

let agent = header.join(' ');
let browser = matchItem(agent, browsers);

export default browser.name.toLowerCase();