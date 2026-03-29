import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";

export default tseslint.config(
    { ignores: ["dist"] },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        plugins: {
            "react-hooks": reactHooks,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            // setState calls inside effects are standard for async data-fetching hooks
            "react-hooks/set-state-in-effect": "off",
            "quotes": ["error", "single", { avoidEscape: true }],
            "semi": ["error", "never"],
            "object-curly-spacing": ["error", "always"],
        },
    }
);
