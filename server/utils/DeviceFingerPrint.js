import crypto from 'crypto';
import { UAParser } from 'ua-parser-js';

export const getClientIP = (req) => {
    return req.headers['cf-connecting-ip'] ||
        req.headers['x-real-ip'] ||
        req.headers['x-forwarded-for']?.split(',')[0].trim() ||
        req.headers['x-forwarded'] ||
        req.headers['x-client-ip'] ||
        req.headers['forwarded-for'] ||
        req.headers['forwarded'] ||
        req.socket?.remoteAddress ||
        req.ip;
};

export function createDeviceFingerprint(req) {
    const parser = new UAParser(req.headers['user-agent']);
    const ua = parser.getResult();
    const clientIp = getClientIP(req);

    // Parse client-side fingerprint if available
    const clientFingerprint = req.headers['x-device-fingerprint']
        ? JSON.parse(req.headers['x-device-fingerprint'])
        : {};

    // Core fingerprint components (always available)
    const components = {
        // User Agent
        browser: `${ua.browser.name || 'unknown'}:${ua.browser.version || '0'}`,
        os: `${ua.os.name || 'unknown'}:${ua.os.version || '0'}`,
        deviceType: ua.device.type || 'desktop',

        // Network
        ip: clientIp,

        // Language
        language: req.headers['accept-language'] || 'unknown',

        // Client-side components
        screen: clientFingerprint.screen || 'unknown',
        timezone: clientFingerprint.timezone || 'unknown',
        hardware: clientFingerprint.hardwareConcurrency || 'unknown',
        memory: clientFingerprint.deviceMemory || 'unknown',
        canvas: clientFingerprint.canvas || 'none',
        webgl: clientFingerprint.webgl || 'none',

        // Security headers
        secHeaders: {
            dnt: req.headers['dnt'] || '0',
            secChUa: req.headers['sec-ch-ua'] || 'none',
            secChUaMobile: req.headers['sec-ch-ua-mobile'] || '?0'
        }
    };

    // Enhanced components (if available)
    try {
        if (req.headers['x-device-fingerprint']) {
            const clientFingerprint = JSON.parse(req.headers['x-device-fingerprint']);
            components.enhanced = {
                screen: clientFingerprint.screen || 'unknown',
                timezone: clientFingerprint.timezone || 'unknown',
                hardware: clientFingerprint.hardwareConcurrency || 'unknown',
                deviceMemory: clientFingerprint.deviceMemory || 'unknown'
            };
        }
    } catch (e) {
        console.warn('Failed to parse client fingerprint', e);
    }

    // Generate consistent hash
    return crypto
        .createHash('sha256')
        .update(JSON.stringify(components))
        .digest('hex');
}

export async function sendNewDeviceNotification(email, deviceInfo) {
    // Implementation depends on your email service
    await sendMail({
        to: email,
        subject: 'New Device Login Detected',
        html: `A login was detected from a new device:<br><br>
               IP: ${deviceInfo.ip}<br>
               Device ID: ${deviceInfo.deviceId}<br>
               Time: ${deviceInfo.time}`
    });
}

// For the delay function
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}