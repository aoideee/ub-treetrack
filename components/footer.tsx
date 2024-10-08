// Footer Component

import "@/styles/footer.css";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <span>
        CodeCraft Solutions &copy; 2024 |{" "}
        <Link href="https://github.com/andreshungbz/ub-treetrack">
          GitHub Repository
        </Link>
      </span>
    </footer>
  );
}
