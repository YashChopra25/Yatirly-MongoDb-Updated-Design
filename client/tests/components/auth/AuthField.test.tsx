import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Lock, Mail } from "lucide-react";
import AuthField from "@/components/auth/AuthField";

describe("AuthField", () => {
  it("renders a labelled input and forwards props", async () => {
    const onChange = vi.fn();
    render(<AuthField id="email" label="Email" type="email" icon={Mail} onChange={onChange} placeholder="you@x.com" />);
    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("type", "email");
    expect(input).toHaveAttribute("placeholder", "you@x.com");
    await userEvent.type(input, "a");
    expect(onChange).toHaveBeenCalled();
  });

  it("has no reveal button for non-password fields", () => {
    render(<AuthField id="email" label="Email" type="email" icon={Mail} />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("toggles password visibility", async () => {
    render(<AuthField id="password" label="Password" type="password" icon={Lock} />);
    const input = screen.getByLabelText("Password");
    expect(input).toHaveAttribute("type", "password");

    await userEvent.click(screen.getByRole("button", { name: "Show password" }));
    expect(input).toHaveAttribute("type", "text");
    expect(screen.getByRole("button", { name: "Hide password" })).toHaveAttribute("aria-pressed", "true");

    await userEvent.click(screen.getByRole("button", { name: "Hide password" }));
    expect(input).toHaveAttribute("type", "password");
  });
});
