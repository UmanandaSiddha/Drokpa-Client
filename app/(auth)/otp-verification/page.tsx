import OtpVerificationClient from "../../../client/OtpVerificationClient";

export const metadata = {
    title: "OTP Verification | Drokpa",
    description: "Verify your account with a one-time password",
};

export default function OtpVerificationPage() {
    return (
        <OtpVerificationClient />
    );
}
