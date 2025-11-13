import * as React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff } from "lucide-react";

type Role = "student" | "client" | "admin";
const normalizeRole = (v: any): Role =>
	v === "student" || v === "client" || v === "admin" ? v : "client";

const Auth: React.FC = () => {
	const { signUp, user, userRole, continueAsGuest, loading } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const { toast } = useToast();

	// Derive initial tab from location on first mount to avoid flicker
	const initialTab = React.useMemo<"signin" | "signup" | "waitlist">(() => {
		try {
			const st = location.state as any;
			const params = new URLSearchParams(location.search);
			const wantsSignup = Boolean(
				st?.signup ||
				st?.tab === "signup" ||
				params.get("signup") === "1" ||
				params.get("tab") === "signup"
			);
			return wantsSignup ? "signup" : "signin";
		} catch {
			return "signin";
		}
	}, [location.state, location.search]);
	const [tab, setTab] = React.useState<"signin" | "signup" | "waitlist">(initialTab);
	const [signInData, setSignInData] = React.useState({ email: "", password: "" });
	const [signUpData, setSignUpData] = React.useState({
		email: "",
		password: "",
		firstName: "",
		lastName: "",
		role: "student",
	});
	const [waitlistData, setWaitlistData] = React.useState({
		email: "",
		firstName: "",
		lastName: "",
		role: "student",
		city: "",
		passcode: "",
	});
	const [submitting, setSubmitting] = React.useState<"in" | "up" | "reset" | "resend" | "waitlist" | null>(null);
	const [showPasscode, setShowPasscode] = React.useState(false);
	const [showSignInPassword, setShowSignInPassword] = React.useState(false);
	const [showSignUpPassword, setShowSignUpPassword] = React.useState(false);

	React.useEffect(() => {
		if (!loading && user) {
			navigate('/', { replace: true });
		}
	}, [loading, user, navigate]);

	// If redirected from a restricted guest action, switch to signup tab
	React.useEffect(() => {
		const st = location.state as any;
		const params = new URLSearchParams(location.search);
		const wantsSignup = Boolean(
			st?.signup ||
			st?.tab === "signup" ||
			params.get("signup") === "1" ||
			params.get("tab") === "signup"
		);
		if (wantsSignup) setTab("signup");
	}, [location.state, location.search]);

	const handleSignIn = async (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitting("in");

		const email = signInData.email.trim().toLowerCase();
		const password = signInData.password;

		try {
			const { error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});
			if (error) {
				toast({
					title: "Sign in failed",
					description: error.message || "Please check your email and password.",
					variant: "destructive",
				});
				return;
			}
		} finally {
			setSubmitting(null);
		}
	};

	const resendConfirmation = async (email: string) => {
		setSubmitting("resend");
		try {
			const { error } = await supabase.auth.resend({
				type: "signup",
				email,
				options: { emailRedirectTo: `${window.location.origin}/auth` },
			});
			if (error) {
				toast({ title: "Couldn't resend confirmation", description: error.message, variant: "destructive" });
			} else {
				toast({ title: "Confirmation sent", description: "Check your inbox for the confirmation link." });
			}
		} catch (e: any) {
			toast({ title: "Couldn't resend confirmation", description: e?.message ?? String(e), variant: "destructive" });
		} finally {
			setSubmitting(null);
		}
	};

	const handleSignUp = async (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitting("up");

		const email = signUpData.email.trim().toLowerCase();
		const { password, firstName, lastName, role } = signUpData;
		try {
			const { data, error } = await supabase.auth.signUp({
				email,
				password,
				options: {
					emailRedirectTo: `${window.location.origin}/auth`,
					data: {
						first_name: firstName,
						last_name: lastName,
						display_name: firstName || email.split("@")[0],
						role: normalizeRole(role),
					},
				},
			});

			const identitiesLen = (data?.user as any)?.identities?.length ?? undefined;
			const msg = (error?.message || "").toLowerCase();
			const alreadyRegistered =
				error?.status === 422 ||
				msg.includes("already registered") ||
				msg.includes("already exists") ||
				msg.includes("duplicate") ||
				identitiesLen === 0;

			if (alreadyRegistered) {
				toast({
					title: "Email already registered",
					description: "Try signing in instead, or reset your password.",
					variant: "destructive",
				});
				setTab("signin");
				return;
			}

			if (error) {
				toast({
					title: "Couldn't create account",
					description: error.message || "Please try again.",
					variant: "destructive",
				});
				return;
			}

			toast({
				title: "Check your email",
				description: "We sent a confirmation link to complete sign up.",
			});
			setTab("signin");

			setTimeout(() => {
				toast({
					title: "Didn't get it?",
					description: "You can resend the confirmation email.",
					action: (
						<Button
							variant="outline"
							onClick={() => resendConfirmation(email)}
							disabled={submitting === "resend"}
						>
							Resend
						</Button>
					),
				});
			}, 600);
		} finally {
			setSubmitting(null);
		}
	};

	const handleResetPassword = async () => {
		const email = signInData.email.trim().toLowerCase();
		if (!email) {
			toast({
				title: "Enter your email first",
				description: "Type your email above, then click 'Forgot password?'",
			});
			return;
		}
		setSubmitting("reset");
		try {
			const { error } = await supabase.auth.resetPasswordForEmail(email, {
				redirectTo: `${window.location.origin}/auth`,
			});
			if (error) {
				toast({ title: "Reset failed", description: error.message, variant: "destructive" });
			} else {
				toast({ title: "Check your email", description: "We sent a password reset link." });
			}
		} finally {
			setSubmitting(null);
		}
	};

	const handleWaitlist = async (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitting("waitlist");

		try {
			// Check if all required fields are filled
			const missingFields = [];
			if (!waitlistData.firstName.trim()) missingFields.push("First name");
			if (!waitlistData.lastName.trim()) missingFields.push("Last name");
			if (!waitlistData.email.trim()) missingFields.push("Email");
			if (!waitlistData.role) missingFields.push("Role");
			if (!waitlistData.city.trim()) missingFields.push("City");
			if (waitlistData.role && !waitlistData.passcode.trim()) missingFields.push("Passcode");
			if (missingFields.length > 0) {
				toast({
					title: "Missing required information",
					description: `One or more of the following boxes still require input: ${missingFields.join(", ")}.`,
					variant: "destructive",
				});
				return;
			}

			const rolePasscodes = {
				student: "STU-2025",
				client: "CLI-2025",
				admin: "ADM-2025"
			};

			if (waitlistData.role && waitlistData.passcode !== rolePasscodes[waitlistData.role as keyof typeof rolePasscodes]) {
				toast({
					title: "Invalid passcode",
					description: "Please enter the correct passcode for your selected role.",
					variant: "destructive",
				});
				return;
			}

			const { error } = await supabase
				.from("waitlist")
				.insert({
					email: waitlistData.email,
					first_name: waitlistData.firstName,
					last_name: waitlistData.lastName,
					role: waitlistData.role,
					city: waitlistData.city,
				});

			if (error) {
				if (error.code === '23505') {
					toast({
						title: "Already on waitlist",
						description: "This email is already registered for the waitlist.",
						variant: "destructive",
					});
				} else {
					toast({
						title: "Couldn't join waitlist",
						description: error.message || "Please try again.",
						variant: "destructive",
					});
				}
				return;
			}

			toast({
				title: "Welcome to the waitlist!",
				description: "We'll notify you when we're ready to onboard new users.",
			});

			setWaitlistData({
				email: "",
				firstName: "",
				lastName: "",
				role: "student",
				city: "",
				passcode: "",
			});

			setTab("signin");
		} finally {
			setSubmitting(null);
		}
	};

	const handleGuest = () => {
		continueAsGuest();
		navigate("/", { replace: true });
	};

	return (
		<div className="min-h-screen w-full grid place-items-center px-4 py-10">
			<Card className="w-full max-w-2xl shadow-lg">
				<CardHeader className="text-center">
					<CardTitle className="text-2xl">Welcome to MyVillage</CardTitle>
					<p className="text-sm text-muted-foreground">Sign in or create an account to continue</p>
				</CardHeader>
				<CardContent className="pt-0">
					<Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="w-full">
						<TabsList className="grid grid-cols-3 w-full">
							<TabsTrigger value="signin">Sign In</TabsTrigger>
							<TabsTrigger value="signup">Sign Up</TabsTrigger>
							<TabsTrigger value="waitlist">Waitlist</TabsTrigger>
						</TabsList>

						<TabsContent value="signin" className="mt-6">
							<form onSubmit={handleSignIn} className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="email-in">Email</Label>
									<Input
										id="email-in"
										type="email"
										placeholder="you@example.com"
										value={signInData.email}
										onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
										required
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="password-in">Password</Label>
									<div className="relative">
										<Input
											id="password-in"
											type={showSignInPassword ? "text" : "password"}
											placeholder="••••••••"
											value={signInData.password}
											onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
											required
											className="pr-10"
										/>
										<Button
											type="button"
											variant="ghost"
											size="sm"
											className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
											onClick={() => setShowSignInPassword(!showSignInPassword)}
										>
											{showSignInPassword ? (
												<EyeOff className="h-4 w-4" />
											) : (
												<Eye className="h-4 w-4" />
											)}
										</Button>
									</div>
								</div>
								<Button type="submit" className="w-full" disabled={submitting === "in"}>
									{submitting === "in" ? "Signing in..." : "Sign In"}
								</Button>

								<button
									type="button"
									className="mt-2 text-xs text-muted-foreground underline"
									onClick={handleResetPassword}
									disabled={submitting === "reset"}
								>
									{submitting === "reset" ? "Sending reset link..." : "Forgot password?"}
								</button>
							</form>
						</TabsContent>

						<TabsContent value="signup" className="mt-6">
							<form onSubmit={handleSignUp} className="space-y-4">
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="first">First name</Label>
										<Input
											id="first"
											placeholder="First name"
											value={signUpData.firstName}
											onChange={(e) => setSignUpData({ ...signUpData, firstName: e.target.value })}
											required
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="last">Last name</Label>
										<Input
											id="last"
											placeholder="Last name"
											value={signUpData.lastName}
											onChange={(e) => setSignUpData({ ...signUpData, lastName: e.target.value })}
											required
										/>
									</div>
								</div>
								<div className="space-y-2">
									<Label htmlFor="email-up">Email</Label>
									<Input
										id="email-up"
										type="email"
										placeholder="you@example.com"
										value={signUpData.email}
										onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
										required
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="password-up">Password</Label>
									<div className="relative">
										<Input
											id="password-up"
											type={showSignUpPassword ? "text" : "password"}
											placeholder="Create a password"
											value={signUpData.password}
											onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
											required
											className="pr-10"
										/>
										<Button
											type="button"
											variant="ghost"
											size="sm"
											className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
											onClick={() => setShowSignUpPassword(!showSignUpPassword)}
										>
											{showSignUpPassword ? (
												<EyeOff className="h-4 w-4" />
											) : (
												<Eye className="h-4 w-4" />
											)}
										</Button>
									</div>
								</div>
								<div className="space-y-2">
									<Label>Role</Label>
									<Select
										value={signUpData.role}
										onValueChange={(v) => setSignUpData({ ...signUpData, role: v })}
									>
										<SelectTrigger>
											<SelectValue placeholder="Select a role" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="student">Student</SelectItem>
											<SelectItem value="client">Client</SelectItem>
											<SelectItem value="admin">Admin</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<Button type="submit" className="w-full" disabled={submitting === "up"}>
									{submitting === "up" ? "Creating account..." : "Create Account"}
								</Button>
							</form>
						</TabsContent>

						<TabsContent value="waitlist" className="mt-6">
							<form onSubmit={handleWaitlist} className="space-y-4">
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="first-waitlist">First name</Label>
										<Input
											id="first-waitlist"
											placeholder="First name"
											value={waitlistData.firstName}
											onChange={(e) => setWaitlistData({ ...waitlistData, firstName: e.target.value })}
											required
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="last-waitlist">Last name</Label>
										<Input
											id="last-waitlist"
											placeholder="Last name"
											value={waitlistData.lastName}
											onChange={(e) => setWaitlistData({ ...waitlistData, lastName: e.target.value })}
											required
										/>
									</div>
								</div>
								<div className="space-y-2">
									<Label htmlFor="email-waitlist">Email</Label>
									<Input
										id="email-waitlist"
										type="email"
										placeholder="you@example.com"
										value={waitlistData.email}
										onChange={(e) => setWaitlistData({ ...waitlistData, email: e.target.value })}
										required
									/>
								</div>
								<div className="space-y-2">
									<Label>Role</Label>
									<Select
										value={waitlistData.role}
										onValueChange={(v) => setWaitlistData({ ...waitlistData, role: v, passcode: "" })}
										required
									>
										<SelectTrigger>
											<SelectValue placeholder="Select role" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="student">Student</SelectItem>
											<SelectItem value="client">Client</SelectItem>
											<SelectItem value="admin">Admin</SelectItem>
										</SelectContent>
									</Select>
								</div>
								{waitlistData.role && (
									<div className="space-y-2">
										<Label htmlFor="passcode-waitlist">Passcode</Label>
										<div className="relative">
											<Input
												id="passcode-waitlist"
												type={showPasscode ? "text" : "password"}
												placeholder="Enter passcode"
												value={waitlistData.passcode}
												onChange={(e) => setWaitlistData({ ...waitlistData, passcode: e.target.value })}
												required
												className="pr-10"
											/>
											<Button
												type="button"
												variant="ghost"
												size="sm"
												className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
												onClick={() => setShowPasscode(!showPasscode)}
											>
												{showPasscode ? (
													<EyeOff className="h-4 w-4" />
												) : (
													<Eye className="h-4 w-4" />
												)}
											</Button>
										</div>
									</div>
								)}
								<div className="space-y-2">
									<Label htmlFor="city-waitlist">City</Label>
									<Input
										id="city-waitlist"
										placeholder="e.g., Jacksonville, Orlando, Tampa"
										value={waitlistData.city}
										onChange={(e) => setWaitlistData({ ...waitlistData, city: e.target.value })}
										required
									/>
								</div>
								<Button type="submit" className="w-full" disabled={submitting === "waitlist"}>
									{submitting === "waitlist" ? "Joining waitlist..." : "Join Waitlist"}
								</Button>
								<p className="text-xs text-muted-foreground text-center">
									We'll notify you when we're ready to onboard new users.
								</p>
							</form>
						</TabsContent>
					</Tabs>

					<Separator className="my-6" />

					<div className="space-y-3">
						<Button variant="outline" className="w-full" onClick={handleGuest}>
							Continue as Guest
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default Auth;
// ...full code from commit 56b4390 goes here...
