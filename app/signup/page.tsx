import AuthForm from "@/components/AuthForm";

export const metadata = {
    title: "Sign Up | Drokpa",
    description: "Create your Drokpa account",
};

export default function SignUpPage() {
    return <AuthForm defaultMode="signup" />;
}
