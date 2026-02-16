"use client";

import { useMemo } from "react";
import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";
import { getCountryCallingCode } from "libphonenumber-js";

export type CountryOption = {
    code: string;
    name: string;
    callingCode: string;
};

let localeRegistered = false;

const ensureLocale = () => {
    if (!localeRegistered) {
        countries.registerLocale(en);
        localeRegistered = true;
    }
};

export const useCountryOptions = (): CountryOption[] => {
    return useMemo(() => {
        ensureLocale();
        const names = countries.getNames("en");

        const options = Object.keys(names).reduce<CountryOption[]>((acc, code) => {
            const name = countries.getName(code, "en");
            if (!name) {
                return acc;
            }

            try {
                const callingCode = "+" + getCountryCallingCode(code as any);
                acc.push({ code, name, callingCode });
            } catch {
                return acc;
            }

            return acc;
        }, []);

        options.sort((a, b) => a.name.localeCompare(b.name));
        return options;
    }, []);
};
