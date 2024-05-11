import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { Jersey_20_Charted } from "next/font/google";
const jersey = Jersey_20_Charted({ subsets: ["latin"], weight: "400" });

export const Navbar = () => {
  return (
    <div className="p-4 bg-white">
      <nav className="flex justify-between items-center">
        <Link href={"/"}>
          <div className="text-3xl text-primary">
            <div className={jersey.className}>Based Agents</div>
          </div>
        </Link>
        <ConnectButton />
      </nav>
    </div>
  );
};
