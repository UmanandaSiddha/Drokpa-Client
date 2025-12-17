import AuthForm from "@/components/AuthForm";

export const metadata = {
    title: "Sign In | Drokpa",
    description: "Access your Drokpa account",
};

export default function SignInPage() {
    return <AuthForm defaultMode="signin" />;
}
