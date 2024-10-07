// Footer Component

import "@/styles/footer.css";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <span>CodeCraft Solutions &copy; 2024</span>
      <Link href="https://github.com/andreshungbz/ub-treetrack">
        <span>GitHub Repository</span>
      </Link>
    </footer>
  );
}
