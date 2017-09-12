module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "rules": {
        "indent": [
            "error",
            4,
            {
                "SwitchCase": 1
            }
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],

        // no modules due to size restrictions, so using globals intensively
        "no-undef": "off",
        // same for global vars
        "no-unused-vars": ["error", { "vars": "local"}],
        // allow errors
        "no-console": [1, { "allow": ["warn", "error"] }],
        // that's fine for bytesaving
        "no-sparse-arrays": "off"
    }
};