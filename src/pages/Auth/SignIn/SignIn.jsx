import { Link } from "react-router-dom";
import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const SignIn = () => {
  return (
    <div className="flex min-h-screen flex-1 flex-col justify-center px-4 py-10 lg:px-6 bg-background">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex items-center space-x-2.5 justify-center">
          <h3 className="web-logo text-2xl font-bold">
            Fuego<span className="text-primary">X</span>Relvetti
          </h3>
        </div>

        <h1 className="mt-6 text-2xl font-semibold text-center">
          Sign in to your account
        </h1>

        <p className="mt-2 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-primary hover:text-primary/90 underline underline-offset-4"
          >
            Sign up
          </Link>
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-2">
          <Button variant="outline" className="w-full" asChild>
            <Link href="#" className="gap-2">
              <Github className="h-4 w-4" />
              Login with GitHub
            </Link>
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link href="#" className="gap-2">
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M3.064 7.51A9.996 9.996 0 0 1 12 2c2.695 0 4.959.99 6.69 2.605l-2.867 2.868C14.786 6.482 13.468 5.977 12 5.977c-2.605 0-4.81 1.76-5.595 4.123-.2.6-.314 1.24-.314 1.9 0 .66.114 1.3.314 1.9.786 2.364 2.99 4.123 5.595 4.123 1.345 0 2.49-.355 3.386-.955a4.6 4.6 0 0 0 1.996-3.018H12v-3.868h9.418c.118.654.182 1.336.182 2.045 0 3.046-1.09 5.61-2.982 7.35C16.964 21.105 14.7 22 12 22A9.996 9.996 0 0 1 2 12c0-1.614.386-3.14 1.064-4.49Z"
                />
              </svg>
              Login with Google
            </Link>
          </Button>
        </div>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <Separator />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">or</span>
          </div>
        </div>

        <form action="#" method="post" className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <Input
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              placeholder="john@company.com"
              className="mt-2"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <Input
              type="password"
              id="password"
              name="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              className="mt-2"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Forgot your password?{" "}
          <Link
            href="/reset-password"
            className="font-medium text-primary hover:text-primary/90 underline underline-offset-4"
          >
            Reset password
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
