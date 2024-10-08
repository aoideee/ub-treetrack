// Header Component

import "@/styles/header.css";

import Image from "next/image";
import Link from "next/link";

import NavigationBar from "@/components/navigation";

export default function Header() {
  return (
    <header className="header">
      <Link href="/">
        <div className="logo-div">
          <Image
            src="/logos/treetrack-circle-icon.png"
            alt="University of Belize TreeTrack Logo"
            width={75}
            height={75}
          />
          <div className="logo-text">
            <span className="h1">UB TreeTrack</span>
            <span>Belmopan Campus</span>
          </div>
        </div>
      </Link>
      <NavigationBar />
    </header>
  );
}
