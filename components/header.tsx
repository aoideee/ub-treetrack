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
            src="/images/treetrack-icon.png"
            alt="University of Belize TreeTrack Logo"
            width={75}
            height={75}
          />
          <div className="logo-text">
            <h1 className="h1">UB TreeTrack</h1>
            <p>Belmopan Campus</p>
          </div>
        </div>
      </Link>
      <NavigationBar />
    </header>
  );
}
