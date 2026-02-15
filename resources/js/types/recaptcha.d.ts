/**
 * Google reCAPTCHA v3 TypeScript declarations
 */

interface ReCaptchaInstance {
    ready(callback: () => void): void;
    execute(siteKey: string, options: { action: string }): Promise<string>;
    render(container: string | HTMLElement, parameters: object): void;
}

declare global {
    interface Window {
        grecaptcha: ReCaptchaInstance;
    }
}

export {};
