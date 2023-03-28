const getPhonePattern = (intl = {}) => {
    const iso = intl.iso2;
    const code = intl.dialCode.replace(/0/g, "\\0");
    const patterns = {
        "az": `+{${code}} (00) 000 00 00`,
        "by": `+{${code}} (00) 000 00 00`,
        "am": `+{${code}} (00) 000 000}`,
        "ge": `+{${code}} (000) 000 000`,
        "kz": `+{${code}} (700) 000 00 00`,
        "kg": `+{${code}} 0000 000 00`,
        "md": `+{${code}} 000 00000`,
        "ru": `+{${code}} (000) 000 00 00`,
        "tj": `+{${code}} 0000 0 00 00`,
        "uz": `+{${code}} 00 000 0000`,
        "ua": `+{${code}} (00) 000 00 00`,
    };

    return patterns[iso];
};

export { getPhonePattern };

