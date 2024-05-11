import { Image } from "@nextui-org/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";

export const Navbar = () => {
  return (
    <div className="p-4 bg-white">
      <nav className="flex justify-between items-center">
        <Link href={"/"}>
          <div className="text-black font-black">AI Tokenbount Agent</div>
        </Link>
        <ConnectButton />
      </nav>
    </div>
  );
};